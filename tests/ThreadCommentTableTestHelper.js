/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentTableTestHelper = {
    async addComment({
        id = 'comment-123', content = 'hiyaa', threadId = 'thread-123', owner = 'user-123', parentId = null, insertedAt = new Date().toISOString(),
    }) {
        const query = {
            text: 'INSERT INTO thread_comments(id, content, owner, thread_id, parent_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            values: [id, content, owner, threadId, parentId, insertedAt, insertedAt],
        };

        await pool.query(query);
    },

    async findComment(id) {
        const query = {
            text: 'SELECT id FROM thread_comments WHERE id = $1 and is_deleted = false',
            values: [id],
        };

        const result = await pool.query(query);

        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM thread_comments WHERE 1=1');
    },
};

module.exports = ThreadCommentTableTestHelper;
