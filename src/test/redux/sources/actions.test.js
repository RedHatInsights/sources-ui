import React from 'react';

import PauseIcon from '@patternfly/react-icons/dist/esm/icons/pause-icon';
import PlayIcon from '@patternfly/react-icons/dist/esm/icons/play-icon';

import {
  addHiddenSource,
  clearFilters,
  filterSources,
  loadEntities,
  loadSourceTypes,
  pageAndSize,
  pauseSource,
  removeApplication,
  removeMessage,
  removeSource,
  renameSource,
  resumeSource,
  setActiveCategory,
  sortEntities,
} from '../../../redux/sources/actions';
import {
  ACTION_TYPES,
  ADD_HIDDEN_SOURCE,
  CLEAR_FILTERS,
  FILTER_SOURCES,
  PAGE_AND_SIZE,
  SET_CATEGORY,
  SORT_ENTITIES,
} from '../../../redux/sources/actionTypes';
import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from '@redhat-cloud-services/frontend-components-notifications';
import * as api from '../../../api/entities';
import * as types_api from '../../../api/source_types';
import { CLOUD_VENDOR } from '../../../utilities/constants';

describe('redux actions', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn().mockImplementation((x) => x);
  });

  it('add hidden source', () => {
    const SOURCE = { name: 'Stuart' };
    expect(addHiddenSource(SOURCE)).toEqual(
      expect.objectContaining({
        type: ADD_HIDDEN_SOURCE,
        payload: {
          source: SOURCE,
        },
      }),
    );
  });

  it('removeMessage creates an object', () => {
    const ID = '123456';

    expect(removeMessage(ID)).toEqual({
      type: REMOVE_NOTIFICATION,
      payload: ID,
    });
  });

  it('filterSources creates an object', async () => {
    const filterValue = { name: 'name' };

    await filterSources(filterValue)(dispatch);

    expect(dispatch.mock.calls).toHaveLength(2);
    expect(dispatch.mock.calls[0][0]).toEqual({
      type: FILTER_SOURCES,
      payload: {
        value: filterValue,
      },
    });
    expect(dispatch.mock.calls[1][0]).toEqual(expect.any(Function));
  });

  describe('page and size', () => {
    it('call dispatch with changing size and loading values', async () => {
      const PAGE = 10;
      const SIZE = 15;

      await pageAndSize(PAGE, SIZE)(dispatch);

      expect(dispatch.mock.calls).toHaveLength(2);
      expect(dispatch.mock.calls[0][0]).toEqual({
        type: PAGE_AND_SIZE,
        payload: { page: PAGE, size: SIZE },
      });
      expect(dispatch.mock.calls[1][0]).toEqual(expect.any(Function));
    });
  });

  describe('sort entities', () => {
    it('call dispatch with changing column and direction', async () => {
      const COLUMN = 'type_id';
      const DIRECTION = 'desc';

      await sortEntities(COLUMN, DIRECTION)(dispatch);

      expect(dispatch.mock.calls).toHaveLength(2);
      expect(dispatch.mock.calls[0][0]).toEqual({
        type: SORT_ENTITIES,
        payload: { column: COLUMN, direction: DIRECTION },
      });
      expect(dispatch.mock.calls[1][0]).toEqual(expect.any(Function));
    });
  });

  describe('loadEntities', () => {
    const count = 15124;
    const sources = [{ aa: 'bb' }, { vv: 'ee' }];

    const [pageSize, pageNumber, sortBy, sortDirection, filterValue] = [15, 10, 'name', 'desc', 'pepa'];

    const getState = () => ({
      sources: {
        pageSize,
        pageNumber,
        sortBy,
        sortDirection,
        filterValue,
      },
    });

    const meta = { count };

    beforeEach(() => {
      api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources, meta }));
    });

    it('loads entities', async () => {
      await loadEntities()(dispatch, getState);

      expect(dispatch.mock.calls).toHaveLength(2);

      expect(dispatch.mock.calls[0][0]).toEqual({
        type: ACTION_TYPES.LOAD_ENTITIES_PENDING,
        options: undefined,
      });
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: ACTION_TYPES.LOAD_ENTITIES_FULFILLED,
        payload: { sources, meta },
      });
    });

    it('passes options to pending', async () => {
      const options = { custom: 'custom' };

      await loadEntities(options)(dispatch, getState);

      expect(dispatch.mock.calls).toHaveLength(2);

      expect(dispatch.mock.calls[0][0]).toEqual({
        type: ACTION_TYPES.LOAD_ENTITIES_PENDING,
        options,
      });
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: ACTION_TYPES.LOAD_ENTITIES_FULFILLED,
        payload: { sources, meta },
      });
    });

    it('handles failure', async () => {
      const ERROR_DETAIL = 'aaa';
      const ERROR = { detail: ERROR_DETAIL };

      api.doLoadEntities = jest.fn().mockImplementation(() => Promise.reject(ERROR));

      await loadEntities()(dispatch, getState);

      expect(dispatch.mock.calls).toHaveLength(2);

      expect(dispatch.mock.calls[0][0]).toEqual({
        type: ACTION_TYPES.LOAD_ENTITIES_PENDING,
        options: undefined,
      });
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: ACTION_TYPES.LOAD_ENTITIES_REJECTED,
        meta: { noError: true },
        payload: { error: { detail: ERROR_DETAIL, title: expect.any(String) } },
      });
    });

    it('handles failure with custom title', async () => {
      const ERROR_DETAIL = 'aaa';
      const ERROR_TITLE = 'some title';
      const ERROR = { detail: ERROR_DETAIL, title: ERROR_TITLE };

      api.doLoadEntities = jest.fn().mockImplementation(() => Promise.reject(ERROR));

      await loadEntities()(dispatch, getState);

      expect(dispatch.mock.calls).toHaveLength(2);

      expect(dispatch.mock.calls[0][0]).toEqual({
        type: ACTION_TYPES.LOAD_ENTITIES_PENDING,
        options: undefined,
      });
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: ACTION_TYPES.LOAD_ENTITIES_REJECTED,
        meta: { noError: true },
        payload: { error: { detail: ERROR_DETAIL, title: ERROR_TITLE } },
      });
    });
  });

  describe('doRemoveSource', () => {
    const sourceId = '12132145';
    const title = 'Some title here';

    it('loads entities', async () => {
      api.doRemoveSource = jest.fn().mockImplementation(() => Promise.resolve('OK'));

      await removeSource(sourceId, title)(dispatch);

      expect(dispatch.mock.calls).toHaveLength(4);

      expect(dispatch.mock.calls[0][0]).toEqual({
        type: ACTION_TYPES.REMOVE_SOURCE_PENDING,
        meta: {
          sourceId,
        },
      });

      expect(dispatch.mock.calls[1][0]).toEqual(expect.any(Function));

      expect(dispatch.mock.calls[2][0]).toEqual({
        type: ACTION_TYPES.REMOVE_SOURCE_FULFILLED,
        meta: {
          sourceId,
        },
      });

      expect(dispatch.mock.calls[3][0]).toEqual(expect.any(Function));
    });

    it('handle failure', async () => {
      api.doRemoveSource = jest.fn().mockImplementation(() => Promise.reject('OK'));

      await removeSource(sourceId, title)(dispatch);

      expect(dispatch.mock.calls).toHaveLength(2);

      expect(dispatch.mock.calls[0][0]).toEqual({
        type: ACTION_TYPES.REMOVE_SOURCE_PENDING,
        meta: {
          sourceId,
        },
      });

      expect(dispatch.mock.calls[1][0]).toEqual({
        type: ACTION_TYPES.REMOVE_SOURCE_REJECTED,
        meta: {
          sourceId,
        },
      });
    });
  });

  it('clearFilters creates an object', async () => {
    await clearFilters()(dispatch);

    expect(dispatch.mock.calls).toHaveLength(2);
    expect(dispatch.mock.calls[0][0]).toEqual({ type: CLEAR_FILTERS });
    expect(dispatch.mock.calls[1][0]).toEqual(expect.any(Function));
  });

  it('removeApplication calls doDeleteApplication (redux-promise)', async () => {
    const appId = '123';
    const sourceId = '54655';
    const successTitle = 'success title';
    const errorTitle = 'errorTitle';

    api.doDeleteApplication = jest.fn().mockImplementation(() => Promise.resolve('OK'));

    const result = await removeApplication(appId, sourceId, successTitle, errorTitle);

    expect(result).toEqual({
      type: ACTION_TYPES.REMOVE_APPLICATION,
      payload: expect.any(Function),
      meta: {
        appId,
        sourceId,
        notifications: {
          fulfilled: {
            variant: 'success',
            title: successTitle,
            dismissable: true,
          },
        },
      },
    });

    expect(api.doDeleteApplication).not.toHaveBeenCalled();

    await result.payload();

    expect(api.doDeleteApplication).toHaveBeenCalledWith(appId, errorTitle);
  });

  it('loadSourceTypes catches error', async () => {
    const error = 'some-error';
    types_api.doLoadSourceTypes = jest.fn().mockImplementation(() => Promise.reject(error));

    await loadSourceTypes()(dispatch);

    expect(dispatch.mock.calls).toHaveLength(2);

    expect(dispatch.mock.calls[0][0]).toEqual({
      type: ACTION_TYPES.LOAD_SOURCE_TYPES_PENDING,
    });

    expect(dispatch.mock.calls[1][0]).toEqual({
      type: ACTION_TYPES.LOAD_SOURCE_TYPES_REJECTED,
      payload: { error },
      meta: { noError: true },
    });
  });

  describe('renameSource', () => {
    let updateSource;
    const sourceId = 'some-id';
    const sourceName = 'some-name';
    const errorTitle = 'renaming failed';

    const getState = () => ({
      sources: {
        entities: [
          {
            id: 'different-id',
            name: 'different-name',
          },
          {
            id: sourceId,
            name: 'old-name',
          },
        ],
      },
    });

    it('passes', async () => {
      updateSource = jest.fn().mockImplementation(() => Promise.resolve('OK'));
      api.getSourcesApi = () => ({
        updateSource,
      });

      await renameSource(sourceId, sourceName, errorTitle)(dispatch, getState);

      expect(dispatch.mock.calls).toHaveLength(1);

      expect(dispatch.mock.calls[0][0]).toEqual({
        type: ACTION_TYPES.RENAME_SOURCE_PENDING,
        payload: { id: sourceId, name: sourceName },
      });
    });

    it('fails', async () => {
      updateSource = jest.fn().mockImplementation(() => Promise.reject({ errors: [{ detail: 'some-error' }] }));
      api.getSourcesApi = () => ({
        updateSource,
      });

      await renameSource(sourceId, sourceName, errorTitle)(dispatch, getState);

      expect(dispatch.mock.calls).toHaveLength(2);

      expect(dispatch.mock.calls[0][0]).toEqual({
        type: ACTION_TYPES.RENAME_SOURCE_PENDING,
        payload: { id: sourceId, name: sourceName },
      });
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: ACTION_TYPES.RENAME_SOURCE_REJECTED,
        payload: { id: sourceId, name: 'old-name', error: { detail: 'some-error', title: errorTitle } },
      });
    });
  });

  it('setActiveCategory creates an object', async () => {
    await setActiveCategory(CLOUD_VENDOR)(dispatch);

    expect(dispatch.mock.calls).toHaveLength(2);
    expect(dispatch.mock.calls[0][0]).toEqual({ type: SET_CATEGORY, payload: { category: CLOUD_VENDOR } });
    expect(dispatch.mock.calls[1][0]).toEqual(expect.any(Function));
  });

  describe('pausing and unpausing source', () => {
    const sourceId = '123-source';
    const sourceName = 'source-name';
    const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };

    let innerDispatch;

    beforeEach(() => {
      innerDispatch = jest.fn();
      dispatch = jest.fn().mockImplementation((x) => x(innerDispatch, () => ({ sources: {} })));

      api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [], meta: { count: 0 } }));
    });

    it('pauseSource', async () => {
      const pauseSourceApi = jest.fn().mockImplementation(() => Promise.resolve('ok'));

      api.getSourcesApi = () => ({
        pauseSource: pauseSourceApi,
      });

      await pauseSource(sourceId, sourceName, intl)(dispatch);

      expect(pauseSourceApi).toHaveBeenCalledWith(sourceId);

      const types = innerDispatch.mock.calls.map(([{ type }]) => type);
      expect(types).toEqual([ADD_NOTIFICATION, 'LOAD_ENTITIES_PENDING', 'LOAD_ENTITIES_FULFILLED']);

      expect(innerDispatch.mock.calls[0][0].payload).toEqual({
        customIcon: <PauseIcon />,
        description:
          'Source <b>{ sourceName }</b> is now paused. Data collection for all connected applications will be disabled until the source is resumed.',
        dismissable: true,
        title: 'Source paused',
        variant: 'default',
      });
    });

    it('pauseSource - fail', async () => {
      const pauseSourceApi = jest.fn().mockImplementation(() => Promise.reject('error message'));

      api.getSourcesApi = () => ({
        pauseSource: pauseSourceApi,
      });

      await pauseSource(sourceId, sourceName, intl)(dispatch);

      expect(pauseSourceApi).toHaveBeenCalledWith(sourceId);

      const types = innerDispatch.mock.calls.map(([{ type }]) => type);
      expect(types).toEqual([ADD_NOTIFICATION]);

      expect(innerDispatch.mock.calls[0][0].payload).toEqual({
        description: '{ error }. Please try again.',
        dismissable: true,
        title: 'Source pause failed',
        variant: 'danger',
      });
    });

    it('resumeSource', async () => {
      const unpauseSourceApi = jest.fn().mockImplementation(() => Promise.resolve('ok'));

      api.getSourcesApi = () => ({
        unpauseSource: unpauseSourceApi,
      });

      await resumeSource(sourceId, sourceName, intl)(dispatch);

      expect(unpauseSourceApi).toHaveBeenCalledWith(sourceId);

      const types = innerDispatch.mock.calls.map(([{ type }]) => type);
      expect(types).toEqual([ADD_NOTIFICATION, 'LOAD_ENTITIES_PENDING', 'LOAD_ENTITIES_FULFILLED']);

      expect(innerDispatch.mock.calls[0][0].payload).toEqual({
        customIcon: <PlayIcon />,
        description: 'Source <b>{ sourceName }</b> will recontinue data collection for connected applications.',
        dismissable: true,
        title: 'Source resumed',
        variant: 'default',
      });
    });

    it('resumeSource - fail', async () => {
      const unpauseSourceApi = jest.fn().mockImplementation(() => Promise.reject('Some error'));

      api.getSourcesApi = () => ({
        unpauseSource: unpauseSourceApi,
      });

      await resumeSource(sourceId, sourceName, intl)(dispatch);

      expect(unpauseSourceApi).toHaveBeenCalledWith(sourceId);

      const types = innerDispatch.mock.calls.map(([{ type }]) => type);
      expect(types).toEqual([ADD_NOTIFICATION]);

      expect(innerDispatch.mock.calls[0][0].payload).toEqual({
        description: '{ error }. Please try again.',
        dismissable: true,
        title: 'Source resume failed',
        variant: 'danger',
      });
    });
  });
});
