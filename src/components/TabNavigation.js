import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { PageSection, Tab, TabTitleIcon, TabTitleText, Tabs } from '@patternfly/react-core';
import RedhatIcon from '@patternfly/react-icons/dist/esm/icons/redhat-icon';
import CloudIcon from '@patternfly/react-icons/dist/esm/icons/cloud-icon';

import { setActiveCategory } from '../redux/sources/actions';
import { CLOUD_VENDOR, COMMUNICATIONS, INTEGRATIONS, OVERVIEW, REDHAT_VENDOR, REPORTING, WEBHOOKS } from '../utilities/constants';
import { useFlag } from '@unleash/proxy-client-react';

const messages = defineMessages({
  redhatIconAria: {
    id: 'sources.redhatIconAria',
    defaultMessage: 'Red Hat Icon',
  },
  cloudIconAria: {
    id: 'sources.cloudIconAria',
    defaultMessage: 'Cloud Icon',
  },
  sourcesCloud: {
    id: 'sources.cloud',
    defaultMessage: 'Cloud',
  },
  sourcesCloudSources: {
    id: 'sources.cloudSources',
    defaultMessage: 'Cloud sources',
  },
  sourcesRedhat: {
    id: 'sources.redhat',
    defaultMessage: 'Red Hat',
  },
  sourcesRedhatSources: {
    id: 'sources.redhatSources',
    defaultMessage: 'Red Hat sources',
  },

  sourcesCommunications: {
    id: 'sources.communications',
    defaultMessage: 'Communications',
  },
  sourcesReportingautomation: {
    id: 'sources.reportingAutomation',
    defaultMessage: 'Reporting & automation',
  },
  sourcesWebhooks: {
    id: 'sources.webhooks',
    defaultMessage: 'Webhooks',
  },
  sourcesIntegrations: {
    id: 'sources.integrations',
    defaultMessage: 'Integrations',
  },
  sourcesOverview: {
    id: 'sources.overview',
    defaultMessage: 'Overview',
  },
});

const TabNavigation = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const activeCategory = useSelector(({ sources }) => sources.activeCategory);
  const enableIntegrations = useFlag('platform.sources.integrations');
  const enableBreakdown = useFlag('platform.sources.integrations.breakdown');
  const enableIntegrationsOverview = useFlag('platform.integrations.overview');
  const isOrgAdmin = useSelector(({ user }) => user.isOrgAdmin);
  const hasIntegrationsPermissions = useSelector(({ user }) => user?.integrationsEndpointsPermissions);
  const hasIntegrationsReadPermissions = useSelector(({ user }) => user?.integrationsReadPermissions);

  const integrationsTabs =
    (isOrgAdmin || hasIntegrationsPermissions || hasIntegrationsReadPermissions) &&
    (enableIntegrations || enableBreakdown) &&
    (enableBreakdown ? (
      <>
        <Tab
          eventKey={COMMUNICATIONS}
          title={<TabTitleText>{intl.formatMessage(messages.sourcesCommunications)}</TabTitleText>}
        />
        <Tab
          eventKey={REPORTING}
          title={<TabTitleText>{intl.formatMessage(messages.sourcesReportingautomation)}</TabTitleText>}
        />
        <Tab eventKey={WEBHOOKS} title={<TabTitleText>{intl.formatMessage(messages.sourcesWebhooks)}</TabTitleText>} />
      </>
    ) : (
      <Tab eventKey={INTEGRATIONS} title={<TabTitleText>{intl.formatMessage(messages.sourcesIntegrations)}</TabTitleText>} />
    ));

  const cloudTabs = (
    <>
      <Tab
        eventKey={CLOUD_VENDOR}
        title={
          <React.Fragment>
            {enableIntegrationsOverview ? (
              ''
            ) : (
              <TabTitleIcon>
                <CloudIcon aria-label={intl.formatMessage(messages.cloudIconAria)} />
              </TabTitleIcon>
            )}
            <TabTitleText>
              {intl.formatMessage(enableIntegrations ? messages.sourcesCloud : messages.sourcesCloudSources)}
            </TabTitleText>
          </React.Fragment>
        }
      />
      <Tab
        eventKey={REDHAT_VENDOR}
        title={
          <React.Fragment>
            {enableIntegrationsOverview ? (
              ''
            ) : (
              <TabTitleIcon>
                <RedhatIcon aria-label={intl.formatMessage(messages.redhatIconAria)} />
              </TabTitleIcon>
            )}
            <TabTitleText>
              {intl.formatMessage(enableIntegrations ? messages.sourcesRedhat : messages.sourcesRedhatSources)}
            </TabTitleText>
          </React.Fragment>
        }
      />
    </>
  );

  return (
    <PageSection hasBodyWrapper type="tabs" isWidthLimited>
      <Tabs
        activeKey={activeCategory || (enableIntegrationsOverview ? OVERVIEW : CLOUD_VENDOR)}
        onSelect={(_e, key) => dispatch(setActiveCategory(key))}
        className="pf-v6-u-mt-md"
        inset={{
          default: 'insetNone',
          md: 'insetSm',
          xl: 'insetLg',
          '2xl': 'inset2xl',
        }}
      >
        {enableIntegrationsOverview ? (
          <>
            <Tab eventKey={OVERVIEW} title={<TabTitleText> {intl.formatMessage(messages.sourcesOverview)}</TabTitleText>}></Tab>
            {cloudTabs}
            {integrationsTabs}
          </>
        ) : (
          <>
            {cloudTabs}
            {integrationsTabs}
          </>
        )}
      </Tabs>
    </PageSection>
  );
};

export default TabNavigation;
