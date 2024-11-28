import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { PageSection, PageSectionVariants, Tab, TabTitleIcon, TabTitleText, Tabs } from '@patternfly/react-core';
import RedhatIcon from '@patternfly/react-icons/dist/esm/icons/redhat-icon';
import CloudIcon from '@patternfly/react-icons/dist/esm/icons/cloud-icon';

import { setActiveCategory } from '../redux/sources/actions';
import { CLOUD_VENDOR, COMMUNICATIONS, INTEGRATIONS, OVERVIEW, REDHAT_VENDOR, REPORTING, WEBHOOKS } from '../utilities/constants';
import { useFlag } from '@unleash/proxy-client-react';

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
          title={
            <TabTitleText>{intl.formatMessage({ id: 'sources.communications', defaultMessage: 'Communications' })}</TabTitleText>
          }
        />
        <Tab
          eventKey={REPORTING}
          title={
            <TabTitleText>
              {intl.formatMessage({ id: 'sources.reportingAutomation', defaultMessage: 'Reporting & Automation' })}
            </TabTitleText>
          }
        />
        <Tab
          eventKey={WEBHOOKS}
          title={<TabTitleText>{intl.formatMessage({ id: 'sources.webhooks', defaultMessage: 'Webhooks' })}</TabTitleText>}
        />
      </>
    ) : (
      <Tab
        eventKey={INTEGRATIONS}
        title={<TabTitleText>{intl.formatMessage({ id: 'sources.integrations', defaultMessage: 'Integrations' })}</TabTitleText>}
      />
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
                <CloudIcon aria-label="Cloud Icon" />
              </TabTitleIcon>
            )}
            <TabTitleText>
              {intl.formatMessage({
                id: 'sources.cloudSources',
                defaultMessage: enableIntegrations ? 'Cloud' : 'Cloud sources',
              })}
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
                <RedhatIcon aria-label="Red Hat Icon" />
              </TabTitleIcon>
            )}
            <TabTitleText>
              {intl.formatMessage({
                id: 'sources.redhatSources',
                defaultMessage: enableIntegrations ? 'Red Hat' : 'Red Hat sources',
              })}
            </TabTitleText>
          </React.Fragment>
        }
      />
    </>
  );

  return (
    <PageSection type="tabs" variant={PageSectionVariants.light} isWidthLimited>
      <Tabs
        activeKey={activeCategory || (enableIntegrationsOverview ? OVERVIEW : CLOUD_VENDOR)}
        onSelect={(_e, key) => dispatch(setActiveCategory(key))}
        className="pf-v5-u-mt-md"
        inset={{
          default: 'insetNone',
          md: 'insetSm',
          xl: 'insetLg',
          '2xl': 'inset2xl',
        }}
      >
        {enableIntegrationsOverview ? (
          <>
            <Tab
              eventKey={OVERVIEW}
              title={<TabTitleText> {intl.formatMessage({ id: 'sources.overview', defaultMessage: 'Overview' })}</TabTitleText>}
            ></Tab>
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
