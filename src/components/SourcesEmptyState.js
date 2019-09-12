import React from 'react';
import PropTypes from 'prop-types';
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
import { FormattedMessage } from 'react-intl';

import { WrenchIcon } from '@patternfly/react-icons'; // FIXME: different icon
import { Link } from 'react-router-dom';
import { paths } from '../Routes';

const SourcesEmptyState = ({ title, body }) => (
    <Card>
        <CardBody>
            <Bullseye>
                <EmptyState>
                    <EmptyStateIcon icon={WrenchIcon} />
                    <Title headingLevel="h5" size="lg">
                        {title ? title :
                            <FormattedMessage
                                id="sources.emptyStateTitle"
                                defaultMessage="No Sources"
                            />
                        }
                    </Title>
                    <EmptyStateBody>
                        {body ? body :
                            <FormattedMessage
                                id="sources.emptyStateBody"
                                defaultMessage="No Sources have been defined. To start define a Source."
                            />
                        }
                    </EmptyStateBody>
                    <Link to={paths.sourcesNew}>
                        <Button style={{ marginTop: 'var(--pf-c-empty-state--c-button--MarginTop)' }}
                            variant="primary">
                            <FormattedMessage
                                id="sources.emptyStateButton"
                                defaultMessage="Add a source"
                            />
                        </Button>
                    </Link>
                </EmptyState>
            </Bullseye>
        </CardBody>
    </Card>
);

SourcesEmptyState.propTypes = {
    title: PropTypes.node,
    body: PropTypes.node
};

export default SourcesEmptyState;
