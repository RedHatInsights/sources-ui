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

import { WrenchIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';
import { paths } from '../Routes';
import { useIsOrgAdmin } from '../hooks/useIsOrgAdmin';

const SourcesEmptyState = ({ title, body }) => {
    const isOrgAdmin = useIsOrgAdmin();

    return (
        <Card>
            <CardBody>
                <Bullseye>
                    <EmptyState>
                        <EmptyStateIcon icon={WrenchIcon} />
                        <Title headingLevel="h5" size="lg">
                            {title ? title :
                                <FormattedMessage
                                    id="sources.emptyStateTitle"
                                    defaultMessage="No sources"
                                />
                            }
                        </Title>
                        <EmptyStateBody>
                            {body ? body :
                                isOrgAdmin && <FormattedMessage
                                    id="sources.emptyStateBody"
                                    defaultMessage="No sources have been defined. To start define a source."
                                />}
                            {!isOrgAdmin && <FormattedMessage
                                id="sources.emptyStateBodyNotAdmin"
                                defaultMessage="To define a source, you have to be an organisation admin."
                            />}
                        </EmptyStateBody>
                        {isOrgAdmin && <Link to={paths.sourcesNew}>
                            <Button style={{ marginTop: 'var(--pf-c-empty-state--c-button--MarginTop)' }}
                                variant="primary">
                                <FormattedMessage
                                    id="sources.emptyStateButton"
                                    defaultMessage="Add a source"
                                />
                            </Button>
                        </Link>}
                    </EmptyState>
                </Bullseye>
            </CardBody>
        </Card>
    );
};

SourcesEmptyState.propTypes = {
    title: PropTypes.node,
    body: PropTypes.node
};

export default SourcesEmptyState;
