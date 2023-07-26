import React from 'react';
import { useIntl } from 'react-intl';
import AppLink from '../AppLink';

import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { routes } from '../../Routing';
import { useSource } from '../../hooks/useSource';

const Breadcrumbs = () => {
  const intl = useIntl();
  const source = useSource();

  return (
    <Breadcrumb>
      <BreadcrumbItem component={({ href, ...props }) => <AppLink to={href} {...props} />} to={routes.sources.path}>
        {intl.formatMessage({
          id: 'sources.sources',
          defaultMessage: 'Sources',
        })}
      </BreadcrumbItem>
      <BreadcrumbItem isActive>{source.name}</BreadcrumbItem>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
