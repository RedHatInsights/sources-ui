import * as sourcesReducer from '../../../redux/sources/reducer';

describe('redux > sources reducer', () => {
  const SOURCE_ID = '5646874215432';
  const APP_ID = '55654';

  const defaultSourcesState = sourcesReducer.defaultSourcesState;

  describe('entitiesLoaded', () => {
    const SOURCES = [
      { id: '1', name: 'name1' },
      { id: '2', name: 'name2' },
    ];
    const COUNT = 1234;
    const DATA = { payload: { sources: SOURCES, sources_aggregate: { aggregate: { total_count: COUNT } } } };

    const EXPECTED_STATE = {
      ...defaultSourcesState,
      numberOfEntities: COUNT,
      entities: SOURCES,
      loaded: 0,
    };

    const unloadedInitialState = { ...defaultSourcesState, loaded: 1 };

    it('loads the entities', () => {
      expect(sourcesReducer.entitiesLoaded(unloadedInitialState, DATA)).toEqual(expect.objectContaining(EXPECTED_STATE));
    });

    it('pass additional props', () => {
      const ADDITIONAL_OPTIONS = {
        pageNumber: 1,
      };

      const NEW_DATA = {
        ...DATA,
        ...ADDITIONAL_OPTIONS,
      };

      expect(sourcesReducer.entitiesLoaded(unloadedInitialState, NEW_DATA)).toEqual(
        expect.objectContaining({
          ...EXPECTED_STATE,
          ...ADDITIONAL_OPTIONS,
        })
      );
    });

    it('when loaded is below zero, set zero', () => {
      expect(sourcesReducer.entitiesLoaded(EXPECTED_STATE, DATA)).toEqual(expect.objectContaining(EXPECTED_STATE));
    });
  });

  describe('filterSources', () => {
    const value = { name: 'name' };

    it('sets filter value', () => {
      expect(
        sourcesReducer.filterSources(defaultSourcesState, {
          payload: { value },
        })
      ).toEqual({
        ...defaultSourcesState,
        filterValue: {
          name: 'name',
        },
      });
    });

    it('switch to the first page', () => {
      const stateOnSecondPage = {
        ...defaultSourcesState,
        pageNumber: 12,
      };

      expect(sourcesReducer.filterSources(stateOnSecondPage, { payload: { value } })).toEqual({
        ...defaultSourcesState,
        filterValue: {
          name: 'name',
        },
        pageNumber: 1,
      });
    });
  });

  describe('clearFilters', () => {
    const state = {
      ...defaultSourcesState,
      filterValue: {
        xxx: 'yyy',
        name: [1, 2, 3],
      },
      pageNumber: 12,
    };

    it('clears filter', () => {
      expect(sourcesReducer.clearFilters(state)).toEqual({
        ...defaultSourcesState,
        filterValue: {},
        pageNumber: 1,
      });
    });
  });

  it('entitiesPending sets loaded to false and includes options', () => {
    const payload = {
      options: {
        custom: 'custom',
      },
    };

    expect(sourcesReducer.entitiesPending(defaultSourcesState, payload)).toEqual({
      ...defaultSourcesState,
      loaded: 1,
      custom: 'custom',
      paginationClicked: false,
    });
  });

  it('entitiesPending sets loaded to false and overwrites paginationClicked', () => {
    const payload = {
      options: {
        paginationClicked: true,
      },
    };

    expect(sourcesReducer.entitiesPending(defaultSourcesState, payload)).toEqual({
      ...defaultSourcesState,
      loaded: 1,
      paginationClicked: true,
    });
  });

  it('entitiesRejected sets fetching error', () => {
    const payload = { payload: { error: 'error' } };

    expect(sourcesReducer.entitiesRejected(defaultSourcesState, payload)).toEqual({
      ...defaultSourcesState,
      fetchingError: 'error',
    });
  });

  it('sourceTypesPending sets empty sourceTypes', () => {
    expect(sourcesReducer.sourceTypesPending(defaultSourcesState)).toEqual({
      ...defaultSourcesState,
      sourceTypes: [],
      sourceTypesLoaded: false,
    });
  });

  it('sourceTypesPending sets sourceTypes', () => {
    const SOURCE_TYPES = ['aaa', 'bbb'];
    const payload = { payload: SOURCE_TYPES };

    expect(sourcesReducer.sourceTypesLoaded(defaultSourcesState, payload)).toEqual({
      ...defaultSourcesState,
      sourceTypes: SOURCE_TYPES,
      sourceTypesLoaded: true,
    });
  });

  it('appTypesPending sets empty appTypes', () => {
    expect(sourcesReducer.appTypesPending(defaultSourcesState)).toEqual({
      ...defaultSourcesState,
      appTypes: [],
      appTypesLoaded: false,
    });
  });

  it('appTypesPending sets appTypes', () => {
    const APP_TYPES = ['aaa', 'bbb'];
    const payload = { payload: APP_TYPES };

    expect(sourcesReducer.appTypesLoaded(defaultSourcesState, payload)).toEqual({
      ...defaultSourcesState,
      appTypes: APP_TYPES,
      appTypesLoaded: true,
    });
  });

  it('sortEntities sets sortBy and sortDirection', () => {
    const column = 'name';
    const direction = 'asc';
    const payload = { payload: { column, direction } };

    expect(sourcesReducer.sortEntities(defaultSourcesState, payload)).toEqual({
      ...defaultSourcesState,
      sortBy: column,
      sortDirection: direction,
    });
  });

  it('setPageAndSize sets pageSize and pageNumber', () => {
    const size = 100;
    const page = 6;
    const payload = { payload: { page, size } };

    expect(sourcesReducer.setPageAndSize(defaultSourcesState, payload)).toEqual({
      ...defaultSourcesState,
      pageSize: size,
      pageNumber: page,
    });
  });

  describe('source removing', () => {
    const payload = {
      meta: {
        sourceId: SOURCE_ID,
      },
    };

    const defaultState = {
      ...defaultSourcesState,
      entities: [
        { id: '1235', name: 'do not remove this' },
        { id: SOURCE_ID, name: 'delete this' },
      ],
    };

    it('pending marks source for deletion', () => {
      expect(sourcesReducer.sourceEditRemovePending(defaultState, payload)).toEqual({
        ...defaultState,
        removingSources: [SOURCE_ID],
      });
    });

    it('fullfiled deletes the source', () => {
      expect(sourcesReducer.sourceEditRemoveFulfilled({ ...defaultState, removingSources: [SOURCE_ID] }, payload)).toEqual({
        ...defaultState,
        entities: [{ id: '1235', name: 'do not remove this' }],
        removingSources: [],
      });
    });

    it('rejected unmarks the deleted source', () => {
      const defaultState = {
        ...defaultSourcesState,
        entities: [
          { id: '1235', name: 'do not remove this' },
          { id: SOURCE_ID, name: 'delete this', isDeleting: true },
        ],
      };

      expect(sourcesReducer.sourceEditRemoveRejected({ ...defaultState, removingSources: [SOURCE_ID] }, payload)).toEqual({
        ...defaultState,
        removingSources: [],
      });
    });
  });

  describe('appRemoving', () => {
    const payload = {
      meta: {
        sourceId: SOURCE_ID,
        appId: APP_ID,
      },
    };

    const defaultState = {
      ...defaultSourcesState,
      entities: [
        { id: '1235', name: 'no apps' },
        {
          id: SOURCE_ID,
          name: 'delete app here',
          applications: [{ id: APP_ID }, { id: '5468751684715684651165465465465' }],
        },
      ],
    };

    it('pending marks deleted app', () => {
      expect(sourcesReducer.appRemovingPending(defaultState, payload)).toEqual({
        ...defaultSourcesState,
        entities: [
          { id: '1235', name: 'no apps' },
          {
            id: SOURCE_ID,
            name: 'delete app here',
            applications: [{ id: APP_ID, isDeleting: true }, { id: '5468751684715684651165465465465' }],
          },
        ],
      });
    });

    it('fullfiled removes deleted app', () => {
      expect(sourcesReducer.appRemovingFulfilled(defaultState, payload)).toEqual({
        ...defaultSourcesState,
        entities: [
          { id: '1235', name: 'no apps' },
          {
            id: SOURCE_ID,
            name: 'delete app here',
            applications: [{ id: '5468751684715684651165465465465' }],
          },
        ],
      });
    });

    it('rejected unmarks deleted app', () => {
      const defaultState = {
        ...defaultSourcesState,
        entities: [
          { id: '1235', name: 'no apps' },
          {
            id: SOURCE_ID,
            name: 'delete app here',
            applications: [{ id: APP_ID, isDeleting: true }, { id: '5468751684715684651165465465465' }],
          },
        ],
      };

      expect(sourcesReducer.appRemovingRejected(defaultState, payload)).toEqual({
        ...defaultSourcesState,
        entities: [
          { id: '1235', name: 'no apps' },
          {
            id: SOURCE_ID,
            name: 'delete app here',
            applications: [{ id: APP_ID, isDeleting: undefined }, { id: '5468751684715684651165465465465' }],
          },
        ],
      });
    });
  });

  it('addAppToSource adds app to source', () => {
    const defaultState = {
      ...defaultSourcesState,
      entities: [
        { id: '1235', name: 'no apps' },
        {
          id: SOURCE_ID,
          name: 'delete app here',
          applications: [{ id: APP_ID }, { id: '5468751684715684651165465465465' }],
        },
      ],
    };

    const payload = { payload: { sourceId: SOURCE_ID, app: { id: '785412' } } };

    expect(sourcesReducer.addAppToSource(defaultState, payload)).toEqual({
      ...defaultSourcesState,
      entities: [
        { id: '1235', name: 'no apps' },
        {
          id: SOURCE_ID,
          name: 'delete app here',
          applications: [{ id: APP_ID }, { id: '5468751684715684651165465465465' }, { id: '785412' }],
        },
      ],
    });
  });

  it('setCount sets count', () => {
    const COUNT = 2165;
    const payload = { payload: { count: COUNT } };

    expect(sourcesReducer.setCount(defaultSourcesState, payload)).toEqual({
      ...defaultSourcesState,
      numberOfEntities: COUNT,
    });
  });

  it('sourceRenamePending renames source', () => {
    const payload = { payload: { id: SOURCE_ID, name: 'new-name' } };

    const defaultState = {
      ...defaultSourcesState,
      entities: [
        { id: '1235', name: 'no apps' },
        { id: SOURCE_ID, name: 'rename me' },
      ],
    };

    expect(sourcesReducer.sourceRenamePending(defaultState, payload)).toEqual({
      ...defaultSourcesState,
      entities: [
        { id: '1235', name: 'no apps' },
        { id: SOURCE_ID, name: 'new-name' },
      ],
    });
  });
});
