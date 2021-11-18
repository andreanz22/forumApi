class AddThread {
    constructor(payload, owner) {
        this._verifyPayload(payload);

        if (owner === undefined) {
            throw new Error('ADD_THREAD.MISSING_PARAMETERS');
        }

        const { title, body } = payload;

        this.title = title;
        this.body = body;
        this.owner = owner;
    }

    _verifyPayload({ title, body }) {
        if (!title || !body) {
            throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof title !== 'string' || typeof body !== 'string') {
            throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddThread;
