const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({ username: 'Renova' });
    });

    afterEach(async () => {
        await ThreadTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('verifyAvailableThread function', () => {
        it('should throw NotFoundError when thread not available', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyAvailableThread('asd')).rejects.toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError when thread available', async () => {
            // Arrange
            await ThreadTableTestHelper.addThread({ title: 'hiyaaa' });
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('addThread function', () => {
        it('should return thread data correctly', async () => {
            // Arrange
            const threadPayload = {
                title: 'hello there',
                body: 'hello bossq',
            };
            const owner = 'user-123';

            const addThread = new AddThread(threadPayload, owner);

            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedThread = await threadRepositoryPostgres.addThread(addThread, owner);

            // Assert
            expect(addedThread).toStrictEqual(new AddedThread({
                id: 'thread-123',
                title: threadPayload.title,
                owner,
            }));
        });
    });

    describe('getThreadDetail function', () => {
        it('should throw NotFoundError when thread not available', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(threadRepositoryPostgres.getThreadDetail('asd')).rejects.toThrowError(NotFoundError);
        });

        it('should return thread detail', async () => {
            // Arrange
            const dateTest = new Date('2021-11-17T08:58:02.684Z').toISOString();
            await ThreadTableTestHelper.addThread({ title: 'hello', insertedAt: dateTest });
            const expectedResult = {
                id: 'thread-123',
                title: 'hello',
                body: 'hello bossq',
                date: dateTest,
                username: 'Renova',
            };
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action & Assert
            const thread = await threadRepositoryPostgres.getThreadDetail('thread-123');
            expect(thread).toStrictEqual(new Thread(expectedResult));
        });
    });
});
