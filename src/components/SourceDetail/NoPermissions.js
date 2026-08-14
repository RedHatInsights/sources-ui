import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { EmptyState, EmptyStateBody, Title } from '@patternfly/react-core';
import PrivateIcon from '@patternfly/react-icons/dist/esm/icons/private-icon';
import { disabledMessage } from '../../utilities/disabledTooltipProps';

const NoPermissions = () => {
  const intl = useIntl();
  const isOrgAdmin = useSelector(({ user }) => user?.isOrgAdmin);

  return (
    <EmptyState
      titleText={
        <Title headingLevel="h4" size="lg">
          {intl.formatMessage({
            id: 'detail.nopermissions.title',
            defaultMessage: 'Missing permissions',
          })}
        </Title>
      }
      icon={PrivateIcon}
    >
      <EmptyStateBody className="src-c-empty-state__body">{disabledMessage(intl, isOrgAdmin)}</EmptyStateBody>
    </EmptyState>
  );
};

export default NoPermissions;
