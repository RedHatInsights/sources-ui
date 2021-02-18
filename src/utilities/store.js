import ReducerRegistry, {
  applyReducerHash,
} from '@redhat-cloud-services/frontend-components-utilities/files/esm/ReducerRegistry';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/esm/notificationsMiddleware';
import notifications from '@redhat-cloud-services/frontend-components-notifications/esm/notifications';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import SourcesReducer, { defaultSourcesState } from '../redux/sources/reducer';
import UserReducer, { defaultUserState } from '../redux/user/reducer';
import { updateQuery } from './urlQuery';
import { ACTION_TYPES } from '../redux/sources/actionTypes';

export const urlQueryMiddleware = (store) => (next) => (action) => {
  if (action.type === ACTION_TYPES.LOAD_ENTITIES_PENDING) {
    const sources = store.getState().sources;
    updateQuery({ ...sources, ...action.options });
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

  const registry = new ReducerRegistry({}, middlewares);

  registry.register({
    sources: applyReducerHash(SourcesReducer, { ...defaultSourcesState, ...initialState.sources }),
  });
  registry.register({ user: applyReducerHash(UserReducer, { ...defaultUserState, ...initialState.user }) });
  registry.register({ notifications });

  return registry.getStore();
};

export const getProdStore = () => getStore();
