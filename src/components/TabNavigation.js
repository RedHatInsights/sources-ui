import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { Tab, TabTitleIcon, TabTitleText, Tabs } from '@patternfly/react-core';
import RedhatIcon from '@patternfly/react-icons/dist/esm/icons/redhat-icon';
import CloudIcon from '@patternfly/react-icons/dist/esm/icons/cloud-icon';

import { setActiveCategory } from '../redux/sources/actions';
import { CLOUD_VENDOR, COMMUNICATIONS, INTEGRATIONS, REDHAT_VENDOR, REPORTING, WEBHOOKS } from '../utilities/constants';
import { useFlag } from '@unleash/proxy-client-react';

const TabNavigation = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const activeCategory = useSelector(({ sources }) => sources.activeCategory);
  const enableIntegrations = useFlag('platform.sources.integrations');
  const enableBreakdown = useFlag('platform.sources.integrations.breakdown');
  const isOrgAdmin = useSelector(({ user }) => user.isOrgAdmin);
  const hasIntegrationsPermissions = useSelector(({ user }) => user?.integrationsEndpointsPermissions);

  return (
    <Tabs activeKey={activeCategory} onSelect={(_e, key) => dispatch(setActiveCategory(key))} className="pf-v5-u-mt-md">
      <Tab
        eventKey={CLOUD_VENDOR}
        title={
          <React.Fragment>
            <TabTitleIcon>
              <CloudIcon aria-label="Cloud Icon" />
            </TabTitleIcon>
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
            <TabTitleIcon>
              <RedhatIcon aria-label="Red Hat Icon" />
            </TabTitleIcon>
            <TabTitleText>
              {intl.formatMessage({
                id: 'sources.redhatSources',
                defaultMessage: enableIntegrations ? 'Red Hat' : 'Red Hat sources',
              })}
            </TabTitleText>
          </React.Fragment>
        }
      />
      {(isOrgAdmin || hasIntegrationsPermissions) &&
        (enableIntegrations || enableBreakdown) &&
        (enableBreakdown ? (
          <>
            <Tab
              eventKey={COMMUNICATIONS}
              title={
                <TabTitleText>
                  {intl.formatMessage({ id: 'sources.communications', defaultMessage: 'Communications' })}
                </TabTitleText>
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
            title={
              <TabTitleText>{intl.formatMessage({ id: 'sources.integrations', defaultMessage: 'Integrations' })}</TabTitleText>
            }
          />
        ))}
    </Tabs>
  );
};

export default TabNavigation;
