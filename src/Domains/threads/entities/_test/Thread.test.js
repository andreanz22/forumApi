const Thread = require('../Thread');

describe('a Thread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'hello there',
        };

        // Action and Assert
        expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            title: 'hello bossq',
            body: 'hallooooo',
            date: '2021-08-08T07:22:33.555Z',
            username: 'johndoe',
        };

        // Action and Assert
        expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create addedThread object correctly', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'hello there',
            body: 'hallooooo',
            date: '2021-08-08T07:22:33.555Z',
            username: 'johndoe',
        };

        // Action
        const {
            id, title, body, date, username,
        } = new Thread(payload);

        // Assert
        expect(id).toEqual(payload.id);
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(date).toEqual(payload.date);
        expect(username).toEqual(payload.username);
    });
});
