const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');
const ThreadCommentUseCase = require('../../../../Applications/use_case/ThreadCommentUseCase');

class ThreadHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.postThreadComment = this.postThreadComment.bind(this);
        this.deleteThreadComment = this.deleteThreadComment.bind(this);
        this.getDetailThread = this.getDetailThread.bind(this);
        this.postCommentReply = this.postCommentReply.bind(this);
        this.deleteThreadCommentReplies = this.deleteThreadCommentReplies.bind(this);
    }

    async postThreadHandler(request, h) {
        const threadUseCase = this._container.getInstance(ThreadUseCase.name);
        const { userId: owner } = request.auth.credentials;
        const addedThread = await threadUseCase.addThread(request.payload, owner);

        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });
        response.code(201);
        return response;
    }

    async postThreadComment(request, h) {
        const threadCommentUseCase = this._container.getInstance(ThreadCommentUseCase.name);
        const { threadId } = request.params;
        const { userId: owner } = request.auth.credentials;
        const { content } = request.payload;

        const addedComment = await threadCommentUseCase.addComment({ content, threadId, owner });
        const response = h.response({
            status: 'success',
            data: {
                addedComment,
            },
        });
        response.code(201);
        return response;
    }

    async deleteThreadComment(request, h) {
        const threadCommentUseCase = this._container.getInstance(ThreadCommentUseCase.name);
        const { threadId, commentId } = request.params;
        const { userId: owner } = request.auth.credentials;

        await threadCommentUseCase.deleteComment({ commentId, threadId, owner });
        return {
            status: 'success',
        };
    }

    async getDetailThread(request, h) {
        const threadUseCase = this._container.getInstance(ThreadUseCase.name);
        const threadCommentUseCase = this._container.getInstance(ThreadCommentUseCase.name);

        const { threadId } = request.params;
        const thread = await threadUseCase.getDetailThread({ threadId });
        const response = h.response({
            status: 'success',
            data: {
                thread,
            },
        });
        response.code(200);
        return response;
    }

    async postCommentReply(request, h) {
        const threadCommentUseCase = this._container.getInstance(ThreadCommentUseCase.name);
        const { threadId, commentId } = request.params;
        const { userId: owner } = request.auth.credentials;
        const { content } = request.payload;
        const addedReply = await threadCommentUseCase.addReply({
            content, threadId, commentId, owner,
        });

        const response = h.response({
            status: 'success',
            data: {
                addedReply,
            },
        });
        response.code(201);
        return response;
    }

    async deleteThreadCommentReplies(request, h) {
        const threadCommentUseCase = this._container.getInstance(ThreadCommentUseCase.name);
        const { threadId, commentId, replyId } = request.params;
        const { userId: owner } = request.auth.credentials;

        await threadCommentUseCase.deleteCommentReplies({
            commentId, threadId, replyId, owner,
        });
        return {
            status: 'success',
        };
    }
}

module.exports = ThreadHandler;
