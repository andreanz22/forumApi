const AddedThread = require('../../Domains/threads/entities/AddedThread');
const Thread = require('../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(addThread) {
        const { title, body, owner } = addThread;
        const id = `thread-${this._idGenerator()}`;
        const insertedAt = new Date().toISOString();

        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6) RETURNING id, title, owner',
            values: [id, title, body, owner, insertedAt, insertedAt],
        };

        const result = await this._pool.query(query);

        return new AddedThread({ ...result.rows[0] });
    }

    async getThreadDetail(threadId) {
        const query = {
            text: `SELECT threads.*, users.username  FROM threads 
                    inner join users on users.id = threads.owner
                    WHERE threads.id = $1 and threads.is_deleted = false`,
            values: [threadId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('thread tidak ditemukan');
        }

        return new Thread({ ...result.rows[0], date: result.rows[0].created_at.toISOString() });
    }

    async verifyAvailableThread(threadId) {
        const query = {
            text: 'SELECT id FROM threads WHERE id = $1 and is_deleted = false',
            values: [threadId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('thread tidak ditemukan');
        }
    }
}

module.exports = ThreadRepositoryPostgres;
