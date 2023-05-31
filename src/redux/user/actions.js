import { ACTION_TYPES } from './actionTypes';

export const loadWritePermissions = (getUserPermissions) => (dispatch) => {
  dispatch({ type: ACTION_TYPES.SET_WRITE_PERMISSIONS_PENDING });

  return getUserPermissions('sources', true) // bypassCache = true
    .then((permissions) => {
      const allPermission = permissions.reduce((acc, curr) => [...acc, curr?.permission], []);
      const writePermissions = allPermission.includes('sources:*:*') || allPermission.includes('sources:*:write');

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

export const loadOrgAdmin = (getUser) => (dispatch) => {
  dispatch({ type: ACTION_TYPES.SET_ORG_ADMIN_PENDING });

  return getUser()
    .then(
      ({
        identity: {
          user: { is_org_admin },
        },
      }) => {
        dispatch({
          type: ACTION_TYPES.SET_ORG_ADMIN_FULFILLED,
          payload: is_org_admin,
        });
      }
    )
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
