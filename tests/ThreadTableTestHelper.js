/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadTableTestHelper = {
    async addThread({
        title = 'hello', body = 'hello bossq', owner = 'user-123', insertedAt = new Date().toISOString(),
    }) {
        const id = 'thread-123';
        // const insertedAt = new Date().toISOString();
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6)',
            values: [id, title, body, owner, insertedAt, insertedAt],
        };

        await pool.query(query);
    },

    async cleanTable() {
        await pool.query('DELETE FROM threads WHERE 1=1');
    },
};

module.exports = ThreadTableTestHelper;
