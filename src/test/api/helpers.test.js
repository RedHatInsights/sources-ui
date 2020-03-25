import { pagination, filtering, sorting, restFilterGenerator } from '../../api/entities';

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
        const NAME = 'jonas';
        const SOURCE_TYPE_ID = ['1', '09090'];

        const EXPECTED_NAME_QUERY = `name: { contains_i: "${NAME}" }`;
        const EXPECTED_TYPE_QUERY = 'source_type_id: { eq: ["1", "09090"] }';

        const EXPECTED_NAME_QUERY_REST = `filter[name][contains_i]=${NAME}`;
        const EXPECTED_TYPE_QUERY_REST = `filter[source_type_id][]=1&filter[source_type_id][]=09090`;

        it('creates filtering query name param [GRAPHQL]', () => {
            const filterValue = { name: NAME };

            expect(filtering(filterValue)).toEqual(
                `, filter: { ${EXPECTED_NAME_QUERY} }`
            );
        });

        it('creates filtering query source_type_id param [GRAPHQL]', () => {
            const filterValue = { source_type_id: SOURCE_TYPE_ID };

            expect(filtering(filterValue)).toEqual(
                `, filter: { ${EXPECTED_TYPE_QUERY} }`
            );
        });

        it('creates filtering query combined param [GRAPHQL]', () => {
            const filterValue = { source_type_id: SOURCE_TYPE_ID, name: NAME };

            expect(filtering(filterValue)).toEqual(
                `, filter: { ${EXPECTED_NAME_QUERY}, ${EXPECTED_TYPE_QUERY} }`
            );
        });

        it('creates empty filtering query when empty array [GRAPHQL]', () => {
            const filterValue = { source_type_id: [] };

            expect(filtering(filterValue)).toEqual('');
        });

        it('creates empty filtering query param [GRAPHQL]', () => {
            expect(filtering()).toEqual('');
        });

        it('creates filtering query name param [REST]', () => {
            const filterValue = { name: NAME };

            expect(restFilterGenerator(filterValue)).toEqual(EXPECTED_NAME_QUERY_REST);
        });

        it('creates filtering query source_type_id param [REST]', () => {
            const filterValue = { source_type_id: SOURCE_TYPE_ID };

            expect(restFilterGenerator(filterValue)).toEqual(EXPECTED_TYPE_QUERY_REST);
        });

        it('creates filtering query combined param [REST]', () => {
            const filterValue = { source_type_id: SOURCE_TYPE_ID, name: NAME };

            expect(restFilterGenerator(filterValue)).toEqual(
                `${EXPECTED_NAME_QUERY_REST}&${EXPECTED_TYPE_QUERY_REST}`
            );
        });

        it('creates empty filtering query when source_type_id is empty array [REST]', () => {
            const filterValue = { source_type_id: [] };

            expect(restFilterGenerator(filterValue)).toEqual('');
        });

        it('creates empty filtering query param [REST]', () => {
            expect(restFilterGenerator()).toEqual('');
        });
    });

    describe('sorting', () => {
        it('creates sorting query param - empty sort_by', () => {
            const SORT_BY = '';
            const SORT_DIRECTION = 'desc';

            expect(sorting(SORT_BY, SORT_DIRECTION)).toEqual(
                ''
            );
        });

        it('creates sorting query param', () => {
            const SORT_BY = 'name';
            const SORT_DIRECTION = 'desc';

            expect(sorting(SORT_BY, SORT_DIRECTION)).toEqual(
                ',sort_by:{name:"desc"}'
            );
        });

        it('creates sorting query param for source_type_id', () => {
            const SORT_BY = 'source_type_id';
            const SORT_DIRECTION = 'desc';

            expect(sorting(SORT_BY, SORT_DIRECTION)).toEqual(
                ',sort_by:{source_type:{product_name:"desc"}}'
            );
        });

        it('creates sorting query param for applications', () => {
            const SORT_BY = 'applications';
            const SORT_DIRECTION = 'desc';

            expect(sorting(SORT_BY, SORT_DIRECTION)).toEqual(
                ',sort_by:{applications:{__count:"desc"}}'
            );
        });

        it('creates empty sorting query param', () => {
            expect(filtering()).toEqual('');
        });
    });
});
