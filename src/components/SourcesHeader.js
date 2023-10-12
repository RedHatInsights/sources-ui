import React from 'react';
import { useIntl } from 'react-intl';
import { useFlag } from '@unleash/proxy-client-react';

import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

import TabNavigation from './TabNavigation';

const SourcesHeader = () => {
  const intl = useIntl();
  const enableIntegrations = useFlag('platform.sources.integrations');

  return (
    <PageHeader className="pf-u-pb-0">
      <PageHeaderTitle
        title={intl.formatMessage(
          enableIntegrations
            ? { id: 'sources.integrations', defaultMessage: 'Integrations' }
            : {
                id: 'sources.sources',
                defaultMessage: 'Sources',
              }
        )}
      />
      <TabNavigation />
    </PageHeader>
  );
};

export default React.memo(SourcesHeader);
