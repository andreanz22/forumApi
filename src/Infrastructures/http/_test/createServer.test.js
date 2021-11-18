const createServer = require('../createServer');
const container = require('../../container');

describe('HTTP server', () => {
    it('should response 404 when request unregistered route', async () => {
    // Arrange
        const server = await createServer({});

        // Action
        const response = await server.inject({
            method: 'GET',
            url: '/unregisteredRoute',
        });

        // Assert
        expect(response.statusCode).toEqual(404);
    });

    it('should handle server error correctly', async () => {
    // Arrange
        const requestPayload = {
            username: 'dicoding',
            fullname: 'Dicoding Indonesia',
            password: 'super_secret',
        };
        const server = await createServer({}); // fake injection

        // Action
        const response = await server.inject({
            method: 'POST',
            url: '/users',
            payload: requestPayload,
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(500);
        expect(responseJson.status).toEqual('error');
        expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
    });

    it('should response 401 when request send not valid access token', async () => {
        // Arrange
        const server = await createServer(container);

        const payloadDeleteComment = {
            commentId: 'comment-123',
            threadId: 'thread-123',
        };

        const response = await server.inject({
            method: 'DELETE',
            url: `/threads/${payloadDeleteComment.threadId}/comments/${payloadDeleteComment.commentId}`,
            headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5kb2UiLCJpYXQiOjE2MzcxMTkyOTZ9.bPRX8-zGuacO2Pm83NhGDbhBZKbMOkqUysH6Evi80Ac' },
        });

        // Assert
        expect(response.statusCode).toEqual(401);
    });
});
