class Comment {
    constructor(payload) {
        this._verifyPayload({ ...payload });

        const {
            id, username, content, date, is_deleted: isDeleted,
        } = payload;

        this.id = id;
        this.username = username;
        this.date = date;
        this.content = (isDeleted ? '**komentar telah dihapus**' : content);
    }

    _verifyPayload({
        id, username, content, created_at: date,
    }) {
        if (!id || !username || !content || !date) {
            throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof username !== 'string' || typeof content !== 'string' || (typeof date !== 'object' && typeof date !== 'string')) {
            throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = Comment;
