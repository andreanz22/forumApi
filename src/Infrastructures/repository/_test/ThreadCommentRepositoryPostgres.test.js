const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');

const AddThreadComment = require('../../../Domains/threads/comments/entities/AddThreadComment');
const AddReply = require('../../../Domains/threads/comments/entities/AddReply');
const AddedThreadComment = require('../../../Domains/threads/comments/entities/AddedThreadComment');
const pool = require('../../database/postgres/pool');
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({ username: 'Renova' });
        await ThreadTableTestHelper.addThread({ owner: 'user-123' });
    });

    afterEach(async () => {
        await ThreadCommentTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await ThreadTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('addComment function', () => {
        it('should return thread comment data correctly', async () => {
            // Arrange
            const commentPayload = {
                content: 'hiyaaa',
                threadId: 'thread-123',
                owner: 'user-123',
            };

            const addThreadComment = new AddThreadComment(commentPayload);

            const fakeIdGenerator = () => '123'; // stub!
            const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedThreadComment = await commentRepositoryPostgres.addComment(addThreadComment);
            // Assert
            expect(addedThreadComment).toStrictEqual(new AddedThreadComment({
                id: 'comment-123',
                content: commentPayload.content,
                owner: commentPayload.owner,
            }));
        });

        it('should return thread comment replies data correctly', async () => {
            // Arrange
            const commentPayload = {
                content: 'hiyaaa',
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-123',
            };

            const addReply = new AddReply(commentPayload);

            const fakeIdGenerator = () => '123'; // stub!
            const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedThreadComment = await commentRepositoryPostgres.addComment(addReply);
            // Assert
            expect(addedThreadComment).toStrictEqual(new AddedThreadComment({
                id: 'comment-123',
                content: commentPayload.content,
                owner: commentPayload.owner,
            }));
        });
    });

    describe('deleteComment function', () => {
        it('should delete thread comment data', async () => {
            // Arrange
            await ThreadCommentTableTestHelper.addComment({ content: 'hiyaa' });
            const fakeIdGenerator = () => '123'; // stub!
            const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadCommentRepositoryPostgres.deleteComment('comment-123');

            // Assert
            const comment = await ThreadCommentTableTestHelper.findComment('comment-123');
            expect(comment).toHaveLength(0);
        });
    });

    describe('getComment function', () => {
        it('should throw error when comment not found', async () => {
            // Arrange
            const fakeIdGenerator = () => '123'; // stub!
            const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

            const payload = {
                commentId: 'comment-46',
                threadId: 'thread-123',
            };
            await expect(threadCommentRepositoryPostgres.getComment(payload)).rejects.toThrowError(NotFoundError);
        });

        it('should return comment data', async () => {
            await ThreadCommentTableTestHelper.addComment({ content: 'hiyaa' });
            const fakeIdGenerator = () => '123'; // stub!
            const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

            const payload = {
                commentId: 'comment-123',
                threadId: 'thread-123',
            };
            const comment = await threadCommentRepositoryPostgres.getComment(payload);

            expect(comment).toStrictEqual({
                id: 'comment-123',
                thread_id: 'thread-123',
                owner: 'user-123',
            });
        });
    });

    describe('getComments function', () => {
        it('should return wihtout comments data', async () => {
            const fakeIdGenerator = () => '123'; // stub!
            const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

            const threadId = 'thread-123';
            const comments = await threadCommentRepositoryPostgres.getComments(threadId);

            expect(comments).toStrictEqual(null);
        });

        it('should return comments data', async () => {
            const dateTest = new Date('2021-11-17T08:58:02.684Z').toISOString();
            await ThreadCommentTableTestHelper.addComment({ id: 'comment-123', content: 'hiyaa', insertedAt: dateTest });
            await ThreadCommentTableTestHelper.addComment({ id: 'comment-1234', content: 'hiyaa', insertedAt: dateTest });
            const fakeIdGenerator = () => '123'; // stub!
            const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

            const threadId = 'thread-123';
            const comments = await threadCommentRepositoryPostgres.getComments(threadId);

            expect(comments).toHaveLength(2);
            expect(comments).toStrictEqual([
                {
                    id: 'comment-123',
                    username: 'Renova',
                    content: 'hiyaa',
                    date: dateTest,
                },
                {
                    id: 'comment-1234',
                    username: 'Renova',
                    content: 'hiyaa',
                    date: dateTest,
                },
            ]);
        });
    });

    describe('getReplies function', () => {
        beforeEach(async () => {
            const dateTest = new Date('2021-11-17T08:58:02.684Z').toISOString();
            await ThreadCommentTableTestHelper.addComment({ id: 'comment-123', content: 'hiyaa', insertedAt: dateTest });
            await ThreadCommentTableTestHelper.addComment({
                id: 'comment-1234', parentId: 'comment-123', content: 'ini balasan', insertedAt: dateTest,
            });
        });

        it('should return without replies data', async () => {
            const fakeIdGenerator = () => '123'; // stub!
            const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

            const commentId = 'comment-46';
            const comments = await threadCommentRepositoryPostgres.getReplies([commentId]);

            expect(comments).toStrictEqual(null);
        });

        it('should return replies data', async () => {
            const fakeIdGenerator = () => '123'; // stub!
            const dateTest = new Date('2021-11-17T08:58:02.684Z');
            const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

            const commentId = 'comment-123';
            const comments = await threadCommentRepositoryPostgres.getReplies([commentId]);

            expect(comments).toHaveLength(1);
            expect(comments).toStrictEqual([
                {
                    id: 'comment-1234',
                    content: 'ini balasan',
                    owner: 'user-123',
                    thread_id: 'thread-123',
                    parent_id: 'comment-123',
                    created_at: dateTest,
                    updated_at: dateTest,
                    is_deleted: false,
                    username: 'Renova',
                },
            ]);
        });
    });
});
