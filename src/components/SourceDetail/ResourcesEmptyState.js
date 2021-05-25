import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import WrenchIcon from '@patternfly/react-icons/dist/esm/icons/wrench-icon';

import { Bullseye, EmptyState, EmptyStateVariant, EmptyStateIcon, EmptyStateBody, Title, Alert } from '@patternfly/react-core';

import { pausedAppAlert } from '../../utilities/alerts';

export const ResourcesEmptyState = ({ applicationName, message, Icon, isPaused }) => {
  const intl = useIntl();

  let { description, ...alertProps } = isPaused ? pausedAppAlert(intl, applicationName) : {};

  return (
    <React.Fragment>
      {isPaused && (
        <Alert isInline className="pf-u-mt-lg" {...alertProps}>
          {description}
        </Alert>
      )}
      <Bullseye>
        <EmptyState variant={EmptyStateVariant.small}>
          <EmptyStateIcon icon={Icon} />
          <Title headingLevel="h2" size="lg">
            {intl.formatMessage({
              id: 'resourceTable.emptyStateTitle',
              defaultMessage: 'No application resources',
            })}
          </Title>
          <EmptyStateBody>{intl.formatMessage(message, { applicationName })}</EmptyStateBody>
        </EmptyState>
      </Bullseye>
    </React.Fragment>
  );
};

ResourcesEmptyState.propTypes = {
  applicationName: PropTypes.string.isRequired,
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.isRequired,
  }),
  Icon: PropTypes.elementType,
  isPaused: PropTypes.string,
};

ResourcesEmptyState.defaultProps = {
  message: {
    id: 'resourceTable.emptyStateDescription',
    defaultMessage: '{applicationName} resources will appear here when created.',
  },
  Icon: WrenchIcon,
};

export default ResourcesEmptyState;
