class AddReply {
    constructor(payload) {
        this._verifyPayload(payload);
        const {
            content, threadId, owner, commentId,
        } = payload;

        this.content = content;
        this.threadId = threadId;
        this.commentId = commentId;
        this.owner = owner;
    }

    _verifyPayload({
        content, threadId, owner, commentId,
    }) {
        if (typeof content === 'undefined' || !threadId || !owner || !commentId) {
            throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof content !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string' || typeof commentId !== 'string') {
            throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        if (content === '') {
            throw new Error('ADD_REPLY.COMMENT_NOT_VALID');
        }
    }
}

module.exports = AddReply;
