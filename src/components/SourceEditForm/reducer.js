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
  submitMessages: undefined,
};

const reducer = (state, { type, source, sourceType, appTypes, intl, values, editing, messages, hcsEnrolled }) => {
  switch (type) {
    case 'createForm':
      return {
        ...state,
        sourceType,
        initialValues: prepareInitialValues(state.source, sourceType.product_name),
        schema: parseSourceToSchema(state.source, sourceType, appTypes, intl, hcsEnrolled),
        loading: false,
      };
    case 'setSource':
      return {
        ...state,
        messages: {
          ...messages,
          ...state.submitMessages,
        },
        source,
        initialLoad: false,
        submitMessages: undefined,
      };
    case 'submit':
      return {
        ...state,
        isSubmitting: true,
        submitError: false,
        values,
        editing,
      };
    case 'submitFinished':
      return {
        ...state,
        isSubmitting: false,
        source,
        submitMessages: messages,
      };
    case 'submitFailed':
      return {
        ...state,
        isSubmitting: false,
        submitError: true,
        messages: undefined,
      };
    case 'sourceChanged':
      return {
        ...state,
        initialLoad: true,
        loading: true,
      };
    default:
      return state;
  }
};

export default reducer;
