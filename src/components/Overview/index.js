import React from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useIntl } from 'react-intl';
import {
  Alert,
  AlertActionLink,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Content,
  ContentVariants,
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Grid,
  GridItem,
  Hint,
  HintBody,
  Label,
  List,
  ListItem,
  Title,
} from '@patternfly/react-core';
import {
  ArrowRightIcon,
  AutomationIcon,
  CheckIcon,
  CloudIcon,
  ExternalLinkAltIcon,
  LockIcon,
  OutlinedCommentsIcon,
  RedhatIcon,
} from '@patternfly/react-icons';
import WebhooksIcon from './WebhooksIcon';
import IntegrationsDropdown from '../IntegrationsDropdown';
import CustomDataListItem from './CustomDataListItem';
import './overview.scss';
import { CLOUD_VENDOR, COMMUNICATIONS, REDHAT_VENDOR, REPORTING, WEBHOOKS } from '../../utilities/constants';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { bold } from '../../utilities/intlShared';
import { useFlag } from '@unleash/proxy-client-react';

const VIEW_DOCUMENTATION =
  'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/configuring_notifications_on_the_red_hat_hybrid_cloud_console/assembly-intro_notifications';

const Overview = () => {
  const { quickStarts } = useChrome();
  const navigate = useNavigate();
  const intl = useIntl();

  const hasSourcesPermissions = useSelector(({ user }) => user?.writePermissions);
  const hasIntegrationsPermissions = useSelector(({ user }) => user?.integrationsEndpointsPermissions);
  const isPagerDutyEnabled = useFlag('platform.integrations.pager-duty');

  const data = [
    {
      isExpanded: true,
      icon: <OutlinedCommentsIcon className="pf-v6-u-primary-color-100" />,
      title: intl.formatMessage(
        {
          id: 'integrations.overview.dataListItemTitle1',
          defaultMessage: '<b>Communication integrations</b> (Microsoft Teams, Google Chat, Slack)',
        },
        {
          b: bold,
        },
      ),
      actionTitle: intl.formatMessage({
        id: 'integrations.overview.dataListItemActionTitle1',
        defaultMessage: 'Set up communication integration',
      }),
      action: COMMUNICATIONS,
      content: intl.formatMessage({
        id: 'integrations.overview.dataListItemContent1',
        defaultMessage:
          'Receive event notifications in your preferred communications application by connecting the Hybrid Cloud Console with Microsoft Teams, Google Chat, or Slack.',
      }),
      learnMoreLink:
        'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html-single/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/index#assembly-integrating-comms_integrations',
    },
    {
      isExpanded: false,
      icon: <AutomationIcon className="pf-v6-u-primary-color-100" />,
      title: intl.formatMessage(
        {
          id: 'integrations.overview.dataListItemTitle2',
          defaultMessage: `<b>Reporting and automation integrations</b> (Event-Driven Ansible, ${
            isPagerDutyEnabled ? 'PagerDuty' : null
          }, ServiceNow, Splunk) `,
        },
        {
          b: bold,
        },
      ),
      actionTitle: intl.formatMessage({
        id: 'integrations.overview.dataListItemActionTitle2',
        defaultMessage: 'Set up reporting and automation integration',
      }),
      action: REPORTING,
      content: intl.formatMessage({
        id: 'integrations.overview.dataListItemContent2',
        defaultMessage: `Receive and manage event notifications where you manage other sources of data by connecting the Hybrid Cloud Console with Event-Driven Ansible, ${
          isPagerDutyEnabled ? 'PagerDuty' : null
        }, ServiceNow, or Splunk.`,
      }),
      learnMoreLink:
        'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html-single/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/index#assembly-integrating-reporting_integrating-communications',
    },
    {
      isExpanded: false,
      icon: <WebhooksIcon className="pf-v6-u-primary-color-100" />,
      title: intl.formatMessage(
        {
          id: 'integrations.overview.dataListItemTitle3',
          defaultMessage: '<b>Webhook integrations</b>',
        },
        {
          b: bold,
        },
      ),
      actionTitle: intl.formatMessage({
        id: 'integrations.overview.dataListItemActionTitle3',
        defaultMessage: 'Set up webhook integration',
      }),
      action: WEBHOOKS,
      content: intl.formatMessage({
        id: 'integrations.overview.dataListItemContent3',
        defaultMessage:
          'Receive Hybrid Cloud Console event notifications in third-party applications where native integration is not available by configuring a webhook integration.',
      }),
      learnMoreLink:
        'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html-single/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/index#assembly-configuring-integration-with-webhooks_integrations',
    },
    {
      isExpanded: false,
      icon: <CloudIcon className="pf-v6-u-primary-color-100" />,
      title: intl.formatMessage(
        {
          id: 'integrations.overview.dataListItemTitle4',
          defaultMessage: '<b>Cloud provider integrations</b> (Amazon Web Services, Azure, Google Cloud Platform)',
        },
        {
          b: bold,
        },
      ),
      actionTitle: intl.formatMessage({
        id: 'integrations.overview.dataListItemActionTitle4',
        defaultMessage: 'Configure cloud provider integration',
      }),
      action: CLOUD_VENDOR,
      content: intl.formatMessage({
        id: 'integrations.overview.dataListItemContent4',
        defaultMessage:
          'To use public cloud provider data with Hybrid Cloud Console services, connect your Amazon Web Services (AWS), Google Cloud or Microsoft Azure account to the Hybrid Cloud Console.',
      }),
      learnMoreLink:
        'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/configuring_cloud_integrations_for_red_hat_services/about-cloud-integrations_crc-cloud-integrations',
    },
    {
      isExpanded: false,
      icon: <RedhatIcon className="pf-v6-u-primary-color-100" />,
      title: intl.formatMessage(
        {
          id: 'integrations.overview.dataListItemTitle5',
          defaultMessage: '<b>Red Hat integrations</b> (OpenShift Container Platform)',
        },
        {
          b: bold,
        },
      ),
      actionTitle: intl.formatMessage({
        id: 'integrations.overview.dataListItemActionTitle5',
        defaultMessage: 'Configure Red Hat integration',
      }),
      action: REDHAT_VENDOR,
      content: intl.formatMessage({
        id: 'integrations.overview.dataListItemContent5',
        defaultMessage:
          'Manage your cloud costs with Hybrid Cloud Console services by connecting your Red Hat OpenShift Container Platform environment.',
      }),
      learnMoreLink:
        'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/configuring_cloud_integrations_for_red_hat_services/redhat-cloud-integrations_crc-cloud-integrations',
    },
  ];

  const handleActivateQuickstart = () => {
    quickStarts.activateQuickstart('integrations-slack-notifs-qs');
  };

  return (
    <React.Fragment>
      <Card className="pf-v6-u-mb-lg">
        <Grid hasGutter>
          <GridItem sm={12} md={6} lg={8}>
            <CardTitle>
              <Title headingLevel="h2">
                {intl.formatMessage({
                  id: 'integrations.overview.heroTitle',
                  defaultMessage: 'Get started with Integrations',
                })}
              </Title>
            </CardTitle>
            <CardBody>
              <Content>
                <Content component={ContentVariants.p} className="pf-v6-u-mb-md">
                  {intl.formatMessage({
                    id: 'integrations.overview.heroParagraph',
                    defaultMessage:
                      'Notifications and integrations services work together to transmit messages to third-party application endpoints, such as instant messaging platforms and external ticketing systems, when triggering events occur.',
                  })}
                </Content>
              </Content>
              <Title headingLevel="h4" className="pf-v6-u-mb-sm">
                {intl.formatMessage({
                  id: 'integrations.overview.heroListTitle',
                  defaultMessage: 'Key features',
                })}
              </Title>
              <List isPlain>
                <ListItem icon={<CheckIcon />}>
                  {intl.formatMessage({
                    id: 'integrations.overview.heroListItem1',
                    defaultMessage: 'Create integrations and configure notifications to integrate with third-party applications',
                  })}
                </ListItem>
                <ListItem icon={<CheckIcon />}>
                  {intl.formatMessage({
                    id: 'integrations.overview.heroListItem2',
                    defaultMessage: 'Manage your integrations and troubleshoot broken connections',
                  })}
                </ListItem>
              </List>
            </CardBody>
            <CardFooter>
              {hasSourcesPermissions || hasIntegrationsPermissions ? (
                <IntegrationsDropdown
                  popperProps={{
                    appendTo: document.body,
                    position: 'left',
                  }}
                />
              ) : (
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
                    <React.Fragment>
                      <AlertActionLink
                        component="a"
                        href="https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/getting_started_with_the_red_hat_hybrid_cloud_console/hcc-help-options_getting-started#virtual-assistant_getting-started"
                        target="_blank"
                      >
                        {intl.formatMessage({
                          id: 'integrations.overview.alertLink',
                          defaultMessage: 'Learn about requesting access via the Virtual Assistant',
                        })}
                      </AlertActionLink>
                    </React.Fragment>
                  }
                >
                  <Content>
                    <Content component={ContentVariants.p}>
                      {intl.formatMessage({
                        id: 'integrations.overview.alertParagraph',
                        defaultMessage:
                          'You do not have the permissions for integration management. Contact your organization administrator if you need these permissions updated.',
                      })}
                    </Content>
                  </Content>
                </Alert>
              )}
            </CardFooter>
          </GridItem>
          <GridItem md={6} lg={4} className="pf-v6-u-display-none pf-v6-u-display-block-on-md pf-c-card__cover-image"></GridItem>
        </Grid>
      </Card>

      {hasSourcesPermissions || hasIntegrationsPermissions ? (
        <Hint className="pf-v6-u-mb-lg">
          <HintBody>
            <span className="pf-v6-u-font-weight-bold">
              {intl.formatMessage({
                id: 'integrations.overview.hintTextBold',
                defaultMessage: 'Already set up your integrations?',
              })}
            </span>{' '}
            {intl.formatMessage({
              id: 'integrations.overview.hintText1',
              defaultMessage: 'As a next step, you can',
            })}{' '}
            <Button
              variant="link"
              onClick={(e) => {
                e.preventDefault();
                navigate('/settings/notifications/configure-events');
              }}
              isInline
            >
              {intl.formatMessage({
                id: 'integrations.overview.hintLink',
                defaultMessage: 'enable the notifications',
              })}
            </Button>{' '}
            {intl.formatMessage({
              id: 'integrations.overview.hintText2',
              defaultMessage: 'of your choice to alert you via integrations.',
            })}
          </HintBody>
        </Hint>
      ) : null}

      <Title headingLevel="h2" className="pf-v6-u-mb-md">
        {intl.formatMessage({
          id: 'integrations.overview.titleIntegrationTypes',
          defaultMessage: 'Integration types',
        })}
      </Title>
      <DataList aria-label="Integration types" className="pf-v6-u-mb-lg">
        {data.map((item, index) => (
          <CustomDataListItem
            key={index}
            initialExpanded={item.isExpanded}
            icon={item.icon}
            title={item.title}
            actionTitle={hasSourcesPermissions || hasIntegrationsPermissions ? item.actionTitle : null}
            action={item.action}
            content={item.content}
            learnMoreLink={item.learnMoreLink}
          />
        ))}
      </DataList>

      <Title headingLevel="h2" className="pf-v6-u-mb-md">
        {intl.formatMessage({
          id: 'integrations.overview.titleRecommendedContent',
          defaultMessage: 'Recommended content',
        })}
      </Title>
      <DataList aria-label="Recommended content">
        <DataListItem aria-labelledby="configure-notif-int">
          <DataListItemRow>
            <DataListItemCells
              dataListCells={[
                <DataListCell key="title" width={2}>
                  <span id="configure-notif-int">
                    {intl.formatMessage({
                      id: 'integrations.overview.recommendedContentTableTitle1',
                      defaultMessage: 'Configuring notifications and integrations',
                    })}
                  </span>
                </DataListCell>,
                <DataListCell key="label" width={1}>
                  <Label color="orange">
                    {intl.formatMessage({
                      id: 'integrations.overview.recommendedContentTableLabel1',
                      defaultMessage: 'Documentation',
                    })}
                  </Label>
                </DataListCell>,
                <DataListCell key="action" className="pf-v6-u-display-flex pf-v6-u-justify-content-flex-end">
                  <Button
                    component="a"
                    href={VIEW_DOCUMENTATION}
                    target="_blank"
                    variant="link"
                    icon={<ExternalLinkAltIcon />}
                    iconPosition="end"
                  >
                    {intl.formatMessage({
                      id: 'integrations.overview.recommendedContentTableLink1',
                      defaultMessage: 'View documentation',
                    })}
                  </Button>
                </DataListCell>,
              ]}
            />
          </DataListItemRow>
        </DataListItem>
        <DataListItem aria-labelledby="configure-console-int-slack">
          <DataListItemRow>
            <DataListItemCells
              dataListCells={[
                <DataListCell key="title" width={2}>
                  <span>
                    {intl.formatMessage({
                      id: 'integrations.overview.recommendedContentTableTitle2',
                      defaultMessage: 'Configuring console notifications in Slack',
                    })}
                  </span>
                </DataListCell>,
                <DataListCell key="label" width={1}>
                  <Label color="green">
                    {intl.formatMessage({
                      id: 'integrations.overview.recommendedContentTableLabel2',
                      defaultMessage: 'Quick start',
                    })}
                  </Label>
                </DataListCell>,
                <DataListCell key="action" className="pf-v6-u-display-flex pf-v6-u-justify-content-flex-end">
                  <Button icon={<ArrowRightIcon />} variant="link" onClick={handleActivateQuickstart} isInline>
                    {intl.formatMessage({
                      id: 'integrations.overview.recommendedContentTableLink2',
                      defaultMessage: 'Begin Quick start',
                    })}
                  </Button>
                </DataListCell>,
              ]}
            />
          </DataListItemRow>
        </DataListItem>
      </DataList>
      <Link to={'/settings/learning-resources'}>
        <Button variant="link" className="pf-v6-u-mb-lg" isInline>
          {intl.formatMessage({
            id: 'integrations.overview.viewAllLearningResources',
            defaultMessage: 'View all Settings learning resources',
          })}
        </Button>
      </Link>
    </React.Fragment>
  );
};

export default React.memo(Overview);
