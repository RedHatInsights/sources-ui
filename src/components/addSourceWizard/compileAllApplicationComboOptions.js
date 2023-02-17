import React from 'react';

import { NO_APPLICATION_VALUE } from './stringConstants';

import SubWatchDescription from './descriptions/SubWatchDescription';
import { CLOUD_METER_APP_NAME, COST_MANAGEMENT_APP_NAME, PROVISIONING_APP_NAME, REDHAT_VENDOR } from '../../utilities/constants';
import { labelMapper } from '../../utilities/labels';

export const descriptionMapper = (type, intl) =>
  ({
    [COST_MANAGEMENT_APP_NAME]: intl.formatMessage({
      id: 'cost.app.description',
      defaultMessage: 'Analyze, forecast, and optimize your Red Hat OpenShift cluster costs in hybrid cloud environments.',
    }),
    [CLOUD_METER_APP_NAME]: <SubWatchDescription id={type.id} />,
    [PROVISIONING_APP_NAME]: intl.formatMessage({
      id: 'provisioning.sources.description',
      defaultMessage: 'Build and launch images with custom content as Virtual Machines in hybrid cloud environments.',
    }),
  }[type.name]);

export const compileAllApplicationComboOptions = (applicationTypes, intl, activeCategory) => [
  ...applicationTypes
    .sort((a, b) => a.display_name.localeCompare(b.display_name))
    .map((t) => ({
      value: t.id,
      label: labelMapper(t, intl),
      description: descriptionMapper(t, intl),
    })),
  ...(activeCategory !== REDHAT_VENDOR
    ? [
        {
          label: intl.formatMessage({
            id: 'wizard.noApplication',
            defaultMessage: 'No application',
          }),
          value: NO_APPLICATION_VALUE,
        },
      ]
    : []),
];
