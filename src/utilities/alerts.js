import React from 'react';
import PauseIcon from '@patternfly/react-icons/dist/esm/icons/pause-icon';

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
    // eslint-disable-next-line react/display-name
    { application, b: (chunks) => <b key="bold">{chunks}</b> }
  ),
  variant: 'default',
  customIcon: <PauseIcon />,
});
