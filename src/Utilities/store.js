import ReducerRegistry, { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import { notifications, notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import ReducersProviders, { defaultProvidersState } from '../redux/reducers/providers';

export const getStore = (includeLogger) => {
    const middlewares = [
        thunk,
        notificationsMiddleware({ errorTitleKey: 'error.title', errorDescriptionKey: 'error.detail' }),
        promise
    ];

    if (includeLogger) {
        middlewares.push(logger);
    }

    const registry = new ReducerRegistry({}, middlewares);

    registry.register({ providers: applyReducerHash(ReducersProviders, defaultProvidersState) });
    registry.register({ notifications });

    return registry.getStore();
};

export const getDevStore = () => getStore(true);
export const getProdStore = () => getStore(false);
