import React from 'react';
import { useIntl } from 'react-intl';

import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

import TabNavigation from './TabNavigation';

const SourcesHeader = () => {
  const intl = useIntl();

  return (
    <PageHeader className="pf-v5-u-pb-0">
      <PageHeaderTitle title={intl.formatMessage({ id: 'sources.integrations', defaultMessage: 'Integrations' })} />
      <TabNavigation />
    </PageHeader>
  );
};

export default React.memo(SourcesHeader);
