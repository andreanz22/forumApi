const AddedThreadComment = require('../AddedThreadComment');

describe('an AddThreadComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            content: 'hiya hiya',
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new AddedThreadComment(payload)).toThrowError('ADDED_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: {},
            content: 'hiya hiya',
            owner: 123,
        };

        // Action and Assert
        expect(() => new AddedThreadComment(payload)).toThrowError('ADDED_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create addedThreadComment object correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: 'hiya hiya',
            owner: 'user-123',
        };

        // Action
        const addedThreadComment = new AddedThreadComment(payload);

        // Assert
        expect(addedThreadComment.id).toEqual(payload.id);
        expect(addedThreadComment.content).toEqual(payload.content);
        expect(addedThreadComment.owner).toEqual(payload.owner);
    });
});
