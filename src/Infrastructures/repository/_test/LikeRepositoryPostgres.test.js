const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const LikeTableTestHelper = require('../../../../tests/LikeTableTestHelper');

const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

const AddLike = require('../../../Domains/threads/likes/entities/AddLike');
const Like = require('../../../Domains/threads/likes/entities/Like');

const pool = require('../../database/postgres/pool');

const dateTest = new Date('2021-11-17T08:58:02.684Z');
describe('CommentRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({ username: 'Renova' });
        await ThreadTableTestHelper.addThread({ owner: 'user-123' });
        await ThreadCommentTableTestHelper.addComment({ insertedAt: dateTest.toISOString() });
    });

    afterEach(async () => {
        await LikeTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await ThreadCommentTableTestHelper.cleanTable();
        await ThreadTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('like function', () => {
        it('should create like', async () => {
            // Arrange
            const commentPayload = {
                commentId: 'comment-123',
                owner: 'user-123',
            };

            const addLike = new AddLike(commentPayload);

            const fakeIdGenerator = () => '123'; // stub!
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await likeRepositoryPostgres.like(addLike);

            // Assert
            const tokens = await LikeTableTestHelper.findLike('like-123');
            expect(tokens).toHaveLength(1);
        });
    });

    describe('getLike function', () => {
        afterEach(async () => {
            await LikeTableTestHelper.cleanTable();
        });

        it('should return null if like does not exist', async () => {
            // Arrange
            const commentPayload = {
                commentId: 'comment-123',
                owner: 'user-123',
            };

            const addLike = new AddLike(commentPayload);

            const fakeIdGenerator = () => '123'; // stub!
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const like = await likeRepositoryPostgres.getLike(addLike);

            // Assert
            expect(like).toEqual(null);
        });

        it('should return like data', async () => {
            // Arrange
            await LikeTableTestHelper.addLike({ insertedAt: dateTest });
            const commentPayload = {
                commentId: 'comment-123',
                owner: 'user-123',
            };

            const addLike = new AddLike(commentPayload);

            const fakeIdGenerator = () => '123'; // stub!
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const like = await likeRepositoryPostgres.getLike(addLike);

            // Assert
            expect(like).toStrictEqual(new Like({
                id: 'like-123',
                comment_id: commentPayload.commentId,
                owner: commentPayload.owner,
                created_at: dateTest,
            }));
        });
    });

    describe('unlike function', () => {
        it('should unlike data', async () => {
            // Arrange
            await LikeTableTestHelper.addLike({ insertedAt: dateTest });

            const fakeIdGenerator = () => '123'; // stub!
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const like = await likeRepositoryPostgres.unlike('like-123');

            // Assert
            const tokens = await LikeTableTestHelper.findLike('like-123');
            expect(tokens).toHaveLength(0);
        });
    });
});
