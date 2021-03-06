const mapCommentModel = (data) => ({
    id: data.id,
    content: (data.is_deleted ? '**komentar telah dihapus**' : data.content),
    date: data.created_at.toISOString(),
    username: data.username,
    likeCount: Number(data.like_count), // convert to number
});

const mapCommentRepliesModel = (data) => ({
    id: data.id,
    content: (data.is_deleted ? '**balasan telah dihapus**' : data.content),
    date: data.created_at.toISOString(),
    username: data.username,
});

module.exports = { mapCommentModel, mapCommentRepliesModel };
