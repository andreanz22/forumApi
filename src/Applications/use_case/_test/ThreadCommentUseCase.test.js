const AddThreadComment = require('../../../Domains/threads/comments/entities/AddThreadComment');
const AddedThreadComment = require('../../../Domains/threads/comments/entities/AddedThreadComment');
const AddReply = require('../../../Domains/threads/comments/entities/AddReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/threads/comments/ThreadCommentRepository');
const ThreadCommentUseCase = require('../ThreadCommentUseCase');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const DeleteThreadCommentReply = require('../../../Domains/threads/comments/entities/DeleteThreadCommentReply');

describe('CommentUseCase', () => {
    describe('AddComment action', () => {
        it('should orchestrating the add comment action correctly', async () => {
            // arrange
            const useCasePayload = {
                content: 'hello there',
                threadId: 'thread-123',
                owner: 'user-123',
            };

            const expectedAddedComment = new AddedThreadComment({
                id: 'comment-123',
                content: useCasePayload.content,
                owner: useCasePayload.owner,
            });

            const mockThreadRepository = new ThreadRepository();
            const mockThreadCommentRepository = new ThreadCommentRepository();

            mockThreadRepository.verifyAvailableThread = jest.fn()
                .mockImplementation(() => Promise.resolve());

            mockThreadCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());

            mockThreadCommentRepository.addComment = jest.fn()
                .mockImplementation(() => Promise.resolve(expectedAddedComment));

            const getCommentUseCase = new ThreadCommentUseCase({
                threadCommentRepository: mockThreadCommentRepository,
                threadRepository: mockThreadRepository,
            });

            // Action
            const addComment = await getCommentUseCase.addComment(useCasePayload);

            // Assert
            expect(addComment).toStrictEqual(expectedAddedComment);
            expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
            expect(mockThreadCommentRepository.addComment).toBeCalledWith(new AddThreadComment({
                content: useCasePayload.content,
                threadId: useCasePayload.threadId,
                owner: useCasePayload.owner,
            }));
        });
    });

    describe('AddReply action', () => {
        it('should throw error 404 if comment not found', async () => {
            // arrange
            const useCasePayload = {
                commentId: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
                content: 'ini balasan',
            };

            const expectedAddedComment = new AddedThreadComment({
                id: 'comment-1234',
                content: useCasePayload.content,
                owner: useCasePayload.owner,
            });

            const mockThreadRepository = new ThreadRepository();
            const mockThreadCommentRepository = new ThreadCommentRepository();

            mockThreadRepository.verifyAvailableThread = jest.fn()
                .mockImplementation(() => Promise.resolve());

            mockThreadCommentRepository.verifyAvailableComment = jest.fn()
                .mockImplementation(() => {
                    throw new NotFoundError('tidak ada');
                });

            mockThreadCommentRepository.addComment = jest.fn()
                .mockImplementation(() => Promise.resolve(expectedAddedComment));

            const getCommentUseCase = new ThreadCommentUseCase({
                threadCommentRepository: mockThreadCommentRepository,
                threadRepository: mockThreadRepository,
            });

            await expect(getCommentUseCase.addReply(useCasePayload)).rejects.toThrowError(NotFoundError);
        });

        it('should orchestrating the add replies action correctly', async () => {
            // arrange
            const useCasePayload = {
                commentId: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
                content: 'ini balasan',
            };

            const expectedAddedComment = new AddedThreadComment({
                id: 'comment-1234',
                content: useCasePayload.content,
                owner: useCasePayload.owner,
            });

            const mockThreadRepository = new ThreadRepository();
            const mockThreadCommentRepository = new ThreadCommentRepository();

            mockThreadRepository.verifyAvailableThread = jest.fn()
                .mockImplementation(() => Promise.resolve());

            mockThreadCommentRepository.verifyAvailableComment = jest.fn()
                .mockImplementation(() => Promise.resolve());

            mockThreadCommentRepository.addComment = jest.fn()
                .mockImplementation(() => Promise.resolve(expectedAddedComment));

            const getCommentUseCase = new ThreadCommentUseCase({
                threadCommentRepository: mockThreadCommentRepository,
                threadRepository: mockThreadRepository,
            });

            // Action
            const addComment = await getCommentUseCase.addReply(useCasePayload);

            // Assert
            expect(addComment).toStrictEqual(expectedAddedComment);
            expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
            expect(mockThreadCommentRepository.addComment).toBeCalledWith(new AddReply({
                content: useCasePayload.content,
                threadId: useCasePayload.threadId,
                commentId: useCasePayload.commentId,
                owner: useCasePayload.owner,
            }));
        });
    });

    describe('deleteComment action', () => {
        it('should throw error if thread not found', async () => {
            // arrange
            const useCasePayload = {
                commentId: 'comment-123',
                threadId: 'thread-1',
                owner: 'user-123',
            };

            const mockThreadRepository = new ThreadRepository();
            const mockThreadCommentRepository = new ThreadCommentRepository();

            mockThreadRepository.verifyAvailableThread = jest.fn()
                .mockImplementation(() => Promise.reject(new NotFoundError('tidak ada')));

            const getCommentUseCase = new ThreadCommentUseCase({
                threadCommentRepository: mockThreadCommentRepository,
                threadRepository: mockThreadRepository,
            });

            // Assert
            await expect(getCommentUseCase.deleteComment(useCasePayload)).rejects.toThrowError(NotFoundError);
        });

        it('should throw error if comment not found', async () => {
            // arrange
            const useCasePayload = {
                commentId: 'comment-123',
                threadId: 'thread-1',
                owner: 'user-123',
            };

            const mockThreadRepository = new ThreadRepository();
            const mockThreadCommentRepository = new ThreadCommentRepository();

            mockThreadRepository.verifyAvailableThread = jest.fn()
                .mockImplementation(() => Promise.resolve());

            mockThreadCommentRepository.getComment = jest.fn()
                .mockImplementation(() => {
                    throw new NotFoundError('tidak ada');
                });

            const getCommentUseCase = new ThreadCommentUseCase({
                threadCommentRepository: mockThreadCommentRepository,
                threadRepository: mockThreadRepository,
            });

            // Assert
            await expect(getCommentUseCase.deleteComment(useCasePayload)).rejects.toThrowError(NotFoundError);
        });

        it('should throw error if comment not belong to user found', async () => {
            // arrange
            const useCasePayload = {
                commentId: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
            };

            const commentOtherUser = {
                commentId: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-1234',
            };

            const mockThreadRepository = new ThreadRepository();
            const mockThreadCommentRepository = new ThreadCommentRepository();

            mockThreadRepository.verifyAvailableThread = jest.fn()
                .mockImplementation(() => Promise.resolve());

            mockThreadCommentRepository.getComment = jest.fn()
                .mockImplementation(() => Promise.resolve(commentOtherUser));

            const getCommentUseCase = new ThreadCommentUseCase({
                threadCommentRepository: mockThreadCommentRepository,
                threadRepository: mockThreadRepository,
            });

            // Assert
            await expect(getCommentUseCase.deleteComment(useCasePayload)).rejects.toThrowError('DELETE_COMMENT_USE_CASE.NOT_OWNER_OF_COMMENT');
        });

        it('should orchestrating the delete comment action correctly', async () => {
            // arrange
            const useCasePayload = {
                commentId: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
            };

            const commentOtherUser = {
                commentId: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
            };

            const mockThreadRepository = new ThreadRepository();
            const mockThreadCommentRepository = new ThreadCommentRepository();

            mockThreadRepository.verifyAvailableThread = jest.fn()
                .mockImplementation(() => Promise.resolve());
            mockThreadCommentRepository.getComment = jest.fn()
                .mockImplementation(() => Promise.resolve(commentOtherUser));
            mockThreadCommentRepository.deleteComment = jest.fn()
                .mockImplementation(() => Promise.resolve());

            const getCommentUseCase = new ThreadCommentUseCase({
                threadCommentRepository: mockThreadCommentRepository,
                threadRepository: mockThreadRepository,
            });

            await mockThreadCommentRepository.deleteComment(useCasePayload);
            expect(mockThreadCommentRepository.deleteComment)
                .toHaveBeenCalledWith(commentOtherUser);
        });
    });

    describe('deleteCommetReplies action', () => {
        it('should throw error if thread not found', async () => {
            // arrange
            const useCasePayload = {
                replyId: 'comment-1234',
                commentId: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
            };

            const mockThreadRepository = new ThreadRepository();
            const mockThreadCommentRepository = new ThreadCommentRepository();

            mockThreadRepository.verifyAvailableThread = jest.fn()
                .mockImplementation(() => Promise.reject(new NotFoundError('tidak ada')));

            const getCommentUseCase = new ThreadCommentUseCase({
                threadCommentRepository: mockThreadCommentRepository,
                threadRepository: mockThreadRepository,
            });

            // Assert
            await expect(getCommentUseCase.deleteCommentReplies(useCasePayload)).rejects.toThrowError(NotFoundError);
        });

        it('should throw error if replies parent comment not found', async () => {
            const useCasePayload = {
                replyId: 'comment-1234',
                commentId: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
            };

            const mockThreadRepository = new ThreadRepository();
            const mockThreadCommentRepository = new ThreadCommentRepository();

            mockThreadRepository.verifyAvailableThread = jest.fn()
                .mockImplementation(() => Promise.resolve());

            mockThreadCommentRepository.getComment = jest.fn()
                .mockImplementation(() => {
                    throw new NotFoundError('tidak ada');
                });

            const getCommentUseCase = new ThreadCommentUseCase({
                threadCommentRepository: mockThreadCommentRepository,
                threadRepository: mockThreadRepository,
            });

            // Assert
            await expect(getCommentUseCase.deleteCommentReplies(useCasePayload)).rejects.toThrowError(NotFoundError);
        });

        it('should throw error if replies not found', async () => {
            const useCasePayload = {
                replyId: 'comment-1234',
                commentId: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
            };

            const deleteCommentReplies = new DeleteThreadCommentReply(useCasePayload);
            const mockThreadRepository = new ThreadRepository();
            const mockThreadCommentRepository = new ThreadCommentRepository();

            mockThreadRepository.verifyAvailableThread = jest.fn()
                .mockImplementation(() => Promise.resolve());

            mockThreadCommentRepository.getComment = jest.fn()
                .mockImplementationOnce(() => Promise.resolve())
                .mockImplementation(() => {
                    throw new NotFoundError('tidak ada');
                });

            const getCommentUseCase = new ThreadCommentUseCase({
                threadCommentRepository: mockThreadCommentRepository,
                threadRepository: mockThreadRepository,
            });

            await expect(getCommentUseCase.deleteCommentReplies(useCasePayload)).rejects.toThrowError(NotFoundError);
            expect(mockThreadCommentRepository.getComment)
                .toHaveBeenNthCalledWith(1, deleteCommentReplies);
            expect(mockThreadCommentRepository.getComment)
                .toHaveBeenNthCalledWith(2, deleteCommentReplies);
        });

        it('should throw error if replies not belong to user found', async () => {
            const useCasePayload = {
                replyId: 'comment-1234',
                commentId: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
            };

            const deleteCommentReplies = new DeleteThreadCommentReply(useCasePayload);

            const commentOtherUser = {
                id: 'comment-1234',
                threadId: 'thread-123',
                owner: 'user-1234',
            };

            const mockThreadRepository = new ThreadRepository();
            const mockThreadCommentRepository = new ThreadCommentRepository();

            mockThreadRepository.verifyAvailableThread = jest.fn()
                .mockImplementation(() => Promise.resolve());

            mockThreadCommentRepository.getComment = jest.fn()
                .mockImplementationOnce(() => Promise.resolve())
                .mockImplementationOnce(() => Promise.resolve(commentOtherUser));

            const getCommentUseCase = new ThreadCommentUseCase({
                threadCommentRepository: mockThreadCommentRepository,
                threadRepository: mockThreadRepository,
            });

            // Assert
            await expect(getCommentUseCase.deleteCommentReplies(useCasePayload)).rejects.toThrowError('DELETE_COMMENT_REPLIES_USE_CASE.NOT_OWNER_OF_COMMENT');
            expect(mockThreadCommentRepository.getComment)
                .toHaveBeenNthCalledWith(1, deleteCommentReplies);
            expect(mockThreadCommentRepository.getComment)
                .toHaveBeenNthCalledWith(2, deleteCommentReplies);
        });

        it('should orchestrating the delete replies action correctly', async () => {
            const useCasePayload = {
                replyId: 'comment-1234',
                commentId: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
            };

            const commentOtherUser = {
                id: 'comment-1234',
                threadId: 'thread-123',
                owner: 'user-123',
            };

            const mockThreadRepository = new ThreadRepository();
            const mockThreadCommentRepository = new ThreadCommentRepository();

            mockThreadRepository.verifyAvailableThread = jest.fn()
                .mockImplementation(() => Promise.resolve());

            mockThreadCommentRepository.getComment = jest.fn()
                .mockImplementationOnce(() => Promise.resolve())
                .mockImplementation(() => Promise.resolve(commentOtherUser));

            mockThreadCommentRepository.deleteComment = jest.fn()
                .mockImplementation(() => Promise.resolve());

            const getCommentUseCase = new ThreadCommentUseCase({
                threadCommentRepository: mockThreadCommentRepository,
                threadRepository: mockThreadRepository,
            });

            await getCommentUseCase.deleteCommentReplies(useCasePayload);
            expect(mockThreadCommentRepository.deleteComment)
                .toHaveBeenCalledWith(commentOtherUser.id);
        });
    });
});
