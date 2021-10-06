import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';

import { authenticationFields } from './authentication';
import { endpointFields } from './endpoint';
import EditAlert from './EditAlert';
import ResourcesEmptyState from '../../SourceDetail/ResourcesEmptyState';

export const APP_NAMES = {
  COST_MANAGAMENT: '/insights/platform/cost-management',
  CLOUD_METER: '/insights/platform/cloud-meter',
};

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
    appType,
    app
  ),
];

export const applicationsFields = (applications, sourceType, appTypes) => [
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
          fields = [fields[0], [...(fields[1] || []), endpointFields(sourceType)]];
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
            applicationName: appType?.display_name,
            Icon: PlusCircleIcon,
          });
        } else if (app.paused_at) {
          fields = [fields[0], fields[1].map((field) => ({ ...field, isDisabled: true }))];
        }

        return {
          name: appType?.id,
          title: appType?.display_name,
          fields,
        };
      }),
    ],
  },
];
