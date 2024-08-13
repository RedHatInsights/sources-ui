import ReducerRegistry, { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import SourcesReducer, { defaultSourcesState } from '../redux/sources/reducer';
import UserReducer, { defaultUserState } from '../redux/user/reducer';
import { parseQuery, updateQuery } from './urlQuery';
import { ACTION_TYPES, SET_CATEGORY } from '../redux/sources/actionTypes';
import { CLOUD_VENDOR, COMMUNICATIONS, INTEGRATIONS, OVERVIEW, REDHAT_VENDOR, REPORTING, WEBHOOKS } from './constants';

export const urlQueryMiddleware = (store) => (next) => (action) => {
  if (action.type === ACTION_TYPES.LOAD_ENTITIES_PENDING) {
    const sources = store.getState().sources;
    updateQuery({ ...sources, ...action.options });
  } else if (action.type === SET_CATEGORY && action.payload?.category === INTEGRATIONS) {
    updateQuery({ removeQuery: true, activeCategory: action.payload?.category });
  }

  next(action);
};

export const getStore = (addMiddlewares = [], initialState = {}) => {
  const middlewares = [
    thunk,
    notificationsMiddleware({
      errorTitleKey: 'error.title',
      errorDescriptionKey: 'error.detail',
    }),
    promise,
    urlQueryMiddleware,
    ...addMiddlewares,
  ];
  const params = parseQuery();

  const registry = new ReducerRegistry({}, middlewares);
  registry.register({
    sources: applyReducerHash(SourcesReducer, {
      ...defaultSourcesState,
      ...initialState.sources,
      activeCategory: [CLOUD_VENDOR, REDHAT_VENDOR, COMMUNICATIONS, REPORTING, WEBHOOKS, OVERVIEW].includes(
        params?.activeCategory,
      )
        ? params.activeCategory
        : initialState.sources?.activeCategory || defaultSourcesState?.activeCategory,
    }),
  });
  registry.register({ user: applyReducerHash(UserReducer, { ...defaultUserState, ...initialState.user }) });
  registry.register({ notifications: notificationsReducer });

  return registry.getStore();
};

export const getProdStore = () => getStore();
