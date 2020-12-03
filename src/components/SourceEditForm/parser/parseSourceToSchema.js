import { endpointFields } from './endpoint';
import { applicationsFields } from './application';

export const parseSourceToSchema = (source, sourceType, appTypes, intl) => ({
  description: intl.formatMessage({
    id: 'sources.editFormDescripiton',
    defaultMessage: 'Use the form fields to edit application credentials.',
  }),
  fields: [
    ...applicationsFields(source.applications, sourceType, appTypes),
    source.endpoints && source.endpoints.length > 0 ? endpointFields(sourceType) : false,
  ].filter(Boolean),
});
