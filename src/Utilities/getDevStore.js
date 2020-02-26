import { logger } from 'redux-logger';
import { getStore } from './store';

export const getDevStore = () => getStore([logger]);
