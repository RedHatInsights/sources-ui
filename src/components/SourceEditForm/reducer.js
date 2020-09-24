import { parseSourceToSchema } from './parser/parseSourceToSchema';
import { prepareInitialValues } from './helpers';

export const initialState = {
    loading: true,
    source: undefined,
    initialValues: {},
    sourceType: undefined,
    schema: undefined,
    isSubmitting: false,
    initialLoad: true,
    submitError: false,
    isTimeouted: false
};

const reducer = (state, { type, source, sourceType, appTypes, intl, message, values, editing, removingAuth, authId }) => {
    switch (type) {
        case 'createForm':
            return {
                ...state,
                sourceType,
                initialValues: prepareInitialValues(state.source, sourceType.product_name),
                schema: parseSourceToSchema(state.source, sourceType, appTypes, intl),
                loading: false
            };
        case 'setSource':
            return {
                ...state,
                source,
                initialLoad: false
            };
        case 'submit':
            return {
                ...state,
                isSubmitting: true,
                submitError: false,
                values,
                editing
            };
        case 'submitFinished':
            return {
                ...state,
                isSubmitting: false,
                source,
                message
            };
        case 'submitFailed':
            return {
                ...state,
                isSubmitting: false,
                submitError: true
            };
        case 'submitTimetouted':
            return {
                ...state,
                isSubmitting: false,
                isTimeouted: true
            };
        case 'removeAuthPending':
            return {
                ...state,
                isAuthRemoving: null,
                source: {
                    ...state.source,
                    authentications: state.source.authentications.map((auth) => auth.id === authId ? {
                        ...auth, isDeleting: true
                    } : auth)
                }
            };
        case 'removeAuthRejected':
            return {
                ...state,
                source: {
                    ...state.source,
                    authentications: state.source.authentications.map((auth) => auth.id === authId ? {
                        ...auth, isDeleting: false
                    } : auth)
                }
            };
        case 'removeAuthFulfill':
            return {
                ...state,
                source: {
                    ...state.source,
                    authentications: state.source.authentications.filter((auth) => auth.id !== authId)
                }
            };
        case 'setAuthRemoving':
            return {
                ...state,
                isAuthRemoving: removingAuth
            };
        case 'closeAuthRemoving':
            return {
                ...state,
                isAuthRemoving: null
            };
        default:
            return state;
    }
};

export default reducer;
