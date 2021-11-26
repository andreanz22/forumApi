const AddThread = require('../../Domains/threads/entities/AddThread');
const { mapCommentRepliesModel } = require('../../Commons/Utils/MapsArray');

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
        if (!comments) {
            return thread;
        }

        const mappedCommentIds = comments.map(((data) => data.id));
        const replies = await this._threadCommentRepository.getReplies(mappedCommentIds);
        if (replies) {
            for (let index = 0; index < comments.length; index++) {
                const temp = replies.filter((data) => data.parent_id === comments[index].id);
                if (temp.length > 0) {
                    comments[index].replies = temp.map(mapCommentRepliesModel);
                }
            }
        }

        thread.comments = comments;
        return thread;
    }
}

module.exports = ThreadUseCase;
