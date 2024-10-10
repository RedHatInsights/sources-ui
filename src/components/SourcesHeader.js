import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import TabNavigation from './TabNavigation';
import { useFlag } from '@unleash/proxy-client-react';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { ContentHeader } from '@patternfly/react-component-groups';
import IntegrationsDropdown from './IntegrationsDropdown';
import '../styles/sourcesHeader.scss';
import { LockIcon } from '@patternfly/react-icons';
import { Button, Popover, Text, TextContent, TextVariants } from '@patternfly/react-core';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const SourcesHeader = () => {
  const { getUserPermissions } = useChrome();
  const intl = useIntl();
  const enableIntegrationsOverview = useFlag('platform.integrations.overview');
  const integrationsIcon = '/apps/frontend-assets/sources-integrations/integrations-icon.svg';

  const [hasSources, setHasSources] = useState(false);
  const [hasIntegrations, setHasIntegrations] = useState(false);

  const checkSourcesPermissions = async () => {
    const userPermissions = await getUserPermissions('sources', true);
    const allPermissions = userPermissions.map((permissionObj) => permissionObj.permission);

    const hasSourcesPermissions = allPermissions.includes('sources:*:write') || allPermissions.includes('sources:*:*');

    setHasSources(hasSourcesPermissions);
  };

  const checkIntegrationsPermissions = async () => {
    const userPermissions = await getUserPermissions('integrations', true);
    const allPermissions = userPermissions.map((permissionObj) => permissionObj.permission);

    const hasIntegrationsPermissions =
      allPermissions.includes('integrations:*:*') ||
      allPermissions.includes('integrations:*:write') ||
      allPermissions.includes('integrations:endpoints:*') ||
      allPermissions.includes('integrations:endpoints:write');

    setHasIntegrations(hasIntegrationsPermissions);
  };

  useEffect(() => {
    checkSourcesPermissions();
    checkIntegrationsPermissions();
  }, []);

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
              !hasSources && !hasIntegrations ? (
                <Popover
                  triggerAction="hover"
                  alertSeverityVariant="info"
                  minWidth="450px"
                  aria-label="Popover with icon in the title example"
                  headerContent={intl.formatMessage({
                    id: 'sources.integrations.popoverHeader',
                    defaultMessage: 'Access needed',
                  })}
                  headerIcon={<LockIcon />}
                  bodyContent={
                    <TextContent>
                      <Text component={TextVariants.p}>
                        {intl.formatMessage({
                          id: 'integrations.overview.popoverBody',
                          defaultMessage:
                            'You do not the permissions for integration management. Contact your organization admin if you need these permissions updated.',
                        })}{' '}
                        <Button
                          component="a"
                          href="https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/getting_started_with_the_red_hat_hybrid_cloud_console/hcc-help-options_getting-started#virtual-assistant_getting-started"
                          isInline
                          target="_blank"
                          variant="link"
                        >
                          {intl.formatMessage({
                            id: 'integrations.overview.popoverLink',
                            defaultMessage: 'Learn about requesting access via the Virtual Assistant',
                          })}
                        </Button>
                      </Text>
                    </TextContent>
                  }
                  position="left"
                  appendTo={document.body}
                >
                  <IntegrationsDropdown
                    isDisabled={!hasSources && !hasIntegrations}
                    popperProps={{
                      appendTo: document.body,
                      position: 'right',
                    }}
                  />
                </Popover>
              ) : (
                <IntegrationsDropdown
                  isDisabled={!hasSources && !hasIntegrations}
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
        <PageHeader className="pf-v5-u-pb-0">
          <PageHeaderTitle title={intl.formatMessage({ id: 'sources.integrations', defaultMessage: 'Integrations' })} />
          <TabNavigation />
        </PageHeader>
      )}
    </>
  );
};

export default React.memo(SourcesHeader);
