/* eslint-disable no-console */
import { logger } from 'redux-logger';

import { SET_COUNT } from '../redux/sources/actionTypes';
import { ACTION_TYPES } from '../redux/user/actionTypes';
import { getStore } from './store';

export const getDevStore = () => {
  const store = getStore([logger]);

  const removePermissions = () => {
    store.dispatch({ type: ACTION_TYPES.SET_WRITE_PERMISSIONS_FULFILLED, payload: false });
    store.dispatch({ type: ACTION_TYPES.SET_WRITE_PERMISSIONS_FULFILLED, payload: false });
  };

  const setPermissions = () => {
    store.dispatch({ type: ACTION_TYPES.SET_WRITE_PERMISSIONS_FULFILLED, payload: true });
  };

  const setCount = (count) =>
    store.dispatch({
      type: SET_COUNT,
      payload: { count },
    });

  window.sourcesDebug = {};
  window.sourcesDebug.showEmptyState = () => setCount(0);
  window.sourcesDebug.removePermissions = removePermissions;
  window.sourcesDebug.setCount = setCount;
  window.sourcesDebug.setPermissions = setPermissions;

  console.log('%cYou are using DEV version of Sources.', 'color: red; background: yellow');
  console.log('%cYou can call several functions from console:', 'color: red; background: yellow');
  console.log('%c  - sourcesDebug.showEmptyState', 'color: red; background: yellow');
  console.log('%c  - sourcesDebug.changeCount', 'color: red; background: yellow');
  console.log('%c  - sourcesDebug.removePermissions', 'color: red; background: yellow');
  console.log('%c  - sourcesDebug.setPermissions', 'color: red; background: yellow');

  return store;
};
