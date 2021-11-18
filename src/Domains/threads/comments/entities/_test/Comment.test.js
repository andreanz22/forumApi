const Comment = require('../Comment');

describe('an Comment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            content: 'hello there',
            username: 'Renova',
            created_at: new Date('2021-11-17T08:58:02.684Z').toISOString(),
        };

        // Action and Assert
        expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            content: 'hello there',
            username: 'Renova',
            created_at: new Date('2021-11-17T08:58:02.684Z').toISOString(),
        };

        // Action and Assert
        expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create Comment object correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: 'hello there',
            username: 'Renova',
            created_at: new Date('2021-11-17T08:58:02.684Z').toISOString(),
            is_deleted: false,
        };

        // Action
        const addedThreadComment = new Comment(payload);

        // Assert
        expect(addedThreadComment.id).toEqual(payload.id);
        expect(addedThreadComment.content).toEqual(payload.content);
        expect(addedThreadComment.username).toEqual(payload.username);
    });

    it('should create Comment with is_deleted object correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: 'hello there',
            username: 'Renova',
            created_at: new Date('2021-11-17T08:58:02.684Z').toISOString(),
            is_deleted: true,
        };

        // Action
        const addedThreadComment = new Comment(payload);

        // Assert
        expect(addedThreadComment.id).toEqual(payload.id);
        expect(addedThreadComment.content).toEqual('**komentar telah dihapus**');
        expect(addedThreadComment.username).toEqual(payload.username);
    });
});
