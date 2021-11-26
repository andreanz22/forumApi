const AddThread = require('../../../Domains/threads/entities/AddThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/threads/comments/ThreadCommentRepository');
const ThreadUseCase = require('../ThreadUseCase');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadUseCase', () => {
    // describe('addThread function', () => {
    //     it('should orchestrating the add thread action correctly', async () => {
    //         // arrange
    //         const useCasePayload = {
    //             title: 'hello there',
    //             body: 'hello bossq',
    //         };
    //         const owner = 'user-123';

    //         const expectedAddedThread = new AddedThread({
    //             id: 'thread-123',
    //             title: useCasePayload.title,
    //             owner,
    //         });

    //         const addThreadCheck = new AddThread({
    //             title: useCasePayload.title,
    //             body: useCasePayload.body,
    //         }, owner);

    //         const mockThreadRepository = new ThreadRepository();

    //         mockThreadRepository.addThread = jest.fn()
    //             .mockImplementation(() => Promise.resolve(expectedAddedThread));

    //         const getThreadUseCase = new ThreadUseCase({
    //             threadRepository: mockThreadRepository,
    //         });

    //         // Action
    //         const addThread = await getThreadUseCase.addThread(addThreadCheck, owner);

    //         // Assert
    //         expect(addThread).toStrictEqual(expectedAddedThread);
    //         expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
    //             title: useCasePayload.title,
    //             body: useCasePayload.body,
    //         }, owner));
    //     });
    // });

    describe('getDetailThread function', () => {
        it('should return error when thread not found', async () => {
            // arrange
            const threadId = 'thread-1234';

            const mockThreadRepository = new ThreadRepository();

            mockThreadRepository.getThreadDetail = jest.fn()
                .mockImplementation(() => {
                    throw new NotFoundError('tidak ada');
                });

            const getThreadUseCase = new ThreadUseCase({
                threadRepository: mockThreadRepository,
            });

            await expect(getThreadUseCase.getDetailThread({ threadId })).rejects.toThrowError(NotFoundError);
        });

        it('should return thread data', async () => {
            // arrange
            const threadId = 'thread-123';

            const expectedThread = new Thread({
                id: 'thread-123',
                title: 'hello',
                body: 'hello john',
                date: '2021-08-08T07:22:33.555Z',
                username: 'johndoe',
                comments: [
                    {
                        id: 'comment-_pby2_tmXV6bcvcdev8xk',
                        content: 'sebuah comment',
                        owner: 'johndoe',
                    },
                ],
            });

            const mockThreadRepository = new ThreadRepository();
            const mockThreadCommentRepository = new ThreadCommentRepository();

            mockThreadRepository.getThreadDetail = jest.fn()
                .mockImplementation(() => Promise.resolve(expectedThread));

            mockThreadCommentRepository.getComments = jest.fn()
                .mockImplementation(() => Promise.resolve([
                    {
                        id: 'comment-_pby2_tmXV6bcvcdev8xk',
                        content: 'sebuah comment',
                        owner: 'johndoe',
                    },
                ]));

            mockThreadCommentRepository.getReplies = jest.fn()
                .mockImplementation(() => Promise.resolve(null));

            const getThreadUseCase = new ThreadUseCase({
                threadRepository: mockThreadRepository,
                threadCommentRepository: mockThreadCommentRepository,
            });

            // Action
            const thread = await getThreadUseCase.getDetailThread({ threadId });

            // Assert
            expect(thread).toStrictEqual(expectedThread);
            expect(mockThreadRepository.getThreadDetail).toBeCalledWith(threadId);
            expect(mockThreadCommentRepository.getComments).toBeCalledWith(threadId);
        });

        it('should return thread data without comment', async () => {
            // arrange
            const threadId = 'thread-123';

            const expectedThread = new Thread({
                id: 'thread-123',
                title: 'hello',
                body: 'hello john',
                date: '2021-08-08T07:22:33.555Z',
                username: 'johndoe',
            });

            const mockThreadRepository = new ThreadRepository();
            const mockThreadCommentRepository = new ThreadCommentRepository();

            mockThreadRepository.getThreadDetail = jest.fn()
                .mockImplementation(() => Promise.resolve(expectedThread));

            mockThreadCommentRepository.getComments = jest.fn()
                .mockImplementation(() => Promise.resolve());

            const getThreadUseCase = new ThreadUseCase({
                threadRepository: mockThreadRepository,
                threadCommentRepository: mockThreadCommentRepository,
            });

            // Action
            const thread = await getThreadUseCase.getDetailThread({ threadId });

            // Assert
            expect(thread).toStrictEqual(expectedThread);
            expect(mockThreadRepository.getThreadDetail).toBeCalledWith(threadId);
            expect(mockThreadCommentRepository.getComments).toBeCalledWith(threadId);
        });

        it('should return thread data with comment and replies', async () => {
            // arrange
            const threadId = 'thread-123';

            const expectedThread = new Thread({
                id: 'thread-123',
                title: 'hello',
                body: 'hello john',
                date: '2021-08-08T07:22:33.555Z',
                username: 'johndoe',
            });

            const expectedComment = [
                {
                    id: 'comment-123',
                    content: 'sebuah comment',
                    owner: 'johndoe',
                },
            ];

            const expectedReplies = [
                {
                    id: 'comment-1234',
                    content: 'sebuah balasan',
                    owner: 'johndoe',
                    thread_id: 'thread-123',
                    parent_id: 'comment-123',
                    username: 'rossi',
                    created_at: new Date('2021-11-17T08:58:02.684Z'),
                },
                {
                    id: 'comment-1234',
                    content: 'sebuah balasan',
                    owner: 'johndoe',
                    thread_id: 'thread-123',
                    parent_id: 'comment-12345',
                    username: 'rossi',
                    created_at: new Date('2021-11-17T08:58:02.684Z'),
                },
            ];

            const mockThreadRepository = new ThreadRepository();
            const mockThreadCommentRepository = new ThreadCommentRepository();

            mockThreadRepository.getThreadDetail = jest.fn()
                .mockImplementation(() => Promise.resolve(expectedThread));

            mockThreadCommentRepository.getComments = jest.fn()
                .mockImplementation(() => Promise.resolve(expectedComment));

            mockThreadCommentRepository.getReplies = jest.fn()
                .mockImplementation(() => Promise.resolve(expectedReplies));

            const getThreadUseCase = new ThreadUseCase({
                threadRepository: mockThreadRepository,
                threadCommentRepository: mockThreadCommentRepository,
            });

            // Action
            const thread = await getThreadUseCase.getDetailThread({ threadId });

            // Assert
            // console.log(thread);
            expect(thread).toStrictEqual(expectedThread);
        });

        it('should return thread data with comment and if no replies for comment', async () => {
            // arrange
            const threadId = 'thread-123';

            const expectedThread = new Thread({
                id: 'thread-123',
                title: 'hello',
                body: 'hello john',
                date: '2021-08-08T07:22:33.555Z',
                username: 'johndoe',
            });

            const expectedComment = [
                {
                    id: 'comment-123',
                    content: 'sebuah comment',
                    owner: 'johndoe',
                },
            ];

            const expectedReplies = [
                {
                    id: 'comment-1234',
                    content: 'sebuah balasan',
                    owner: 'johndoe',
                    thread_id: 'thread-123',
                    parent_id: 'comment-12345',
                    username: 'rossi',
                    created_at: new Date('2021-11-17T08:58:02.684Z'),
                },
            ];

            const mockThreadRepository = new ThreadRepository();
            const mockThreadCommentRepository = new ThreadCommentRepository();

            mockThreadRepository.getThreadDetail = jest.fn()
                .mockImplementation(() => Promise.resolve(expectedThread));

            mockThreadCommentRepository.getComments = jest.fn()
                .mockImplementation(() => Promise.resolve(expectedComment));

            mockThreadCommentRepository.getReplies = jest.fn()
                .mockImplementation(() => Promise.resolve(expectedReplies));

            const getThreadUseCase = new ThreadUseCase({
                threadRepository: mockThreadRepository,
                threadCommentRepository: mockThreadCommentRepository,
            });

            // Action
            const thread = await getThreadUseCase.getDetailThread({ threadId });

            // Assert
            // console.log(thread);
            expect(thread).toStrictEqual(expectedThread);
        });
    });
});
