import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import AppLink from '../AppLink';

import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { routes } from '../../routes';
import { useSource } from '../../hooks/useSource';

const messages = defineMessages({
  sourcesSources: {
    id: 'sources.sources',
    defaultMessage: 'Integrations',
  },
});

const Breadcrumbs = () => {
  const intl = useIntl();
  const source = useSource();

  return (
    <Breadcrumb>
      <BreadcrumbItem component={({ href, ...props }) => <AppLink to={href} {...props} />} to={routes.sources.path}>
        {intl.formatMessage(messages.sourcesSources)}
      </BreadcrumbItem>
      <BreadcrumbItem isActive>{source.name}</BreadcrumbItem>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
