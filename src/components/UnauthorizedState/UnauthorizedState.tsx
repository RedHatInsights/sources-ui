import React from 'react';
import { Alert, AlertActionLink, Icon, Stack, StackItem, Content, ContentVariants } from '@patternfly/react-core';
import { AutomationIcon, LockIcon, OutlinedCommentsIcon } from '@patternfly/react-icons';
import { useIntl } from 'react-intl';
import { COMMUNICATIONS, REPORTING, WEBHOOKS } from '../../utilities/constants';
import { useSelector } from 'react-redux';
import ImageWithPlaceholder from '../TilesShared/ImageWithPlaceholder';

interface CategoryData {
  icon: React.ReactElement;
  heading: string;
  description: React.ReactNode;
  items?: { name: string; src: string; href: string }[];
}

const UnauthorizedState = () => {
  const intl = useIntl();

  const activeCategory = useSelector(({ sources }) => sources.activeCategory);

  const categoryData: Record<typeof COMMUNICATIONS | typeof REPORTING | typeof WEBHOOKS, CategoryData> = {
    [COMMUNICATIONS]: {
      icon: <OutlinedCommentsIcon />,
      heading: intl.formatMessage({
        id: 'integrations.unauthorizedState.headingIntegrations',
        defaultMessage: 'No communication integrations',
      }),
      description: intl.formatMessage({
        id: 'integrations.unauthorizedState.descriptionIntegrations',
        defaultMessage:
          'Connect with 3rd party communication tools to stay up to date on event notifications for your Hybrid Cloud Console assets.',
      }),
      items: [
        {
          name: intl.formatMessage({
            id: 'integrations.serviceName.slack',
            defaultMessage: 'Slack',
          }),
          src: '/apps/frontend-assets/sources-integrations/slack.svg',
          href: 'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-configuring-insights-integration-with-slack_integrations',
        },
        {
          name: intl.formatMessage({
            id: 'integrations.serviceName.microsoftTeams',
            defaultMessage: 'Microsoft Teams',
          }),
          src: '/apps/frontend-assets/sources-integrations/microsoft-office-teams.svg',
          href: 'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-configuring-integration-with-teams_integrations',
        },
        {
          name: intl.formatMessage({
            id: 'integrations.serviceName.googleChat',
            defaultMessage: 'Google Chat',
          }),
          src: '/apps/frontend-assets/sources-integrations/google-chat.svg',
          href: 'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-configuring-integration-with-gchat_integrations',
        },
      ],
    },
    [REPORTING]: {
      icon: <AutomationIcon />,
      heading: intl.formatMessage({
        id: 'integrations.unauthorizedState.headingReporting',
        defaultMessage: 'No reporting and automation integrations',
      }),
      description: intl.formatMessage({
        id: 'integrations.unauthorizedState.descriptionReporting',
        defaultMessage:
          'Connect with 3rd party reporting and automation tools to stay up to date on event notifications for your Hybrid Cloud Console assets.',
      }),
      items: [
        {
          name: intl.formatMessage({
            id: 'integrations.serviceName.eventDrivenAnsible',
            defaultMessage: 'Event-Driven Ansible',
          }),
          src: '/apps/frontend-assets/sources-integrations/ansible.svg',
          href: 'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-configuring-integration-with-eda_integrations',
        },
        {
          name: intl.formatMessage({
            id: 'integrations.serviceName.serviceNow',
            defaultMessage: 'ServiceNow',
          }),
          src: '/apps/frontend-assets/sources-integrations/service-now.svg',
          href: 'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-installing-configuring-insights-for-snow_integrations',
        },
        {
          name: intl.formatMessage({
            id: 'integrations.serviceName.splunk',
            defaultMessage: 'Splunk',
          }),
          src: '/apps/frontend-assets/sources-integrations/splunk.svg',
          href: 'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-installing-configuring-insights-for-splunk_integrations',
        },
      ],
    },
    [WEBHOOKS]: {
      icon: (
        <ImageWithPlaceholder
          className="pf-v6-c-list__item-icon pf-v6-u-danger-color-100"
          src="/apps/frontend-assets/integrations-landing/integrations-landing-webhook-icon.svg"
          width="54px"
          height="54px"
          alt="Webhooks icon"
        />
      ),
      heading: intl.formatMessage({
        id: 'integrations.unauthorizedState.headingWebhooks',
        defaultMessage: 'No webhook integrations',
      }),
      description: (
        <>
          {intl.formatMessage({
            id: 'integrations.unauthorizedState.descriptionWebhooks1',
            defaultMessage: 'Connect',
          })}{' '}
          <a
            href="https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-configuring-integration-with-webhooks_integrations"
            target="_blank"
            rel="noopener noreferrer"
          >
            {intl.formatMessage({
              id: 'integrations.unauthorizedState.linkWebhookEp',
              defaultMessage: 'webhook endpoints',
            })}
          </a>{' '}
          {intl.formatMessage({
            id: 'integrations.unauthorizedState.descriptionWebhooks2',
            defaultMessage: 'to stay up to date on event notifications for your Hybrid Cloud Console assets.',
          })}
        </>
      ),
    },
  };

  const activeData = categoryData[activeCategory as keyof typeof categoryData] || null;

  if (!activeData) {
    return null;
  }

  return (
    <Stack hasGutter>
      <StackItem>
        <Alert
          customIcon={<LockIcon />}
          variant="info"
          isInline
          isExpandable
          title={intl.formatMessage({
            id: 'integrations.overview.alertTitle',
            defaultMessage: 'Need to create an integration?',
          })}
          actionLinks={
            <AlertActionLink component="a" href="#" target="_blank">
              {intl.formatMessage({
                id: 'integrations.overview.alertLink',
                defaultMessage: 'Learn about requesting access via the Virtual Assistant',
              })}
            </AlertActionLink>
          }
        >
          <Content>
            <Content component={ContentVariants.p}>
              {intl.formatMessage({
                id: 'integrations.overview.alertParagraph',
                defaultMessage:
                  'You do not have the permissions for integration management. Contact your organization admin if you need these permissions updated.',
              })}
            </Content>
          </Content>
        </Alert>
      </StackItem>
      <StackItem>
        <Icon size="xl" className="pf-v6-u-color-200 pf-v6-u-display-block pf-v6-u-mx-auto pf-v6-u-mb-lg">
          {activeData.icon}
        </Icon>
        <Content className="pf-v6-u-mb-md">
          <Content component={ContentVariants.h2} className="pf-v6-u-text-align-center pf-v6-u-mb-md">
            {activeData.heading}
          </Content>
          <Content component={ContentVariants.p} className="pf-v6-u-text-align-center pf-v6-u-px-4xl">
            {activeData.description}
          </Content>
        </Content>
      </StackItem>
      <StackItem>
        <ul className="pf-v6-c-list pf-m-inline pf-m-icon-lg pf-v6-u-justify-content-center" role="list">
          {activeData.items?.map((item: any, index: any) => (
            <li className="pf-v6-c-list__item" key={index}>
              <ImageWithPlaceholder
                className="pf-v6-c-list__item-icon"
                src={item.src}
                width="24px"
                height="24px"
                alt={`${item.name} icon`}
              />
              <span className="pf-v6-c-list__item-text">
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  {item.name}
                </a>
              </span>
            </li>
          ))}
        </ul>
      </StackItem>
    </Stack>
  );
};

export default UnauthorizedState;
