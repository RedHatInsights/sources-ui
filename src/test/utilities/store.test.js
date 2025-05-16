import { getProdStore, urlQueryMiddleware } from '../../utilities/store';
import { defaultSourcesState } from '../../redux/sources/reducer';
import { defaultUserState } from '../../redux/user/reducer';
import * as queries from '../../utilities/urlQuery';
import { ACTION_TYPES } from '../../redux/sources/actionTypes';
import { getDevStore } from '../../utilities/getDevStore';

describe('store creator', () => {
  const EXPECTED_DEFAULT_STATE = {
    sources: defaultSourcesState,
    user: defaultUserState,
  };

  it('creates DevStore', () => {
    const tmp = console.log;
    const tmpGroup = console.group;
    console.log = jest.fn();
    console.group = jest.fn();

    expect(window.sourcesDebug).toEqual(undefined);

    const store = getDevStore();

    expect(store.getState()).toEqual(EXPECTED_DEFAULT_STATE);

    expect(window.sourcesDebug).toEqual({
      showEmptyState: expect.any(Function),
      removePermissions: expect.any(Function),
      setCount: expect.any(Function),
      setPermissions: expect.any(Function),
    });

    window.sourcesDebug.setCount(12);
    expect(store.getState().sources.numberOfEntities).toEqual(12);

    window.sourcesDebug.showEmptyState();
    expect(store.getState().sources.numberOfEntities).toEqual(0);

    window.sourcesDebug.setPermissions();
    expect(store.getState().user.writePermissions).toEqual(true);

    window.sourcesDebug.removePermissions();
    expect(store.getState().user.writePermissions).toEqual(false);

    window.sourcesDebug = {};
    console.log = tmp;
    console.group = tmpGroup;
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
        loaded: true,
      };
    });

    it('calls update url when load_entities_pending', () => {
      options = {
        pageSize: 2,
        filterValue: {
          name: 'johny smith',
        },
      };

      action = {
        type: ACTION_TYPES.LOAD_ENTITIES_PENDING,
        options,
      };

      store = {
        getState: () => ({ sources }),
      };

      urlQueryMiddleware(store)(next)(action);

      const combinedState = {
        ...sources,
        ...options,
      };

      expect(next).toHaveBeenCalledWith(action);
      expect(queries.updateQuery).toHaveBeenCalledWith(combinedState);
    });

    it('does not call update url when action is not load_entities_pending', () => {
      action = {
        type: ACTION_TYPES.LOAD_ENTITIES_FULFILLED,
      };

      store = {
        getState: () => ({ sources }),
      };

      urlQueryMiddleware(store)(next)(action);

      expect(next).toHaveBeenCalledWith(action);
      expect(queries.updateQuery).not.toHaveBeenCalledWith(sources);
    });
  });
});
