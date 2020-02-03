import React from 'react';
import { Bullseye, EmptyState, EmptyStateVariant, EmptyStateIcon, Title, EmptyStateBody, Button } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { clearFilters } from '../../redux/sources/actions';

const EmptyStateTable = () => {
    const dispatch = useDispatch();

    return (
        <Bullseye>
            <EmptyState variant={EmptyStateVariant.small}>
                <EmptyStateIcon icon={SearchIcon} />
                <Title headingLevel="h2" size="lg">
                    <FormattedMessage
                        defaultMessage="No sources found"
                        id="sources.noResultsFoundTitle"
                    />
                </Title>
                <EmptyStateBody>
                    <FormattedMessage
                        defaultMessage="No sources match the filter criteria. Remove
                    all filters or clear all filters to show sources."
                        id="sources.noResultsFoundDescription"
                    />
                </EmptyStateBody>
                <Button variant="link" onClick={() => dispatch(clearFilters())}>
                    <FormattedMessage
                        defaultMessage="Clear all filters"
                        id="sources.clearAllFilters"
                    />
                </Button>
            </EmptyState>
        </Bullseye>
    );};

export default EmptyStateTable;
