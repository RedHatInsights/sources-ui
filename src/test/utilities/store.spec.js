import { getDevStore, getProdStore, urlQueryMiddleware } from '../../Utilities/store';
import { defaultSourcesState } from '../../redux/sources/reducer';
import { defaultUserState } from '../../redux/user/reducer';
import * as queries from '../../Utilities/urlQuery';
import { ACTION_TYPES } from '../../redux/sources/actions-types';

describe('store creator', () => {
    const EXPECTED_DEFAULT_STATE = {
        notifications: [],
        sources: defaultSourcesState,
        user: defaultUserState
    };

    it('creates DevStore', () => {
        const store = getDevStore();

        expect(store.getState()).toEqual(EXPECTED_DEFAULT_STATE);
    });

    it('creates ProdStore', () => {
        const store = getProdStore();

        expect(store.getState()).toEqual(EXPECTED_DEFAULT_STATE);
    });

    describe('url middleware', () => {
        let store;
        let next;
        let action;
        let sources;

        beforeEach(() => {
            next = jest.fn();
            queries.updateQuery = jest.fn();
        });

        it('calls update url when app is loaded and type is load_entities_fulfilled', () => {
            sources = {
                pageSize: 1,
                pageNumber: 125,
                loaded: true
            };

            action = {
                type: ACTION_TYPES.LOAD_ENTITIES_FULFILLED
            };

            store = {
                getState: () => ({ sources })
            };

            urlQueryMiddleware(store)(next)(action);

            expect(next).toHaveBeenCalledWith(action);
            expect(queries.updateQuery).toHaveBeenCalledWith(sources);
        });

        it('does not call update url when app is not loaded and type is load_entities_fulfilled', () => {
            sources = {
                loaded: false
            };

            action = {
                type: ACTION_TYPES.LOAD_ENTITIES_FULFILLED
            };

            store = {
                getState: () => ({ sources })
            };

            urlQueryMiddleware(store)(next)(action);

            expect(next).toHaveBeenCalledWith(action);
            expect(queries.updateQuery).not.toHaveBeenCalledWith(sources);
        });

        it('does not call update url when app is loaded and type is not load_entities_fulfilled', () => {
            sources = {
                loaded: false
            };

            action = {
                type: ACTION_TYPES.LOAD_ENTITIES_PENDING
            };

            store = {
                getState: () => ({ sources })
            };

            urlQueryMiddleware(store)(next)(action);

            expect(next).toHaveBeenCalledWith(action);
            expect(queries.updateQuery).not.toHaveBeenCalledWith(sources);
        });
    });
});
