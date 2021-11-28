/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikeTableTestHelper = {
    async addLike({
        id = 'like-123', commentId = 'comment-123', owner = 'user-123', insertedAt = new Date().toISOString(),
    }) {
        const query = {
            text: 'INSERT INTO likes(id, comment_id, owner, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)',
            values: [id, commentId, owner, insertedAt, insertedAt],
        };

        await pool.query(query);
    },

    async findLike(id) {
        const query = {
            text: 'SELECT id FROM likes WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);

        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM likes WHERE 1=1');
    },
};

module.exports = LikeTableTestHelper;
