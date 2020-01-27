import { ACTION_TYPES } from './actions-types';
import { addMessage } from '../sources/actions';

export const loadOrgAdmin = (title, description) => (dispatch) => {
    dispatch({ type: ACTION_TYPES.SET_ORG_ADMIN_PENDING });

    return insights.chrome.auth.getUser().then((user) => {
        const isOrgAdmin = user.identity.user.is_org_admin;

        dispatch({
            type: ACTION_TYPES.SET_ORG_ADMIN_FULFILLED,
            payload: isOrgAdmin
        });

        if (!isOrgAdmin) {
            dispatch(addMessage(
                title,
                'info',
                description
            ));
        }
    }
    ).catch(error => dispatch({
        type: ACTION_TYPES.SET_ORG_ADMIN_REJECTED,
        payload: { error: { detail: error.detail || error.data, title: 'Cannot get user\'s credentials' } }
    }));
};
