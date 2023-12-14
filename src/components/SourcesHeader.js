import React from 'react';
import { useIntl } from 'react-intl';

import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

import TabNavigation from './TabNavigation';
import { useFlag } from '@unleash/proxy-client-react';

const SourcesHeader = () => {
  const intl = useIntl();
  const enableIntegrations = useFlag('platform.sources.integrations') || useFlag('platform.sources.breakdown');

  return (
    <PageHeader className="pf-v5-u-pb-0">
      <PageHeaderTitle
        title={intl.formatMessage(
          enableIntegrations
            ? { id: 'sources.integrations', defaultMessage: 'Integrations' }
            : {
                id: 'sources.sources',
                defaultMessage: 'Sources',
              },
        )}
      />
      <TabNavigation />
    </PageHeader>
  );
};

export default React.memo(SourcesHeader);
