import React from 'react';
import { useIntl } from 'react-intl';

import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

import TabNavigation from './TabNavigation';

const SourcesHeader = () => {
  const intl = useIntl();

  return (
    <PageHeader className="pf-u-pb-0">
      <PageHeaderTitle
        title={intl.formatMessage({
          id: 'sources.sources',
          defaultMessage: 'Sources',
        })}
      />
      <TabNavigation />
    </PageHeader>
  );
};

export default React.memo(SourcesHeader);
