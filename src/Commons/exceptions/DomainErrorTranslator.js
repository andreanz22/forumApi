const InvariantError = require('./InvariantError');
const AuthorizationError = require('./AuthorizationError');

const DomainErrorTranslator = {
    translate(error) {
        return DomainErrorTranslator._directories[error.message] || error;
    },
};

DomainErrorTranslator._directories = {
    'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
    'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
    'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
    'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
    'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
    'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
    'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
    'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
    'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
    'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),

    'ADD_THREAD.MISSING_PARAMETERS': new InvariantError('tidak dapat membuat thread karena param yang dibutuhkan tidak ada'),
    'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread karena properti yang dibutuhkan tidak ada'),
    'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'),
    'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('gagal membuat thread karena properti yang dibutuhkan tidak ada'),
    'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('gagal membuat thread baru karena tipe data tidak sesuai'),

    'ADDED_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat comment karena param yang dibutuhkan tidak ada'),
    'ADDED_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat comment karena properti yang dibutuhkan tidak ada'),
    'ADD_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread baru karena param yang dibutuhkan tidak ada'),
    'ADD_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat comment karena param yang dibutuhkan tidak ada'),
    'ADD_THREAD_COMMENT.COMMENT_NOT_VALID': new InvariantError('gagal membuat comment baru karena isi comment tidak ada'),

    'DELETE_COMMENT_USE_CASE.NOT_OWNER_OF_COMMENT': new AuthorizationError('anda bukan pemilik comment'),

    'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membalas comment karena param yang dibutuhkan tidak ada'),
    'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membalas comment karena data tidak sesuai yg diminta'),
    'ADD_REPLY.COMMENT_NOT_VALID': new InvariantError('gagal membalas comment baru karena isi comment tidak ada'),

    'DELETE_THREAD_COMMENT_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menghapus comment karena param yang dibutuhkan tidak ada'),
    'DELETE_THREAD_COMMENT_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menghapus comment karena data type tidak benar'),
    'DELETE_COMMENT_REPLIES_USE_CASE.NOT_OWNER_OF_COMMENT': new AuthorizationError('anda bukan pemilik comment'),
};

module.exports = DomainErrorTranslator;
