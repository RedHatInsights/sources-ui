import { ACTION_TYPES } from './actionTypes';

export const loadOrgAdmin = () => (dispatch) => {
    dispatch({ type: ACTION_TYPES.SET_ORG_ADMIN_PENDING });

    return insights.chrome.auth.getUser().then((user) => {
        const isOrgAdmin = user.identity.user.is_org_admin;

        dispatch({
            type: ACTION_TYPES.SET_ORG_ADMIN_FULFILLED,
            payload: isOrgAdmin
        });
    }
    ).catch(error => dispatch({
        type: ACTION_TYPES.SET_ORG_ADMIN_REJECTED,
        payload: { error: { detail: error.detail || error.data, title: 'Cannot get user\'s credentials' } }
    }));
};
