import React from 'react';

import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { EmptyState, EmptyStateVariant } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateIcon';
import { EmptyStateBody } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateBody';
import { Bullseye } from '@patternfly/react-core/dist/js/layouts/Bullseye/Bullseye';
import { Title } from '@patternfly/react-core/dist/js/components/Title/Title';

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
