import React from 'react';
import { useIntl } from 'react-intl';

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

const SourcesEmptyState = () => {
  const isOrgAdmin = useIsOrgAdmin();
  const intl = useIntl();

  return (
    <Bullseye>
      <EmptyState className="ins-c-sources__empty-state">
        <EmptyStateIcon icon={WrenchIcon} />
        <Title headingLevel="h5" size="lg">
          {intl.formatMessage({
            id: 'sources.emptyStateTitle',
            defaultMessage: 'No sources',
          })}
        </Title>
        <EmptyStateBody>
          {isOrgAdmin &&
            intl.formatMessage({
              id: 'sources.emptyStateBody',
              defaultMessage: 'No sources have been defined. To start define a source.',
            })}
          {!isOrgAdmin && (
            <React.Fragment>
              <br />
              {intl.formatMessage({
                id: 'sources.emptyStateBodyNotAdmin',
                defaultMessage: 'You must be an Organization Administrator to add a source.',
              })}
            </React.Fragment>
          )}
        </EmptyStateBody>
        {isOrgAdmin ? (
          <Link to={routes.sourcesNew.path}>
            <Button className="pf-u-mt-xl" variant="primary">
              {intl.formatMessage({
                id: 'sources.emptyStateButton',
                defaultMessage: 'Add source',
              })}
            </Button>
          </Link>
        ) : (
          <Button variant="primary" isDisabled>
            {intl.formatMessage({
              id: 'sources.emptyStateButton',
              defaultMessage: 'Add source',
            })}
          </Button>
        )}
      </EmptyState>
    </Bullseye>
  );
};

export default SourcesEmptyState;
