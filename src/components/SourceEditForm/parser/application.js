import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';

import { authenticationFields } from './authentication';
import { endpointFields } from './endpoint';
import EditAlert from './EditAlert';
import ResourcesEmptyState from '../../SourceDetail/ResourcesEmptyState';
import { labelMapper } from '../../../utilities/labels';

const createOneAppFields = (appType, sourceType, app) => [
  {
    name: `messages.${app.id}`,
    component: 'description',
    Content: EditAlert,
    condition: {
      when: ({ name }) => name,
      isNotEmpty: true,
    },
  },
  ...authenticationFields(
    app.authentications?.filter((auth) => Object.keys(auth).length > 1),
    sourceType,
    appType?.name,
    app.id
  ),
];

export const applicationsFields = (applications, sourceType, appTypes, intl) => [
  {
    component: componentTypes.TABS,
    name: 'app-tabs',
    isBox: true,
    fields: [
      ...applications.map((app) => {
        const appType = appTypes.find(({ id }) => id === app.application_type_id);

        let fields = createOneAppFields(appType, sourceType, app);

        const hasEndpoint = app.authentications.find(({ resource_type }) => resource_type === 'Endpoint');

        if (hasEndpoint) {
          const additionalFields = endpointFields(sourceType);
          fields = [fields[0], [...(fields[1] || []), ...(additionalFields ? [additionalFields] : [])]];
        }

        if (fields.length === 1) {
          fields.push({
            component: 'description',
            name: 'no-credentials',
            Content: ResourcesEmptyState,
            message: {
              id: 'resourceTable.emptyStateDescription',
              defaultMessage: '{applicationName} resources will be added here when created.',
            },
            applicationName: labelMapper(appType, intl),
            Icon: PlusCircleIcon,
          });
        } else if (app.paused_at) {
          fields = [fields[0], fields[1].map((field) => ({ ...field, isDisabled: true }))];
        }

        return {
          name: appType?.id,
          title: labelMapper(appType, intl),
          fields,
        };
      }),
    ],
  },
];
