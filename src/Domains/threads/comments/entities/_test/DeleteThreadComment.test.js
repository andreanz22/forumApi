const DeleteThreadComment = require('../DeleteThreadComment');

describe('an DeleteThreadComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            threadId: 'thread-123',
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new DeleteThreadComment(payload)).toThrowError('DELETE_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            commentId: 'comment-123',
            threadId: 'thread-123',
            owner: 123,
        };

        // Action and Assert
        expect(() => new DeleteThreadComment(payload)).toThrowError('DELETE_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});
