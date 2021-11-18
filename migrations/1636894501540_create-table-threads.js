exports.up = (pgm) => {
    pgm.createTable('threads', {
        id: {
            type: 'VARCHAR(64)',
            primaryKey: true,
        },
        title: {
            type: 'TEXT',
            notNull: true,
        },
        body: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(64)',
            notNull: true,
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

    pgm.addConstraint('threads', 'fk_threads.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    pgm.dropTable('threads');
};
