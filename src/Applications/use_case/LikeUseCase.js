const AddLike = require('../../Domains/threads/likes/entities/AddLike');

class LikeUseCase {
    constructor({ threadRepository, threadCommentRepository, likeRepository }) {
        this._threadRepository = threadRepository;
        this._threadCommentRepository = threadCommentRepository;
        this._likeRepository = likeRepository;
    }

    async likeOrUnlikeComment(useCasePayload) {
        const addLike = new AddLike(useCasePayload);
        await this._threadRepository.verifyAvailableThread(useCasePayload.threadId);
        await this._threadCommentRepository.verifyAvailableComment(useCasePayload);
        const like = await this._likeRepository.getLike(addLike);
        if (!like) { // if like doesn't exist then like comment
            return this._likeRepository.like(addLike);
        }

        return this._likeRepository.unlike(like.id);
    }
}

module.exports = LikeUseCase;
