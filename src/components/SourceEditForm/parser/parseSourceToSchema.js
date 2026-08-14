import { applicationsFields } from './application';

export const parseSourceToSchema = (source, sourceType, appTypes, intl, hcsEnrolled) => ({
  description: intl.formatMessage({
    id: 'sources.editFormDescripiton',
    defaultMessage: 'Use the form fields to edit application credentials.',
  }),
  fields: applicationsFields(source.applications, sourceType, appTypes, hcsEnrolled, source?.source?.source_ref),
});
