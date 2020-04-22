export const initialState = {
    state: 'loading',
    error: '',
    values: {},
    authenticationsValues: [],
    sourceAppsLength: 0,
    initialValues: {},
    progressStep: 0,
    progressTexts: []
};

const reducer = (state, { type, length, authenticationsValues, initialValues, error, values, progressTexts }) => {
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
                progressStep: 0,
                progressTexts: ['Preparing']
            };
        case 'finish':
            return {
                ...state,
                state: 'finished',
                progressStep: ++state.progressStep
            };
        case 'error':
            return {
                ...state,
                state: 'errored',
                error,
                values
            };
        case 'setProgressTexts':
            return {
                ...state,
                progressTexts
            };
        case 'increaseProgressStep':
            return {
                ...state,
                progressStep: ++state.progressStep
            };
        default:
            return state;
    }
};

export default reducer;
