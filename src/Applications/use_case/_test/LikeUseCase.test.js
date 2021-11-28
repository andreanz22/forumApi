const LikeUseCase = require('../LikeUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeRepository = require('../../../Domains/threads/likes/LikeRepository');
const ThreadCommentRepository = require('../../../Domains/threads/comments/ThreadCommentRepository');
const Like = require('../../../Domains/threads/likes/entities/Like');
const AddLike = require('../../../Domains/threads/likes/entities/AddLike');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('LikeUseCase', () => {
    describe('LikeOrUnlikeComment action', () => {
        it('should throw error if thread not found', async () => {
            // arrange
            const useCasePayload = {
                commentId: 'comment-123',
                threadId: 'thread-1',
                owner: 'user-123',
            };

            const mockLikeRepository = new LikeRepository();
            const mockThreadRepository = new ThreadRepository();
            const mockThreadCommentRepository = new ThreadCommentRepository();

            mockThreadRepository.verifyAvailableThread = jest.fn()
                .mockImplementation(() => Promise.reject(new NotFoundError('tidak ada')));

            const likeUseCase = new LikeUseCase({
                threadCommentRepository: mockThreadCommentRepository,
                threadRepository: mockThreadRepository,
                likeRepository: mockLikeRepository,
            });

            // Assert
            await expect(likeUseCase.likeOrUnlikeComment(useCasePayload)).rejects.toThrowError(NotFoundError);
        });

        it('should throw error if comment not found', async () => {
            // arrange
            const useCasePayload = {
                commentId: 'comment-123',
                threadId: 'thread-1',
                owner: 'user-123',
            };

            const mockLikeRepository = new LikeRepository();
            const mockThreadRepository = new ThreadRepository();
            const mockThreadCommentRepository = new ThreadCommentRepository();

            mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
            mockThreadCommentRepository.verifyAvailableComment = jest.fn()
                .mockImplementation(() => Promise.reject(new NotFoundError('tidak ada')));

            const likeUseCase = new LikeUseCase({
                threadCommentRepository: mockThreadCommentRepository,
                threadRepository: mockThreadRepository,
                likeRepository: mockLikeRepository,
            });

            // Assert
            await expect(likeUseCase.likeOrUnlikeComment(useCasePayload)).rejects.toThrowError(NotFoundError);
        });

        it('should like comment', async () => {
            // arrange
            const useCasePayload = {
                commentId: 'comment-123',
                threadId: 'thread-1',
                owner: 'user-123',
            };

            const addLike = new AddLike({
                commentId: useCasePayload.commentId,
                owner: useCasePayload.owner,
            });

            const expectedLike = new Like({
                id: 'like-1234',
                comment_id: useCasePayload.commentId,
                owner: useCasePayload.owner,
                created_at: new Date('2021-11-17T08:58:02.684Z'),
            });

            const mockLikeRepository = new LikeRepository();
            const mockThreadRepository = new ThreadRepository();
            const mockThreadCommentRepository = new ThreadCommentRepository();

            mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
            mockThreadCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
            mockLikeRepository.getLike = jest.fn(() => Promise.resolve(null));
            mockLikeRepository.like = jest.fn(() => Promise.resolve());

            const likeUseCase = new LikeUseCase({
                threadCommentRepository: mockThreadCommentRepository,
                threadRepository: mockThreadRepository,
                likeRepository: mockLikeRepository,
            });

            // Assert
            await likeUseCase.likeOrUnlikeComment(useCasePayload);
            expect(mockThreadRepository.verifyAvailableThread)
                .toBeCalledWith(useCasePayload.threadId);
            expect(mockThreadCommentRepository.verifyAvailableComment)
                .toBeCalledWith(useCasePayload);
            expect(mockLikeRepository.getLike)
                .toBeCalledWith(addLike);
            expect(mockLikeRepository.like)
                .toBeCalledWith(addLike);
        });

        it('should unlike comment', async () => {
            // arrange
            const useCasePayload = {
                commentId: 'comment-123',
                threadId: 'thread-1',
                owner: 'user-123',
            };

            const addLike = new AddLike({
                commentId: useCasePayload.commentId,
                owner: useCasePayload.owner,
            });

            const expectedLike = new Like({
                id: 'like-1234',
                comment_id: useCasePayload.commentId,
                owner: useCasePayload.owner,
                created_at: new Date('2021-11-17T08:58:02.684Z'),
            });

            const mockLikeRepository = new LikeRepository();
            const mockThreadRepository = new ThreadRepository();
            const mockThreadCommentRepository = new ThreadCommentRepository();

            mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
            mockThreadCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
            mockLikeRepository.getLike = jest.fn(() => Promise.resolve(expectedLike));
            mockLikeRepository.unlike = jest.fn(() => Promise.resolve());

            const likeUseCase = new LikeUseCase({
                threadCommentRepository: mockThreadCommentRepository,
                threadRepository: mockThreadRepository,
                likeRepository: mockLikeRepository,
            });

            // Assert
            await likeUseCase.likeOrUnlikeComment(useCasePayload);
            expect(mockThreadRepository.verifyAvailableThread)
                .toBeCalledWith(useCasePayload.threadId);
            expect(mockThreadCommentRepository.verifyAvailableComment)
                .toBeCalledWith(useCasePayload);
            expect(mockLikeRepository.getLike)
                .toBeCalledWith(addLike);
            expect(mockLikeRepository.unlike)
                .toBeCalledWith(expectedLike.id);
        });
    });
});
