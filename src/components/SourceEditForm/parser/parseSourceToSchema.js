import { endpointFields } from './endpoint';
import { applicationsFields } from './application';
import EditAlert from './EditAlert';

export const parseSourceToSchema = (source, sourceType, appTypes, intl) => ({
  description: intl.formatMessage({
    id: 'sources.editFormDescripiton',
    defaultMessage: 'Use the form fields to edit application credentials.',
  }),
  fields: [
    {
      name: 'message',
      component: 'description',
      Content: EditAlert,
      condition: {
        when: 'message',
        isNotEmpty: true,
      },
    },
    ...applicationsFields(source.applications, sourceType, appTypes),
    source.endpoints && source.endpoints.length > 0 ? endpointFields(sourceType) : false,
  ].filter(Boolean),
});
