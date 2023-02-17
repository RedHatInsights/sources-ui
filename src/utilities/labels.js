import React from 'react';
import { Label } from '@patternfly/react-core';

import { CLOUD_METER_APP_NAME, PROVISIONING_APP_NAME } from './constants';

export const labelMapper = (app, intl) =>
  ({
    [CLOUD_METER_APP_NAME]: (
      <span className="src-c-wizard__rhel-mag-label">
        RHEL management{' '}
        <Label className="pf-u-ml-sm" color="purple">
          {intl.formatMessage({ id: 'sub.bundle', defaultMessage: 'Bundle' })}
        </Label>
      </span>
    ),
    [PROVISIONING_APP_NAME]: intl.formatMessage({
      id: 'provisioning.sources.label',
      defaultMessage: 'Launch images',
    }),
  }[app?.name] || app?.display_name);
