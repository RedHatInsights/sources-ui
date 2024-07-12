import React from 'react';
import { useIntl } from 'react-intl';
import TabNavigation from './TabNavigation';
import { useFlag } from '@unleash/proxy-client-react';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { ContentHeader } from '@patternfly/react-component-groups';
import IntegrationsDropdown from './IntegrationsDropdown';
import '../styles/sourcesHeader.scss';

const SourcesHeader = () => {
  const intl = useIntl();
  const enableIntegrationsOverview = useFlag('platform.integrations.overview');
  const integrationsIcon = '/apps/frontend-assets/sources-integrations/integrations-icon.svg';

  return (
    <>
      {enableIntegrationsOverview ? (
        <>
          <ContentHeader
            title={intl.formatMessage({ id: 'sources.integrations', defaultMessage: 'Integrations' })}
            subtitle="Integrating third-party applications expands the scope of notifications beyond emails and messages, so that you can view and manage Hybrid Cloud Console events from your preferred platform dashboard."
            icon={<img src={integrationsIcon} alt="integrations-header-icon" />}
            linkProps={{
              label: 'Learn more',
              isExternal: true,
              to: 'https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/1-latest/html/configuring_notifications_on_the_red_hat_hybrid_cloud_console/index',
            }}
            actionMenu={
              <IntegrationsDropdown
                popperProps={{
                  appendTo: document.body,
                  position: 'right',
                }}
              />
            }
          />
          <TabNavigation />
        </>
      ) : (
        <PageHeader className="pf-v5-u-pb-0">
          <PageHeaderTitle title={intl.formatMessage({ id: 'sources.integrations', defaultMessage: 'Integrations' })} />
          <TabNavigation />
        </PageHeader>
      )}
    </>
  );
};

export default React.memo(SourcesHeader);
