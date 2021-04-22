import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import WrenchIcon from '@patternfly/react-icons/dist/esm/icons/wrench-icon';

import { Bullseye, EmptyState, EmptyStateVariant, EmptyStateIcon, EmptyStateBody, Title } from '@patternfly/react-core';

export const ResourcesEmptyState = ({ applicationName, message, Icon }) => {
  const intl = useIntl();

  return (
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
  );
};

ResourcesEmptyState.propTypes = {
  applicationName: PropTypes.string.isRequired,
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.isRequired,
  }),
  Icon: PropTypes.elementType,
};

ResourcesEmptyState.defaultProps = {
  message: {
    id: 'resourceTable.emptyStateDescription',
    defaultMessage: '{applicationName} resources will appear here when created.',
  },
  Icon: WrenchIcon,
};

export default ResourcesEmptyState;
