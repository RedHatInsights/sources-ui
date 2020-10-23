import React from 'react';

import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { EmptyState, EmptyStateVariant } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateIcon';
import { EmptyStateBody } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateBody';
import { Bullseye } from '@patternfly/react-core/dist/js/layouts/Bullseye/Bullseye';
import { Title } from '@patternfly/react-core/dist/js/components/Title/Title';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { clearFilters } from '../../redux/sources/actions';

const EmptyStateTable = () => {
  const intl = useIntl();
  const dispatch = useDispatch();

  return (
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.small}>
        <EmptyStateIcon icon={SearchIcon} />
        <Title headingLevel="h2" size="lg">
          {intl.formatMessage({
            id: 'sources.noResultsFoundTitle',
            defaultMessage: 'No sources found',
          })}
        </Title>
        <EmptyStateBody>
          {intl.formatMessage({
            id: 'sources.noResultsFoundDescription',
            defaultMessage: 'No sources match the filter criteria. Remove all filters or clear all filters to show sources.',
          })}
        </EmptyStateBody>
        <Button variant="link" onClick={() => dispatch(clearFilters())}>
          {intl.formatMessage({
            id: 'sources.clearAllFilters',
            defaultMessage: 'Clear all filters',
          })}
        </Button>
      </EmptyState>
    </Bullseye>
  );
};

export default EmptyStateTable;
