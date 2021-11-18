class DeleteThreadComment {
    constructor(payload) {
        this._verifyPayload(payload);
        const {
            commentId, replyId, threadId, owner,
        } = payload;

        this.commentId = commentId;
        this.replyId = replyId;
        this.threadId = threadId;
        this.owner = owner;
    }

    _verifyPayload({
        commentId, threadId, owner, replyId,
    }) {
        if (!commentId || !threadId || !owner || !replyId) {
            throw new Error('DELETE_THREAD_COMMENT_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof commentId !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string' || typeof replyId !== 'string') {
            throw new Error('DELETE_THREAD_COMMENT_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = DeleteThreadComment;
