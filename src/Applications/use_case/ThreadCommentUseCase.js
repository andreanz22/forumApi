const AddThreadComment = require('../../Domains/threads/comments/entities/AddThreadComment');
const AddReply = require('../../Domains/threads/comments/entities/AddReply');
const DeleteThreadComment = require('../../Domains/threads/comments/entities/DeleteThreadComment');
const DeleteThreadCommentReply = require('../../Domains/threads/comments/entities/DeleteThreadCommentReply');

class ThreadCommentUseCase {
    constructor({ threadCommentRepository, threadRepository }) {
        this._threadCommentRepository = threadCommentRepository;
        this._threadRepository = threadRepository;
    }

    async addComment(useCasePayload) {
        const addThreadComment = new AddThreadComment(useCasePayload);
        await this._threadRepository.verifyAvailableThread(useCasePayload.threadId);
        return this._threadCommentRepository.addComment(addThreadComment);
    }

    async addReply(useCasePayload) {
        const addReply = new AddReply(useCasePayload);
        await this._threadRepository.verifyAvailableThread(addReply.threadId);
        await this._threadCommentRepository.verifyAvailableComment(addReply);
        return this._threadCommentRepository.addComment(addReply);
    }

    async deleteComment(useCasePayload) {
        const deleteThreadComment = new DeleteThreadComment(useCasePayload);
        await this._threadRepository.verifyAvailableThread(useCasePayload.threadId);
        const comment = await this._threadCommentRepository.getComment(deleteThreadComment);
        if (comment.owner !== deleteThreadComment.owner) {
            throw new Error('DELETE_COMMENT_USE_CASE.NOT_OWNER_OF_COMMENT');
        }
        await this._threadCommentRepository.deleteComment(comment.id);
    }

    async deleteCommentReplies(useCasePayload) {
        const deleteThreadCommentReply = new DeleteThreadCommentReply(useCasePayload);
        await this._threadRepository.verifyAvailableThread(deleteThreadCommentReply.threadId);
        await this._threadCommentRepository.getComment(deleteThreadCommentReply);
        const reply = await this._threadCommentRepository.getComment(deleteThreadCommentReply);
        if (reply.owner !== deleteThreadCommentReply.owner) {
            throw new Error('DELETE_COMMENT_REPLIES_USE_CASE.NOT_OWNER_OF_COMMENT');
        }
        await this._threadCommentRepository.deleteComment(reply.id);
    }
}

module.exports = ThreadCommentUseCase;
