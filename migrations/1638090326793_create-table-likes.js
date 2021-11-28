exports.up = (pgm) => {
    pgm.createTable('likes', {
        id: {
            type: 'VARCHAR(64)',
            primaryKey: true,
        },
        comment_id: {
            type: 'VARCHAR(64)',
            default: null,
        },
        owner: {
            type: 'VARCHAR(64)',
            notNull: true,
        },
        created_at: {
            type: 'TIMESTAMPTZ',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'TIMESTAMPTZ',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.addConstraint('likes', 'fk_likes.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('likes', 'fk_likes.thread_comments.id', 'FOREIGN KEY(comment_id) REFERENCES thread_comments(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    pgm.dropTable('likes');
};
