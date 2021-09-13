import React from 'react';
import PauseIcon from '@patternfly/react-icons/dist/esm/icons/pause-icon';
import { bold } from './intlShared';

export const pausedAppAlert = (intl, application) => ({
  title: intl.formatMessage(
    {
      id: 'wizard.pausedApplication',
      defaultMessage: '{application} is paused',
    },
    { application }
  ),
  description: intl.formatMessage(
    {
      id: 'wizard.pausedApplicationDescription',
      defaultMessage:
        'To resume data collection for this application, switch {application} on in the <b>Applications</b> section of this page.',
    },
    { application, b: bold }
  ),
  variant: 'default',
  customIcon: <PauseIcon />,
});
