import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { EmptyState } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateIcon';
import { EmptyStateBody } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateBody';
import { Bullseye } from '@patternfly/react-core/dist/js/layouts/Bullseye/Bullseye';
import { Title } from '@patternfly/react-core/dist/js/components/Title/Title';

import PlusIcon from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import { CLOUD_VENDOR } from '../../utilities/constants';

const SourcesEmptyState = () => {
  const intl = useIntl();
  const activeVendor = useSelector(({ sources }) => sources.activeVendor);

  return (
    <Bullseye>
      <EmptyState className="ins-c-sources__empty-state">
        <EmptyStateIcon icon={PlusIcon} />
        <Title headingLevel="h5" size="lg">
          {intl.formatMessage({
            id: 'sources.emptyStateTitle',
            defaultMessage: 'No sources',
          })}
        </Title>
        <EmptyStateBody>
          {intl.formatMessage(
            {
              id: 'sources.emptyStateBody',
              defaultMessage:
                'You don’t have any {activeVendor} sources configured. Add a source to connect to your Red Hat applications.',
            },
            {
              activeVendor:
                activeVendor === CLOUD_VENDOR ? intl.formatMessage({ id: 'sources.cloud', defaultMessage: 'cloud' }) : 'Red Hat',
            }
          )}
        </EmptyStateBody>
      </EmptyState>
    </Bullseye>
  );
};

export default SourcesEmptyState;
