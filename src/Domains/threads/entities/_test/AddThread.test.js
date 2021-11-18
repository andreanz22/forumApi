const AddThread = require('../AddThread');

describe('a NewThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
    // Arrange
        const payload = {
            title: 'hello there',
        };

        // Action and Assert
        expect(() => new AddThread(payload, 'user-123')).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            title: 123,
            body: 'hello bossq',
        };

        // Action and Assert
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw error when missing parameter', () => {
        // Arrange
        const payload = {
            title: 'hello there',
            body: 'hello bossq',
        };

        // Action and Assert
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.MISSING_PARAMETERS');
    });
});
