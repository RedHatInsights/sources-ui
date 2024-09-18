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
            ouiaId={'sources-header'}
            title={intl.formatMessage({ id: 'sources.integrations', defaultMessage: 'Integrations' })}
            subtitle={intl.formatMessage({
              id: 'sources.integrations.subtitle',
              defaultMessage:
                'Integrating third-party applications expands the scope of notifications beyond emails and messages, so that you can view and manage Hybrid Cloud Console events from your preferred platform dashboard.',
            })}
            icon={<img src={integrationsIcon} alt="integrations-header-icon" />}
            linkProps={{
              label: intl.formatMessage({ id: 'integrations.overview.learnMore', defaultMessage: 'Learn more' }),
              isExternal: true,
              target: '_blank',
              component: 'a',
              href: 'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/index',
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
