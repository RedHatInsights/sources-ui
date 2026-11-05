import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { EmptyState, EmptyStateBody, Title } from '@patternfly/react-core';
import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';

const messages = defineMessages({
  detailNoapplicationsTitle: {
    id: 'detail.noapplications.title',
    defaultMessage: 'No connected applications',
  },
  detailNoapplicationsDescription: {
    id: 'detail.noapplications.description',
    defaultMessage: 'You have not connected any applications to this integration. Use the switches above to add applications.',
  },
});

const NoApplications = () => {
  const intl = useIntl();

  return (
    <EmptyState
      titleText={
        <Title headingLevel="h4" size="lg">
          {intl.formatMessage(messages.detailNoapplicationsTitle)}
        </Title>
      }
      icon={PlusCircleIcon}
    >
      <EmptyStateBody className="src-c-empty-state__body">
        {intl.formatMessage(messages.detailNoapplicationsDescription)}
      </EmptyStateBody>
    </EmptyState>
  );
};

export default NoApplications;
