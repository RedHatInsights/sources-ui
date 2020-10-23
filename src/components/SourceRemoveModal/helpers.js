import React from 'react';
import { FormattedMessage } from 'react-intl';

import { SATELLITE_NAME, ANSIBLE_TOWER_NAME } from '../../utilities/constants';

export const idToName = (id, appTypes) => appTypes.find((app) => app.id === id)?.display_name || 'Unknown';

export const typesWithExtendedText = [SATELLITE_NAME, ANSIBLE_TOWER_NAME];

export const bodyVariants = (variant, { name, count }) =>
  ({
    noApps: (
      <FormattedMessage
        id="sources.deleteTextBodyNoApps"
        defaultMessage="Removing { name } will permanently delete all data collected."
        values={{
          name: <b>{name}</b>,
        }}
      />
    ),
    withApps: (
      <FormattedMessage
        id="sources.deleteTextBodyWithApps"
        defaultMessage={`Removing { name } detaches the following
        connected {count, plural, one {application} other {applications}} from this source:`}
        values={{
          name: <b>{name}</b>,
          count,
        }}
      />
    ),
    withAppsExtendedText: (
      <FormattedMessage
        id="sources.deleteTextBodyWithAppsExtended"
        defaultMessage={`Removing { name } permanently deletes all collected data and detaches the following
    connected {count, plural, one {application} other {applications}}:`}
        values={{
          name: <b>{name}</b>,
          count,
        }}
      />
    ),
  }[variant]);
