import React from 'react';

import { Bullseye, Button, EmptyState, EmptyStateBody, EmptyStateVariant, Title } from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { clearFilters } from '../../redux/sources/actions';
import { Tbody, Td, Tr } from '@patternfly/react-table';
import PropTypes from 'prop-types';

const EmptyStateTable = () => {
  const intl = useIntl();
  const dispatch = useDispatch();

  return (
    <Bullseye>
      <EmptyState
        titleText={
          <Title headingLevel="h2" size="lg">
            {intl.formatMessage({
              id: 'sources.noResultsFoundTitle',
              defaultMessage: 'No sources found',
            })}
          </Title>
        }
        icon={SearchIcon}
        variant={EmptyStateVariant.small}
      >
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

export const EmptyStateDataView = ({ columns = 1 }) => {
  return (
    <Tbody>
      <Tr>
        <Td colSpan={columns}>
          <EmptyStateTable />
        </Td>
      </Tr>
    </Tbody>
  );
};

EmptyStateDataView.propTypes = {
  columns: PropTypes.number,
};

export default EmptyStateTable;
