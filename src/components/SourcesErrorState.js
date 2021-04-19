import React from 'react';
import { useIntl } from 'react-intl';

import { Button, EmptyState, EmptyStateIcon, EmptyStateBody, Bullseye, Title, Text } from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';

const SourcesErrorState = () => {
  const intl = useIntl();

  return (
    <Bullseye>
      <EmptyState className="ins-c-sources__empty-state">
        <EmptyStateIcon icon={ExclamationCircleIcon} color="var(--pf-global--danger-color--100)" />
        <Title headingLevel="h5" size="lg">
          {intl.formatMessage({
            id: 'sources.errorStateTitle',
            defaultMessage: 'Something went wrong',
          })}
        </Title>
        <EmptyStateBody>
          {intl.formatMessage(
            {
              id: 'sources.errorStateBody',
              defaultMessage:
                'There was a problem processing the request. Try refreshing the page. If the problem persists, contact <a>Red Hat support.</a>',
            },
            {
              // eslint-disable-next-line react/display-name
              a: (chunks) => (
                <Text key="link" component="a" href="https://access.redhat.com/support" target="_blank" rel="noopener noreferrer">
                  {chunks}
                </Text>
              ),
            }
          )}
        </EmptyStateBody>
        <Button className="pf-u-mt-xl" variant="primary" component="a" href={window.location.href}>
          {intl.formatMessage({
            id: 'sources.retry',
            defaultMessage: 'Retry',
          })}
        </Button>
      </EmptyState>
    </Bullseye>
  );
};

export default SourcesErrorState;
