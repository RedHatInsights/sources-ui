import { applicationsFields } from './application';

export const parseSourceToSchema = (source, sourceType, appTypes, intl) => ({
  description: intl.formatMessage({
    id: 'sources.editFormDescripiton',
    defaultMessage: 'Use the form fields to edit application credentials.',
  }),
  fields: applicationsFields(source.applications, sourceType, appTypes, intl),
});
