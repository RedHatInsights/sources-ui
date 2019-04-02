import React from 'react';
import {
    Bullseye,
    Card,
    CardBody,
    Title,
    Button,
    EmptyState,
    EmptyStateIcon,
    EmptyStateBody
} from '@patternfly/react-core';

import { CubesIcon } from '@patternfly/react-icons'; // FIXME: different icon

const SourcesEmptyState = () => (
    <Card>
        <CardBody>
            <Bullseye>
                <EmptyState>
                    <EmptyStateIcon icon={CubesIcon} />
                    <Title headingLevel="h5" size="lg">No Sources</Title>
                    <EmptyStateBody>
                        No Sources have been defined. To start define a Source.
                    </EmptyStateBody>
                    <Button
                        component="a"
                        href="/new"
                        target="_blank"
                        variant="primary">Add a Source</Button>
                </EmptyState>
            </Bullseye>
        </CardBody>
    </Card>
);

export default SourcesEmptyState;
