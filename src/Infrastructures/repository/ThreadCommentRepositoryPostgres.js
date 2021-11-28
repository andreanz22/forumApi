const AddedThreadComment = require('../../Domains/threads/comments/entities/AddedThreadComment');
const Comment = require('../../Domains/threads/comments/entities/Comment');
const ThreadCommentRepository = require('../../Domains/threads/comments/ThreadCommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const { mapCommentModel, mapCommentRepliesModel } = require('../../Commons/Utils/MapsArray');

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment({
        content, threadId, owner, commentId = null,
    }) {
        const id = `comment-${this._idGenerator()}`;
        const insertedAt = new Date().toISOString();

        const query = {
            text: 'INSERT INTO thread_comments(id, content, owner, thread_id, parent_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
            values: [id, content, owner, threadId, commentId, insertedAt, insertedAt],
        };

        const result = await this._pool.query(query);
        return new AddedThreadComment({ ...result.rows[0] });
    }

    async deleteComment(id) {
        const query = {
            text: 'update thread_comments set is_deleted = true WHERE id = $1',
            values: [id],
        };

        await this._pool.query(query);
    }

    async verifyAvailableComment({ commentId, threadId }) {
        const query = {
            text: 'SELECT id, thread_id, owner FROM thread_comments WHERE id = $1 and thread_id = $2 and is_deleted = false',
            values: [commentId, threadId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('comment tidak ditemukan atau sudah dihapus');
        }
    }

    async getComments(threadId) {
        const query = {
            text: `SELECT thread_comments.*, users.username FROM thread_comments 
                    inner join users on users.id = thread_comments.owner
                    WHERE thread_id = $1 and parent_id is NULL order by thread_comments.created_at asc`,
            values: [threadId],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            return null;
        }

        const mappedResult = await result.rows.map(mapCommentModel);
        return mappedResult;
        // const mappedResult = await result.rows.map(async (data) => {
        //     const replies = await this.getReplies(data.id);
        //     if (replies) {
        //         return { ...mapCommentModel(data), replies };
        //     }
        //     return { ...mapCommentModel(data) };
        // });
        // return Promise.all(mappedResult);
    }

    async getComment({ commentId, threadId, replyId = null }) {
        let query;
        if (replyId) {
            query = {
                text: 'SELECT id, thread_id, owner FROM thread_comments WHERE id = $1 and thread_id = $2 and parent_id = $3 and is_deleted = false',
                values: [replyId, threadId, commentId],
            };
        } else {
            query = {
                text: 'SELECT id, thread_id, owner FROM thread_comments WHERE id = $1 and thread_id = $2 and is_deleted = false',
                values: [commentId, threadId],
            };
        }

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('comment tidak ditemukan atau sudah dihapus');
        }

        return result.rows[0];
    }

    async getReplies(parentIds) {
        const query = {
            text: `SELECT thread_comments.*, users.username FROM thread_comments 
                    inner join users on users.id = thread_comments.owner
                    WHERE parent_id = ANY($1::text[]) order by thread_comments.created_at asc`,
            values: [parentIds],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            return null;
        }

        return result.rows;
    }

    //     select
    //     thread_comments.*, count(likes.*) as likeCount
    // from thread_comments
    // inner join users on users.id = thread_comments.owner
    // inner join likes on likes.comment_id = thread_comments.id
    // where thread_comments.id = 'comment--EMSPf2e64ChUTPXVM4wo'
    // group by thread_comments.id;

    // async getReplies(parentId) {
    //     const query = {
    //         text: `SELECT thread_comments.*, users.username FROM thread_comments
    //                 inner join users on users.id = thread_comments.owner
    //                 WHERE parent_id = $1 order by thread_comments.created_at asc`,
    //         values: [parentId],
    //     };

    //     const result = await this._pool.query(query);
    //     if (!result.rowCount) {
    //         return null;
    //     }

    //     return result.rows.map(mapCommentRepliesModel);
    // }
}

module.exports = ThreadCommentRepositoryPostgres;
