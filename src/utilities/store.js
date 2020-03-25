import ReducerRegistry, { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import { notifications, notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import SourcesReducer, { defaultSourcesState } from '../redux/sources/reducer';
import UserReducer, { defaultUserState } from '../redux/user/reducer';
import { updateQuery } from './urlQuery';
import { ACTION_TYPES } from '../redux/sources/actionTypes';

export const urlQueryMiddleware = store => next => action => {
    if (action.type === ACTION_TYPES.LOAD_ENTITIES_PENDING) {
        const sources = store.getState().sources;

        updateQuery({ ...sources, ...action.options });
    }

    next(action);
};

export const getStore = (addMiddlewares = []) => {
    const middlewares = [
        thunk,
        notificationsMiddleware({ errorTitleKey: 'error.title', errorDescriptionKey: 'error.detail' }),
        promise,
        urlQueryMiddleware,
        ...addMiddlewares
    ];

    const registry = new ReducerRegistry({}, middlewares);

    registry.register({ sources: applyReducerHash(SourcesReducer, defaultSourcesState) });
    registry.register({ user: applyReducerHash(UserReducer, defaultUserState) });
    registry.register({ notifications });

    return registry.getStore();
};

export const getProdStore = () => getStore();
