const Like = require('../Like');

describe('a Like entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: 'like-123',
            comment_id: 'comment-123',
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new Like(payload)).toThrowError('LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            comment_id: 'comment-123',
            owner: 'user-123',
            created_at: new Date('2021-11-17T08:58:02.684Z'),
        };

        // Action and Assert
        expect(() => new Like(payload)).toThrowError('LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create Like object correctly', () => {
        // Arrange
        const payload = {
            id: 'like-123',
            comment_id: 'comment-123',
            owner: 'user-123',
            created_at: new Date('2021-11-17T08:58:02.684Z'),
        };

        // Action
        const like = new Like(payload);

        // Assert
        expect(like.id).toEqual(payload.id);
        expect(like.commentId).toEqual(payload.comment_id);
        expect(like.owner).toEqual(payload.owner);
        expect(like.createdAt).toEqual(payload.created_at);
    });
});
