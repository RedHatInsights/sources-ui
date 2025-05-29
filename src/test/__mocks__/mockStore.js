import promise from 'redux-promise-middleware';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import createNotificationsMiddleware from '../../redux/notifications/notificationsMiddleware';

const middlewares = [thunk, promise, createNotificationsMiddleware()];

const mockStore = (state) => configureStore(middlewares)(state);

export default mockStore;
