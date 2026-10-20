import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import TabNavigation from './TabNavigation';
import { useFlag } from '@unleash/proxy-client-react';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { PageHeader as PFPageHeader } from '@patternfly/react-component-groups';
import IntegrationsDropdown from './IntegrationsDropdown';
import '../styles/sourcesHeader.scss';
import { LockIcon } from '@patternfly/react-icons';
import { Button, Content, ContentVariants, Popover } from '@patternfly/react-core';
import { useSelector } from 'react-redux';

const messages = defineMessages({
  popoverAria: {
    id: 'sourcesHeader.popoverAria',
    defaultMessage: 'Popover with icon in the title example',
  },

  sourcesIntegrations: {
    id: 'sources.integrations',
    defaultMessage: 'Integrations',
  },
  sourcesIntegrationsSubtitle: {
    id: 'sources.integrations.subtitle',
    defaultMessage:
      'Integrating third-party applications expands the scope of notifications beyond emails and messages, so that you can view and manage Hybrid Cloud Console events from your preferred platform dashboard. Cloud integrations connect your cloud provider accounts with the Hybrid Cloud Console to collect data, so you can use console services with your cloud providers.',
  },
  integrationsOverviewLearnmore: {
    id: 'integrations.overview.learnMore',
    defaultMessage: 'Learn more',
  },
  sourcesIntegrationsPopoverheader: {
    id: 'sources.integrations.popoverHeader',
    defaultMessage: 'Access needed',
  },
  integrationsOverviewPopoverbody: {
    id: 'integrations.overview.popoverBody',
    defaultMessage:
      'You do not have the permissions for integration management. Contact your organization admin if you need these permissions updated.',
  },
  integrationsOverviewPopoverlink: {
    id: 'integrations.overview.popoverLink',
    defaultMessage: 'Learn about requesting access via the Virtual Assistant',
  },
});

const SourcesHeader = () => {
  const intl = useIntl();
  const enableIntegrationsOverview = useFlag('platform.integrations.overview');
  const integrationsIcon = '/apps/frontend-assets/technology-icons/integrations.svg';

  const hasSourcesPermissions = useSelector(({ user }) => user?.writePermissions);
  const hasIntegrationsPermissions = useSelector(({ user }) => user?.integrationsEndpointsPermissions);

  return (
    <>
      {enableIntegrationsOverview ? (
        <>
          <PFPageHeader
            data-codemods
            ouiaId={'sources-header'}
            title={intl.formatMessage(messages.sourcesIntegrations)}
            subtitle={intl.formatMessage(messages.sourcesIntegrationsSubtitle)}
            icon={<img src={integrationsIcon} alt="integrations-header-icon" />}
            linkProps={{
              label: intl.formatMessage(messages.integrationsOverviewLearnmore),
              isExternal: true,
              target: '_blank',
              component: 'a',
              href: 'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/extend-manage_alerts_preferred_platform',
            }}
            actionMenu={
              !hasSourcesPermissions && !hasIntegrationsPermissions ? (
                <Popover
                  triggerAction="hover"
                  alertSeverityVariant="info"
                  minWidth="450px"
                  aria-label={intl.formatMessage(messages.popoverAria)}
                  headerContent={intl.formatMessage(messages.sourcesIntegrationsPopoverheader)}
                  headerIcon={<LockIcon />}
                  bodyContent={
                    <Content>
                      <Content component={ContentVariants.p}>
                        {intl.formatMessage(messages.integrationsOverviewPopoverbody)}{' '}
                        <Button
                          component="a"
                          href="https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/get_started-ai_powered_support#virtual-assistant"
                          isInline
                          target="_blank"
                          variant="link"
                        >
                          {intl.formatMessage(messages.integrationsOverviewPopoverlink)}
                        </Button>
                      </Content>
                    </Content>
                  }
                  position="left"
                  appendTo={document.body}
                >
                  <IntegrationsDropdown
                    isDisabled={!hasSourcesPermissions && !hasIntegrationsPermissions}
                    popperProps={{
                      appendTo: document.body,
                      position: 'right',
                    }}
                  />
                </Popover>
              ) : (
                <IntegrationsDropdown
                  isDisabled={!hasSourcesPermissions && !hasIntegrationsPermissions}
                  popperProps={{
                    appendTo: document.body,
                    position: 'right',
                  }}
                />
              )
            }
          />
          <TabNavigation />
        </>
      ) : (
        <PageHeader className="pf-v6-u-pb-0">
          <PageHeaderTitle title={intl.formatMessage(messages.sourcesIntegrations)} />
          <TabNavigation />
        </PageHeader>
      )}
    </>
  );
};

export default React.memo(SourcesHeader);
