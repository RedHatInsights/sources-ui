import React from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { routes } from '../../Routes';
import { useSource } from '../../hooks/useSource';

const Breadcrumbs = () => {
  const intl = useIntl();
  const source = useSource();

  return (
    <Breadcrumb>
      <BreadcrumbItem component={({ href, ...props }) => <Link to={href} {...props} />} to={routes.sources.path}>
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
