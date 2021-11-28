const AddLike = require('../AddLike');

describe('an AddLike entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            commentId: 'hiya hiya',
        };

        // Action and Assert
        expect(() => new AddLike(payload)).toThrowError('ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            commentId: 'hiya hiya',
            owner: 123,
        };

        // Action and Assert
        expect(() => new AddLike(payload)).toThrowError('ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddLike object correctly', () => {
        // Arrange
        const payload = {
            commentId: 'comment-123',
            owner: 'user-123',
        };

        // Action
        const addedThreadComment = new AddLike(payload);

        // Assert
        expect(addedThreadComment.commentId).toEqual(payload.commentId);
        expect(addedThreadComment.owner).toEqual(payload.owner);
    });
});
