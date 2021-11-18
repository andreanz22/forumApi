exports.up = (pgm) => {
    pgm.createTable('thread_comments', {
        id: {
            type: 'VARCHAR(64)',
            primaryKey: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(64)',
            notNull: true,
        },
        thread_id: {
            type: 'VARCHAR(64)',
            notNull: true,
        },
        parent_id: {
            type: 'VARCHAR(64)',
            default: null,
        },
        created_at: {
            type: 'TIMESTAMPTZ',
            notNull: true,
        },
        updated_at: {
            type: 'TIMESTAMPTZ',
            notNull: true,
        },
        is_deleted: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
    });

    pgm.addConstraint('thread_comments', 'fk_thread_comments.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('thread_comments', 'fk_thread_comments.thread_id_threads.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    pgm.dropTable('threads');
};
