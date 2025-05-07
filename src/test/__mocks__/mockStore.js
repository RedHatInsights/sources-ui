import promise from 'redux-promise-middleware';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk, promise];

const mockStore = (state) => configureStore(middlewares)(state);

export default mockStore;
