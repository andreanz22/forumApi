const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({ username: 'Renova' });
    });

    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('when POST /threads', () => {
        // it('should response 201 and addedThread', async () => {
        //     // Arrange
        //     const requestPayload = {
        //         username: 'dicoding',
        //         password: 'secret',
        //     };
        //     const server = await createServer(container);
        //     // add user
        //     const responseUser = await server.inject({
        //         method: 'POST',
        //         url: '/users',
        //         payload: {
        //             username: 'dicoding',
        //             password: 'secret',
        //             fullname: 'Dicoding Indonesia',
        //         },
        //     });
        //     const responseUserJson = JSON.parse(responseUser.payload);

        //     const responseAuth = await server.inject({
        //         method: 'POST',
        //         url: '/authentications',
        //         payload: requestPayload,
        //     });
        //     const responseAuthJson = JSON.parse(responseAuth.payload);

        //     // Action
        //     const threadPayload = {
        //         title: 'hello',
        //         body: 'pa kabar?',
        //     };
        //     const reponseAddThread = await server.inject({
        //         method: 'POST',
        //         url: '/threads',
        //         payload: threadPayload,
        //         headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
        //         auth: {
        //             strategy: 'forumapi_jwt',
        //             credentials: {
        //                 userId: responseUserJson.data.addedUser.id,
        //             },
        //         },
        //     });
        //     // console.log(responseUserJson);

        //     // Assert
        //     const responseJson = JSON.parse(reponseAddThread.payload);
        //     expect(reponseAddThread.statusCode).toEqual(201);
        //     expect(responseJson.status).toEqual('success');
        //     expect(responseJson.data.addedThread).toBeDefined();
        // });

        it('should response 201 and addedThread', async () => {
            // Arrange
            const server = await createServer(container);
            const threadPayload = {
                title: 'hello',
                body: 'pa kabar?',
            };
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpY29kaW5nIiwiaWQiOiJ1c2VyLTEyMyIsImlhdCI6MTYzNjk5NzYxOH0.ode7i4U3sHBDwPw3UnW0qghAtsBgULJr9IT-6FPkyVE';

            const reponseAddThread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: threadPayload,
                headers: { Authorization: `Bearer ${token}` },
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        userId: 'user-123',
                    },
                },
            });

            // Assert
            const responseJson = JSON.parse(reponseAddThread.payload);
            expect(reponseAddThread.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined();
        });
    });

    describe('when POST /threads/{threadId}/comments', () => {
        afterEach(async () => {
            await ThreadTableTestHelper.cleanTable();
            await ThreadCommentTableTestHelper.cleanTable();
        });

        it('should response 404 when thread not found', async () => {
            const server = await createServer(container);
            const threadCommentPayload = {
                content: 'hiyaaa',
            };
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpY29kaW5nIiwiaWQiOiJ1c2VyLTEyMyIsImlhdCI6MTYzNjk5NzYxOH0.ode7i4U3sHBDwPw3UnW0qghAtsBgULJr9IT-6FPkyVE';

            const reponseAddThread = await server.inject({
                method: 'POST',
                url: '/threads/thread-1233/comments',
                payload: threadCommentPayload,
                headers: { Authorization: `Bearer ${token}` },
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        userId: 'user-123',
                    },
                },
            });

            // Assert
            const responseJson = JSON.parse(reponseAddThread.payload);
            expect(reponseAddThread.statusCode).toEqual(404);
        });

        it('should response 201 and addedComment', async () => {
            await ThreadTableTestHelper.addThread({ owner: 'user-123' });

            const server = await createServer(container);

            const threadCommentPayload = {
                content: 'hiyaaa',
            };
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpY29kaW5nIiwiaWQiOiJ1c2VyLTEyMyIsImlhdCI6MTYzNjk5NzYxOH0.ode7i4U3sHBDwPw3UnW0qghAtsBgULJr9IT-6FPkyVE';

            const reponseAddThread = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: threadCommentPayload,
                headers: { Authorization: `Bearer ${token}` },
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        userId: 'user-123',
                    },
                },
            });

            // Assert
            const responseJson = JSON.parse(reponseAddThread.payload);
            expect(reponseAddThread.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedComment).toBeDefined();
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        beforeAll(async () => {
            await ThreadTableTestHelper.addThread({ owner: 'user-123' });
            await ThreadCommentTableTestHelper.addComment({ content: 'hiyaa' });
        });

        afterAll(async () => {
            await ThreadTableTestHelper.cleanTable();
            await ThreadCommentTableTestHelper.cleanTable();
        });

        it('should response 404 when thread not found', async () => {
            const server = await createServer(container);
            const payloadDeleteComment = {
                commentId: 'comment-123',
                threadId: 'thread-46',
            };
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpY29kaW5nIiwiaWQiOiJ1c2VyLTEyMyIsImlhdCI6MTYzNjk5NzYxOH0.ode7i4U3sHBDwPw3UnW0qghAtsBgULJr9IT-6FPkyVE';

            const reponseDeleteThreadComment = await server.inject({
                method: 'DELETE',
                url: `/threads/${payloadDeleteComment.threadId}/comments/${payloadDeleteComment.commentId}`,
                headers: { Authorization: `Bearer ${token}` },
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        userId: 'user-123',
                    },
                },
            });

            // Assert
            expect(reponseDeleteThreadComment.statusCode).toEqual(404);
        });

        it('should response 404 when comment not found', async () => {
            const server = await createServer(container);
            const payloadDeleteComment = {
                commentId: 'comment-46',
                threadId: 'thread-123',
            };
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpY29kaW5nIiwiaWQiOiJ1c2VyLTEyMyIsImlhdCI6MTYzNjk5NzYxOH0.ode7i4U3sHBDwPw3UnW0qghAtsBgULJr9IT-6FPkyVE';

            const reponseDeleteThreadComment = await server.inject({
                method: 'DELETE',
                url: `/threads/${payloadDeleteComment.threadId}/comments/${payloadDeleteComment.commentId}`,
                headers: { Authorization: `Bearer ${token}` },
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        userId: 'user-123',
                    },
                },
            });

            // Assert
            expect(reponseDeleteThreadComment.statusCode).toEqual(404);
        });

        it('should response 403 when comment not belong to user', async () => {
            const server = await createServer(container);
            const payloadDeleteComment = {
                commentId: 'comment-123',
                threadId: 'thread-123',
            };
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpY29kaW5nIiwiaWQiOiJ1c2VyLTEyMyIsImlhdCI6MTYzNjk5NzYxOH0.ode7i4U3sHBDwPw3UnW0qghAtsBgULJr9IT-6FPkyVE';

            const reponseDeleteThreadComment = await server.inject({
                method: 'DELETE',
                url: `/threads/${payloadDeleteComment.threadId}/comments/${payloadDeleteComment.commentId}`,
                headers: { Authorization: `Bearer ${token}` },
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        userId: 'user-46',
                    },
                },
            });

            // Assert
            expect(reponseDeleteThreadComment.statusCode).toEqual(403);
        });

        it('should delete thread', async () => {
            const server = await createServer(container);
            const payloadDeleteComment = {
                commentId: 'comment-123',
                threadId: 'thread-123',
            };
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpY29kaW5nIiwiaWQiOiJ1c2VyLTEyMyIsImlhdCI6MTYzNjk5NzYxOH0.ode7i4U3sHBDwPw3UnW0qghAtsBgULJr9IT-6FPkyVE';

            const reponseDeleteThreadComment = await server.inject({
                method: 'DELETE',
                url: `/threads/${payloadDeleteComment.threadId}/comments/${payloadDeleteComment.commentId}`,
                headers: { Authorization: `Bearer ${token}` },
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        userId: 'user-123',
                    },
                },
            });

            // Assert
            const responseJson = JSON.parse(reponseDeleteThreadComment.payload);
            expect(reponseDeleteThreadComment.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });
    });

    describe('when POST /threads/{threadId}', () => {
        beforeAll(async () => {
            const dateTest = new Date('2021-11-17T08:58:02.684Z').toISOString();
            await ThreadTableTestHelper.addThread({ owner: 'user-123', insertedAt: dateTest });
            await ThreadCommentTableTestHelper.addComment({ content: 'hiyaa', insertedAt: dateTest });
        });

        afterAll(async () => {
            await ThreadTableTestHelper.cleanTable();
            await ThreadCommentTableTestHelper.cleanTable();
        });

        it('should response 404 when thread not found', async () => {
            const server = await createServer(container);
            const threadId = 'thread-46';

            const reponseDeleteThreadComment = await server.inject({
                method: 'GET',
                url: `/threads/${threadId}`,
            });

            // Assert
            expect(reponseDeleteThreadComment.statusCode).toEqual(404);
        });

        it('should response thread data', async () => {
            const server = await createServer(container);
            const dateTest = new Date('2021-11-17T08:58:02.684Z').toISOString();
            const threadId = 'thread-123';

            const reponseDeleteThreadComment = await server.inject({
                method: 'GET',
                url: `/threads/${threadId}`,
            });

            // Assert
            const responseJson = JSON.parse(reponseDeleteThreadComment.payload);
            expect(reponseDeleteThreadComment.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data).toMatchObject({
                thread: {
                    id: 'thread-123',
                    title: 'hello',
                    body: 'hello bossq',
                    date: dateTest,
                    username: 'Renova',
                    comments: [{
                        id: 'comment-123', username: 'Renova', content: 'hiyaa', date: dateTest,
                    }],
                },
            });
        });
    });

    describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
        beforeAll(async () => {
            await ThreadTableTestHelper.addThread({ owner: 'user-123' });
            await ThreadCommentTableTestHelper.addComment({ content: 'hiyaa' });
        });

        afterAll(async () => {
            await ThreadTableTestHelper.cleanTable();
            await ThreadCommentTableTestHelper.cleanTable();
        });

        it('should response 404 when thread not found', async () => {
            const server = await createServer(container);
            const commentId = 'comment-123';
            const threadId = 'thread-46';
            const payloadRequest = {
                content: 'ini balasan',
            };

            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpY29kaW5nIiwiaWQiOiJ1c2VyLTEyMyIsImlhdCI6MTYzNjk5NzYxOH0.ode7i4U3sHBDwPw3UnW0qghAtsBgULJr9IT-6FPkyVE';

            const responseAddReplyComment = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                headers: { Authorization: `Bearer ${token}` },
                payload: payloadRequest,
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        userId: 'user-123',
                    },
                },
            });

            // Assert
            expect(responseAddReplyComment.statusCode).toEqual(404);
        });

        it('should response 404 when comment not found', async () => {
            const server = await createServer(container);
            const commentId = 'comment-46';
            const threadId = 'thread-123';
            const payloadRequest = {
                content: 'ini balasan',
            };

            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpY29kaW5nIiwiaWQiOiJ1c2VyLTEyMyIsImlhdCI6MTYzNjk5NzYxOH0.ode7i4U3sHBDwPw3UnW0qghAtsBgULJr9IT-6FPkyVE';

            const responseAddReplyComment = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                headers: { Authorization: `Bearer ${token}` },
                payload: payloadRequest,
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        userId: 'user-123',
                    },
                },
            });

            // Assert
            expect(responseAddReplyComment.statusCode).toEqual(404);
        });

        it('should response thread data', async () => {
            const server = await createServer(container);
            const threadId = 'thread-123';
            const commentId = 'comment-123';
            const payloadRequest = {
                content: 'ini balasan',
            };

            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpY29kaW5nIiwiaWQiOiJ1c2VyLTEyMyIsImlhdCI6MTYzNjk5NzYxOH0.ode7i4U3sHBDwPw3UnW0qghAtsBgULJr9IT-6FPkyVE';

            const responseAddReplyComment = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                headers: { Authorization: `Bearer ${token}` },
                payload: payloadRequest,
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        userId: 'user-123',
                    },
                },
            });

            // Assert
            const responseJson = JSON.parse(responseAddReplyComment.payload);
            expect(responseAddReplyComment.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedReply).toBeDefined();
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
        beforeAll(async () => {
            await ThreadTableTestHelper.addThread({ owner: 'user-123' });
            await ThreadCommentTableTestHelper.addComment({ content: 'hiyaa' });
            await ThreadCommentTableTestHelper.addComment({
                id: 'comment-1234', content: 'hiyaa', parentId: 'comment-123', threadId: 'thread-123',
            });
        });

        afterAll(async () => {
            await ThreadTableTestHelper.cleanTable();
            await ThreadCommentTableTestHelper.cleanTable();
        });

        it('should response 404 when thread not found', async () => {
            const server = await createServer(container);
            const payloadDeleteComment = {
                replyId: 'comment-1234',
                commentId: 'comment-123',
                threadId: 'thread-46',
                owner: 'user-123',
            };
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpY29kaW5nIiwiaWQiOiJ1c2VyLTEyMyIsImlhdCI6MTYzNjk5NzYxOH0.ode7i4U3sHBDwPw3UnW0qghAtsBgULJr9IT-6FPkyVE';

            const reponseDeleteThreadComment = await server.inject({
                method: 'DELETE',
                url: `/threads/${payloadDeleteComment.threadId}/comments/${payloadDeleteComment.commentId}/replies/${payloadDeleteComment.replyId}`,
                headers: { Authorization: `Bearer ${token}` },
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        userId: 'user-123',
                    },
                },
            });

            // Assert
            expect(reponseDeleteThreadComment.statusCode).toEqual(404);
        });

        it('should response 404 when comment not found', async () => {
            const server = await createServer(container);
            const payloadDeleteComment = {
                replyId: 'comment-1234',
                commentId: 'comment-46',
                threadId: 'thread-123',
                owner: 'user-123',
            };
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpY29kaW5nIiwiaWQiOiJ1c2VyLTEyMyIsImlhdCI6MTYzNjk5NzYxOH0.ode7i4U3sHBDwPw3UnW0qghAtsBgULJr9IT-6FPkyVE';

            const reponseDeleteThreadComment = await server.inject({
                method: 'DELETE',
                url: `/threads/${payloadDeleteComment.threadId}/comments/${payloadDeleteComment.commentId}/replies/${payloadDeleteComment.replyId}`,
                headers: { Authorization: `Bearer ${token}` },
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        userId: 'user-123',
                    },
                },
            });

            // Assert
            expect(reponseDeleteThreadComment.statusCode).toEqual(404);
        });

        it('should response 404 when comment not found', async () => {
            const server = await createServer(container);
            const payloadDeleteComment = {
                replyId: 'comment-46',
                commentId: 'comment-123',
                threadId: 'thread-123',
            };
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpY29kaW5nIiwiaWQiOiJ1c2VyLTEyMyIsImlhdCI6MTYzNjk5NzYxOH0.ode7i4U3sHBDwPw3UnW0qghAtsBgULJr9IT-6FPkyVE';

            const reponseDeleteThreadComment = await server.inject({
                method: 'DELETE',
                url: `/threads/${payloadDeleteComment.threadId}/comments/${payloadDeleteComment.commentId}/replies/${payloadDeleteComment.replyId}`,
                headers: { Authorization: `Bearer ${token}` },
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        userId: 'user-123',
                    },
                },
            });

            // Assert
            expect(reponseDeleteThreadComment.statusCode).toEqual(404);
        });

        it('should response 403 when comment not belong to user', async () => {
            const server = await createServer(container);
            const payloadDeleteComment = {
                replyId: 'comment-1234',
                commentId: 'comment-123',
                threadId: 'thread-123',
            };
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpY29kaW5nIiwiaWQiOiJ1c2VyLTEyMyIsImlhdCI6MTYzNjk5NzYxOH0.ode7i4U3sHBDwPw3UnW0qghAtsBgULJr9IT-6FPkyVE';

            const reponseDeleteThreadComment = await server.inject({
                method: 'DELETE',
                url: `/threads/${payloadDeleteComment.threadId}/comments/${payloadDeleteComment.commentId}/replies/${payloadDeleteComment.replyId}`,
                headers: { Authorization: `Bearer ${token}` },
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        userId: 'user-1234',
                    },
                },
            });

            // Assert
            expect(reponseDeleteThreadComment.statusCode).toEqual(403);
        });

        it('should delete thread', async () => {
            const server = await createServer(container);
            const payloadDeleteComment = {
                replyId: 'comment-1234',
                commentId: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
            };
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpY29kaW5nIiwiaWQiOiJ1c2VyLTEyMyIsImlhdCI6MTYzNjk5NzYxOH0.ode7i4U3sHBDwPw3UnW0qghAtsBgULJr9IT-6FPkyVE';

            const reponseDeleteThreadComment = await server.inject({
                method: 'DELETE',
                url: `/threads/${payloadDeleteComment.threadId}/comments/${payloadDeleteComment.commentId}/replies/${payloadDeleteComment.replyId}`,
                headers: { Authorization: `Bearer ${token}` },
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        userId: 'user-123',
                    },
                },
            });

            // Assert
            const responseJson = JSON.parse(reponseDeleteThreadComment.payload);
            expect(reponseDeleteThreadComment.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });
    });
});
