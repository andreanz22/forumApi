const AddThread = require('../../Domains/threads/entities/AddThread');

class ThreadUseCase {
    constructor({ threadRepository, threadCommentRepository }) {
        this._threadRepository = threadRepository;
        this._threadCommentRepository = threadCommentRepository;
    }

    async addThread(useCasePayload, owner) {
        const addThread = new AddThread(useCasePayload, owner);
        return this._threadRepository.addThread(addThread);
    }

    async getDetailThread(useCasePayload) {
        const thread = await this._threadRepository.getThreadDetail(useCasePayload.threadId);
        const comments = await this._threadCommentRepository.getComments(useCasePayload.threadId);
        if (comments) {
            thread.comments = comments;
        }
        return thread;
    }
}

module.exports = ThreadUseCase;
