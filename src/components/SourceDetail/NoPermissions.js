import React from 'react';
import { useIntl } from 'react-intl';

import { EmptyState, EmptyStateIcon, EmptyStateBody, Title } from '@patternfly/react-core';
import PrivateIcon from '@patternfly/react-icons/dist/esm/icons/private-icon';

const NoPermissions = () => {
  const intl = useIntl();

  return (
    <EmptyState>
      <EmptyStateIcon icon={PrivateIcon} />
      <Title headingLevel="h4" size="lg">
        {intl.formatMessage({
          id: 'detail.nopermissions.title',
          defaultMessage: 'Missing permissions',
        })}
      </Title>
      <EmptyStateBody className="empty-state-body">
        {intl.formatMessage({
          id: 'detail.nopermissions.description',
          defaultMessage: 'To perform this action, you must be granted write permissions from your Organization Administrator.',
        })}
      </EmptyStateBody>
    </EmptyState>
  );
};

export default NoPermissions;
