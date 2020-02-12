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
        let options;

        beforeEach(() => {
            next = jest.fn();
            queries.updateQuery = jest.fn();
            sources = {
                pageSize: 1,
                pageNumber: 125,
                loaded: true
            };
        });

        it('calls update url when load_entities_pending', () => {
            options = {
                pageSize: 2,
                filterValue: {
                    name: 'johny smith'
                }
            };

            action = {
                type: ACTION_TYPES.LOAD_ENTITIES_PENDING,
                options
            };

            store = {
                getState: () => ({ sources })
            };

            urlQueryMiddleware(store)(next)(action);

            const combinedState = {
                ...sources,
                ...options
            };

            expect(next).toHaveBeenCalledWith(action);
            expect(queries.updateQuery).toHaveBeenCalledWith(combinedState);
        });

        it('does not call update url when action is not load_entities_pending', () => {
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
    });
});
