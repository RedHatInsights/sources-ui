import { ACTION_TYPES } from './actionTypes';

export const loadWritePermissions = () => (dispatch) => {
  dispatch({ type: ACTION_TYPES.SET_WRITE_PERMISSIONS_PENDING });

  return insights.chrome
    .getUserPermissions('sources', true) // bypassCache = true
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
