const AddReply = require('../AddReply');

describe('an AddCommentReplies entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            commentId: 'comment-123',
            threadId: 'thread-123',
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            commentId: 321,
            threadId: 123,
            owner: 'user-123',
            content: 'ini balasan',
        };

        // Action and Assert
        expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw error when payload give empty for content', () => {
        const payload = {
            commentId: 'comment-123',
            threadId: 'thread-123',
            owner: 'user-123',
            content: '',
        };

        // Action and Assert
        expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.COMMENT_NOT_VALID');
    });
});
