const Like = require('../../Domains/threads/likes/entities/Like');
const LikeRepository = require('../../Domains/threads/likes/LikeRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class LikeRepositoryPostgres extends LikeRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async getLike({ commentId, owner }) {
        const query = {
            text: 'SELECT * FROM likes WHERE likes.comment_id = $1 and likes.owner = $2',
            values: [commentId, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            return null;
        }

        return new Like({ ...result.rows[0] });
    }

    async like(addLike) {
        const { commentId, owner } = addLike;
        const id = `like-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO likes VALUES($1, $2, $3)',
            values: [id, commentId, owner],
        };

        await this._pool.query(query);
    }

    async unlike(id) {
        const query = {
            text: 'DELETE FROM likes WHERE id = $1',
            values: [id],
        };

        await this._pool.query(query);
    }
}

module.exports = LikeRepositoryPostgres;
