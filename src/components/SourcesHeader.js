import React from 'react';
import { useIntl } from 'react-intl';

import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

import TabNavigation from './TabNavigation';
import { usePreviewFlag } from '../utilities/usePreviewFlag';

const SourcesHeader = () => {
  const intl = useIntl();
  const enableIntegrations = usePreviewFlag('platform.sources.integrations');

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
