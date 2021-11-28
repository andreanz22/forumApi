class Like {
    constructor(payload) {
        this._verifyPayload({ ...payload });

        const {
            id, comment_id: commentId, owner, created_at: createdAt,
        } = payload;

        this.id = id;
        this.commentId = commentId;
        this.owner = owner;
        this.createdAt = createdAt;
    }

    _verifyPayload({
        id, comment_id: commentId, owner, created_at: createdAt,
    }) {
        if (!id || !commentId || !owner || !createdAt) {
            throw new Error('LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string' || (typeof createdAt !== 'object')) {
            throw new Error('LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = Like;
