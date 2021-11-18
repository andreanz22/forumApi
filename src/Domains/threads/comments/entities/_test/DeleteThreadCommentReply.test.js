const DeleteThreadCommentReply = require('../DeleteThreadCommentReply');

describe('an DeleteThreadReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            commentId: 'comment-123',
            threadId: 'thread-123',
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new DeleteThreadCommentReply(payload)).toThrowError('DELETE_THREAD_COMMENT_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            replyId: 'comment-123',
            commentId: 'comment-123',
            threadId: 'thread-123',
            owner: 123,
        };

        // Action and Assert
        expect(() => new DeleteThreadCommentReply(payload)).toThrowError('DELETE_THREAD_COMMENT_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});
