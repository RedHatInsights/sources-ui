import { ACTION_TYPES } from './actionTypes';

export const loadOrgAdmin = () => (dispatch) => {
  dispatch({ type: ACTION_TYPES.SET_ORG_ADMIN_PENDING });

  return insights.chrome.auth
    .getUser()
    .then((user) => {
      const isOrgAdmin = user.identity.user.is_org_admin;

      dispatch({
        type: ACTION_TYPES.SET_ORG_ADMIN_FULFILLED,
        payload: isOrgAdmin,
      });
    })
    .catch((error) =>
      dispatch({
        type: ACTION_TYPES.SET_ORG_ADMIN_REJECTED,
        payload: {
          error: {
            detail: error.detail || error.data,
            title: "Cannot get user's credentials",
          },
        },
      })
    );
};

export const loadWritePermissions = () => (dispatch) => {
  dispatch({ type: ACTION_TYPES.SET_WRITE_PERMISSIONS_PENDING });

  return insights.chrome
    .getUserPermissions('sources')
    .then((permissions) => {
      const writePermissions = permissions.includes('sources:*:*') || permissions.includes('sources:*:write');

      dispatch({
        type: ACTION_TYPES.SET_WRITE_PERMISSIONS_FULFILLED,
        payload: writePermissions,
      });
    })
    .catch((error) =>
      dispatch({
        type: ACTION_TYPES.SET_WRITE_PERMISSIONS_REJECTED,
        payload: {
          error: {
            detail: error.detail || error.data,
            title: "Cannot get user's credentials",
          },
        },
      })
    );
};
