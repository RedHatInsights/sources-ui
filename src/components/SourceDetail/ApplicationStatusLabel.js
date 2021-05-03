import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { Label, Popover } from '@patternfly/react-core';
import WrenchIcon from '@patternfly/react-icons/dist/esm/icons/wrench-icon';

import { useSource } from '../../hooks/useSource';
import { getAppStatus, getStatusTooltipTextApp, getStatusColor, getStatusText, IN_PROGRESS } from '../../views/formatters';

const ApplicationStatusLabel = ({ app }) => {
  const intl = useIntl();
  const source = useSource();

  const appTypes = useSelector(({ sources }) => sources.appTypes);

  const finalApp = getAppStatus(app, source, appTypes);

  return (
    <Popover
      showClose={false}
      aria-label={`${finalApp.display_name} popover`}
      bodyContent={getStatusTooltipTextApp(finalApp.availability_status, finalApp.availability_status_error, intl)}
    >
      <Label
        className="pf-u-ml-sm clickable"
        color={getStatusColor(finalApp.availability_status)}
        {...(finalApp.availability_status === IN_PROGRESS && { icon: <WrenchIcon /> })}
      >
        {getStatusText(finalApp.availability_status)}
      </Label>
    </Popover>
  );
};

ApplicationStatusLabel.propTypes = {
  app: PropTypes.shape({
    availability_status: PropTypes.string,
    availability_status_error: PropTypes.string,
    display_name: PropTypes.string,
  }).isRequired,
};

export default ApplicationStatusLabel;
