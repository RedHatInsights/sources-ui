import React from 'react';
import { useIntl } from 'react-intl';

import { EmptyState, EmptyStateIcon, EmptyStateBody, Title } from '@patternfly/react-core';
import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';

const NoApplications = () => {
  const intl = useIntl();

  return (
    <EmptyState>
      <EmptyStateIcon icon={PlusCircleIcon} />
      <Title headingLevel="h4" size="lg">
        {intl.formatMessage({
          id: 'detail.noapplications.title',
          defaultMessage: 'No connected applications',
        })}
      </Title>
      <EmptyStateBody className="empty-state-body">
        {intl.formatMessage({
          id: 'detail.noapplications.description',
          defaultMessage: 'You have not connected any applications to this source. Use the switches above to add applications.',
        })}
      </EmptyStateBody>
    </EmptyState>
  );
};

export default NoApplications;
