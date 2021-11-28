const { mapCommentModel, mapCommentRepliesModel } = require('../MapsArray');

describe('MapArray', () => {
    describe('mapCommentModel', () => {
        it('should mapping object correctly', () => {
            const dateTest = new Date('2021-11-17T08:58:02.684Z').toISOString();

            const arrayData = mapCommentModel({
                id: 'comment-123',
                username: 'Renova',
                content: 'hiyaa',
                created_at: new Date('2021-11-17T08:58:02.684Z'),
                is_deleted: false,
                like_count: '0',
            });

            const expectedResult = {
                id: 'comment-123',
                username: 'Renova',
                content: 'hiyaa',
                date: dateTest,
                // likeCount: 0,
            };

            expect(arrayData).toStrictEqual(expectedResult);
        });

        it('should mapping object with deleted comment correctly', () => {
            const dateTest = new Date('2021-11-17T08:58:02.684Z').toISOString();

            const arrayData = mapCommentModel({
                id: 'comment-123',
                username: 'Renova',
                content: 'hiyaa',
                created_at: new Date('2021-11-17T08:58:02.684Z'),
                is_deleted: true,
                like_count: '0',
            });

            const expectedResult = {
                id: 'comment-123',
                username: 'Renova',
                content: '**komentar telah dihapus**',
                date: dateTest,
                likeCount: 0,
            };

            expect(arrayData).toStrictEqual(expectedResult);
        });
    });

    describe('mapCommentRepliesModel', () => {
        it('should mapping object correctly', () => {
            const dateTest = new Date('2021-11-17T08:58:02.684Z').toISOString();

            const arrayData = mapCommentRepliesModel({
                id: 'comment-123',
                username: 'Renova',
                content: 'hiyaa',
                created_at: new Date('2021-11-17T08:58:02.684Z'),
                is_deleted: false,
            });

            const expectedResult = {
                id: 'comment-123',
                username: 'Renova',
                content: 'hiyaa',
                date: dateTest,
            };

            expect(arrayData).toStrictEqual(expectedResult);
        });

        it('should mapping object with deleted comment correctly', () => {
            const dateTest = new Date('2021-11-17T08:58:02.684Z').toISOString();

            const arrayData = mapCommentRepliesModel({
                id: 'comment-123',
                username: 'Renova',
                content: 'hiyaa',
                created_at: new Date('2021-11-17T08:58:02.684Z'),
                is_deleted: true,
            });

            const expectedResult = {
                id: 'comment-123',
                username: 'Renova',
                content: '**balasan telah dihapus**',
                date: dateTest,
            };

            expect(arrayData).toStrictEqual(expectedResult);
        });
    });
});
