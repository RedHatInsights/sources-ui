import ReducerRegistry, { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import { notifications, notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import SourcesReducer, { defaultSourcesState } from '../redux/sources/reducer';
import UserReducer, { defaultUserState } from '../redux/user/reducer';
import { updateQuery } from './urlQuery';
import { ACTION_TYPES } from '../redux/sources/actions-types';

export const urlQueryMiddleware = store => next => action => {
    const sources = store.getState().sources;

    if (sources.loaded && action.type === ACTION_TYPES.LOAD_ENTITIES_FULFILLED) {
        updateQuery(sources);
    }

    next(action);
};

export const getStore = (includeLogger) => {
    const middlewares = [
        thunk,
        notificationsMiddleware({ errorTitleKey: 'error.title', errorDescriptionKey: 'error.detail' }),
        promise,
        urlQueryMiddleware
    ];

    if (includeLogger) {
        middlewares.push(logger);
    }

    const registry = new ReducerRegistry({}, middlewares);

    registry.register({ sources: applyReducerHash(SourcesReducer, defaultSourcesState) });
    registry.register({ user: applyReducerHash(UserReducer, defaultUserState) });
    registry.register({ notifications });

    return registry.getStore();
};

export const getDevStore = () => getStore(true);
export const getProdStore = () => getStore(false);
