import { ACTION_TYPES } from './actionTypes';

export const defaultUserState = {
  isOrgAdmin: undefined,
};

export const orgAdminPending = (state) => ({
  ...state,
  isOrgAdmin: undefined,
});

export const orgAdminLoaded = (state, { payload: isOrgAdmin }) => ({
  ...state,
  isOrgAdmin,
});

export const orgAdminRejected = (state) => ({
  ...state,
  isOrgAdmin: undefined,
});

export default {
  [ACTION_TYPES.SET_ORG_ADMIN_PENDING]: orgAdminPending,
  [ACTION_TYPES.SET_ORG_ADMIN_FULFILLED]: orgAdminLoaded,
  [ACTION_TYPES.SET_ORG_ADMIN_REJECTED]: orgAdminRejected,
};
