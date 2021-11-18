class AddThreadComment {
    constructor(payload) {
        this._verifyPayload(payload);
        const { content, threadId, owner } = payload;

        this.content = content;
        this.threadId = threadId;
        this.owner = owner;
    }

    _verifyPayload({ content, threadId, owner }) {
        if (typeof content === 'undefined' || !threadId || !owner) {
            throw new Error('ADD_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof content !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string') {
            throw new Error('ADD_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        if (content === '') {
            throw new Error('ADD_THREAD_COMMENT.COMMENT_NOT_VALID');
        }
    }
}

module.exports = AddThreadComment;
