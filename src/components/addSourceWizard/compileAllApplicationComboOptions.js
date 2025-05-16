import React from 'react';
import { Label } from '@patternfly/react-core';
import SubWatchDescription from './descriptions/SubWatchDescription';
import HybridCommittedSpendDescription from './descriptions/HybridCommittedSpendDescription';
import { CLOUD_METER_APP_NAME, COST_MANAGEMENT_APP_NAME, HCS_APP_NAME, PROVISIONING_APP_NAME } from '../../utilities/constants';

export const descriptionMapper = (type, intl, hcsEnrolled) =>
  ({
    [COST_MANAGEMENT_APP_NAME]: hcsEnrolled ? (
      <HybridCommittedSpendDescription id={type.id} />
    ) : (
      intl.formatMessage({
        id: 'cost.app.description',
        defaultMessage: 'Analyze, forecast, and optimize your Red Hat OpenShift cluster costs in hybrid cloud environments.',
      })
    ),
    [CLOUD_METER_APP_NAME]: <SubWatchDescription id={type.id} />,
    [PROVISIONING_APP_NAME]: intl.formatMessage({
      id: 'provisioning.sources.description',
      defaultMessage: 'Build and launch images with custom content as Virtual Machines in hybrid cloud environments.',
    }),
  })[type.name];

export const labelMapper = (type, intl, hcsEnrolled) =>
  ({
    [CLOUD_METER_APP_NAME]: (
      <span className="src-c-wizard__rhel-mag-label">
        RHEL management{' '}
        <Label className="pf-v6-u-ml-sm" color="purple">
          {intl.formatMessage({ id: 'sub.bundle', defaultMessage: 'Bundle' })}
        </Label>
      </span>
    ),
    [PROVISIONING_APP_NAME]: intl.formatMessage({
      id: 'provisioning.sources.label',
      defaultMessage: 'Launch images',
    }),
    [COST_MANAGEMENT_APP_NAME]: hcsEnrolled ? (
      <span className="src-c-wizard__rhel-mag-label">
        {`${HCS_APP_NAME} `}
        <Label className="pf-v6-u-ml-sm" color="purple">
          {intl.formatMessage({ id: 'sub.bundle', defaultMessage: 'Bundle' })}
        </Label>
      </span>
    ) : (
      type.display_name
    ),
  })[type.name];

export const compileAllApplicationComboOptions = (applicationTypes, intl, hcsEnrolled) => [
  ...applicationTypes
    .sort((a, b) => a.display_name.localeCompare(b.display_name))
    .map((t) => ({
      value: t.id,
      label: labelMapper(t, intl, hcsEnrolled) || t.display_name,
      description: descriptionMapper(t, intl, hcsEnrolled),
    })),
];
