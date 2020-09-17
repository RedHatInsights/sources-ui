import { parseSourceToSchema } from './parser/parseSourceToSchema';
import { prepareInitialValues } from './helpers';

export const initialState = {
    loading: true,
    source: undefined,
    initialValues: {},
    sourceType: undefined,
    schema: undefined,
};

const reducer = (state, { type, source, sourceType, appTypes, intl }) => {
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
                source
            };
        default:
            return state;
    }
};

export default reducer;
