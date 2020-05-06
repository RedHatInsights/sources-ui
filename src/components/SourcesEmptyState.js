import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { EmptyState } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateIcon';
import { EmptyStateBody } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateBody';
import { Bullseye } from '@patternfly/react-core/dist/js/layouts/Bullseye/Bullseye';
import { Title } from '@patternfly/react-core/dist/js/components/Title/Title';

import WrenchIcon from '@patternfly/react-icons/dist/js/icons/wrench-icon';

import { Link } from 'react-router-dom';
import { routes } from '../Routes';
import { useIsOrgAdmin } from '../hooks/useIsOrgAdmin';

const SourcesEmptyState = ({ title, body }) => {
    const isOrgAdmin = useIsOrgAdmin();

    return (
        <Bullseye>
            <EmptyState className="ins-c-sources__empty-state">
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
                    {!isOrgAdmin && <React.Fragment>
                        <br />
                        <FormattedMessage
                            id="sources.emptyStateBodyNotAdmin"
                            defaultMessage="You do not have permission to define sources."
                        />
                    </React.Fragment>}
                </EmptyStateBody>
                {isOrgAdmin ? <Link to={routes.sourcesNew.path}>
                    <Button
                        style={{ marginTop: 'var(--pf-c-empty-state--c-button--MarginTop)' }}
                        variant="primary"
                    >
                        <FormattedMessage
                            id="sources.emptyStateButton"
                            defaultMessage="Add source"
                        />
                    </Button>
                </Link> :
                    <Button
                        style={{ marginTop: 'var(--pf-c-empty-state--c-button--MarginTop)' }}
                        variant="primary"
                        isDisabled
                    >
                        <FormattedMessage
                            id="sources.emptyStateButton"
                            defaultMessage="Add source"
                        />
                    </Button>
                }
            </EmptyState>
        </Bullseye>
    );
};

SourcesEmptyState.propTypes = {
    title: PropTypes.node,
    body: PropTypes.node
};

export default SourcesEmptyState;
