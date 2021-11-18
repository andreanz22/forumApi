const AddThreadComment = require('../AddThreadComment');

describe('an AddThreadComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            comment: 'hello there',
            threadId: 'thread-123',
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new AddThreadComment(payload)).toThrowError('ADD_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            content: null,
            threadId: 'thread-123',
            owner: 123,
        };

        // Action and Assert
        expect(() => new AddThreadComment(payload)).toThrowError('ADD_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw error when payload give empty for content', () => {
        // Arrange
        const payload = {
            content: '',
            threadId: 'thread-123',
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new AddThreadComment(payload)).toThrowError('ADD_THREAD_COMMENT.COMMENT_NOT_VALID');
    });
});
