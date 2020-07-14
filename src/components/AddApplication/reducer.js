export const initialState = {
    state: 'loading',
    error: '',
    values: {},
    authenticationsValues: [],
    sourceAppsLength: 0,
    initialValues: {},
    isCancelling: false,
};

const reducer = (state, { type, length, authenticationsValues, initialValues, error, values }) => {
    switch (type) {
        case 'setSourceAppslength':
            return {
                ...state,
                sourceAppsLength: length
            };
        case 'loadAuthentications':
            return {
                ...state,
                authenticationsValues,
                initialValues,
                values: {},
                state: state.state === 'loading' ? 'wizard' : state.state
            };
        case 'loadWithoutAuthentications':
            return {
                ...state,
                initialValues,
                values: {},
                state: state.state === 'loading' ? 'wizard' : state.state
            };
        case 'reset':
            return {
                ...state,
                state: 'wizard'
            };
        case 'submit':
            return {
                ...state,
                state: 'submitting',
            };
        case 'finish':
            return {
                ...state,
                state: 'finished',
            };
        case 'error':
            return {
                ...state,
                state: 'errored',
                error,
                values
            };
        case 'toggleCancelling':
            return {
                ...state,
                isCancelling: !state.isCancelling,
                ...(values && { values })
            };
        default:
            return state;
    }
};

export default reducer;
