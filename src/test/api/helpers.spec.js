import { pagination, filtering, sorting } from '../../api/entities';

describe('api helpers', () => {
    describe('pagination', () => {
        it('creates pagination query param 1', () => {
            const PAGE_SIZE = 10;
            const PAGE_NUMBER = 1;

            expect(pagination(PAGE_SIZE, PAGE_NUMBER)).toEqual(
                'limit:10, offset:0'
            );
        });

        it('creates pagination query param 2', () => {
            const PAGE_SIZE = 1;
            const PAGE_NUMBER = 5;

            expect(pagination(PAGE_SIZE, PAGE_NUMBER)).toEqual(
                'limit:1, offset:4'
            );
        });

        it('creates pagination query param 3', () => {
            const PAGE_SIZE = 100;
            const PAGE_NUMBER = 3;

            expect(pagination(PAGE_SIZE, PAGE_NUMBER)).toEqual(
                'limit:100, offset:200'
            );
        });
    });

    describe('filtering', () => {
        it('creates filtering query param', () => {
            const NAME = 'jonas';

            expect(filtering(NAME)).toEqual(
                ', filter: { name: { contains_i: "jonas"} }'
            );
        });

        it('creates empty filtering query param', () => {
            expect(filtering()).toEqual('');
        });
    });

    describe('sorting', () => {
        it('creates sorting query param', () => {
            const SORT_BY = 'name';
            const SORT_DIRECTION = 'desc';

            expect(sorting(SORT_BY, SORT_DIRECTION)).toEqual(
                ', sort_by:"name:desc"'
            );
        });

        it('creates empty sorting query param', () => {
            expect(filtering()).toEqual('');
        });
    });
});
