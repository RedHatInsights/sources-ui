import promise from 'redux-promise-middleware';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';

const middlewares = [thunk, promise, notificationsMiddleware()];

const mockStore = (state) => configureStore(middlewares)(state);

export default mockStore;
