import React from 'react';
import { useIntl } from 'react-intl';

import { EmptyState, EmptyStateIcon, EmptyStateBody, Title } from '@patternfly/react-core';
import PrivateIcon from '@patternfly/react-icons/dist/esm/icons/private-icon';
import { disabledMessage } from '../../utilities/disabledTooltipProps';

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
      <EmptyStateBody className="src-c-empty-state__body">{disabledMessage(intl)}</EmptyStateBody>
    </EmptyState>
  );
};

export default NoPermissions;
