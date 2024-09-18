import React from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useIntl } from 'react-intl';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  DataList,
  Grid,
  GridItem,
  Hint,
  HintBody,
  Label,
  List,
  ListItem,
  Text,
  TextContent,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Tr } from '@patternfly/react-table';
import {
  ArrowRightIcon,
  AutomationIcon,
  CheckIcon,
  CloudIcon,
  ExternalLinkAltIcon,
  OutlinedCommentsIcon,
  RedhatIcon,
} from '@patternfly/react-icons';
import WebhooksIcon from './WebhooksIcon';
import IntegrationsDropdown from '../IntegrationsDropdown';
import CustomDataListItem from './CustomDataListItem';
import './overview.scss';
import { CLOUD_VENDOR, COMMUNICATIONS, REDHAT_VENDOR, REPORTING, WEBHOOKS } from '../../utilities/constants';
import { Link, useNavigate } from 'react-router-dom';

const Overview = () => {
  const { quickStarts } = useChrome();
  const navigate = useNavigate();
  const intl = useIntl();

  const VIEW_DOCUMENTATION =
    'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/configuring_notifications_on_the_red_hat_hybrid_cloud_console/assembly-intro_notifications';

  const data = [
    {
      isExpanded: true,
      icon: <OutlinedCommentsIcon className="pf-u-primary-color-100" />,
      title: `${intl.formatMessage({
        id: 'integrations.overview.dataListItemTitle1',
        defaultMessage: 'Set up communication integrations',
      })}`,
      actionTitle: `${intl.formatMessage({
        id: 'integrations.overview.dataListItemActionTitle1',
        defaultMessage: 'Set up communication integrations',
      })}`,
      action: COMMUNICATIONS,
      content: `${intl.formatMessage({
        id: 'integrations.overview.dataListItemContent1',
        defaultMessage:
          'Receive event notifications in your preferred communications application by connecting the Hybrid Cloud Console with Microsoft Teams, Google Chat, or Slack.',
      })}`,
      learnMoreLink:
        'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/index',
    },
    {
      isExpanded: false,
      icon: <AutomationIcon className="pf-u-primary-color-100" />,
      title: `${intl.formatMessage({
        id: 'integrations.overview.dataListItemTitle2',
        defaultMessage: 'Set up reporting and automation integrations',
      })}`,
      actionTitle: `${intl.formatMessage({
        id: 'integrations.overview.dataListItemActionTitle2',
        defaultMessage: 'Set up reporting and automation integrations',
      })}`,
      action: REPORTING,
      content: `${intl.formatMessage({
        id: 'integrations.overview.dataListItemContent2',
        defaultMessage:
          'Receive and manage event notifications where you manage other sources of data by connecting the Hybrid Cloud Console with Splunk, ServiceNow, or Event-Driven Ansible.',
      })}`,
      learnMoreLink:
        'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/index',
    },
    {
      isExpanded: false,
      icon: <WebhooksIcon className="pf-u-primary-color-100" />,
      title: `${intl.formatMessage({
        id: 'integrations.overview.dataListItemTitle3',
        defaultMessage: 'Set up webhook integrations',
      })}`,
      actionTitle: `${intl.formatMessage({
        id: 'integrations.overview.dataListItemActionTitle3',
        defaultMessage: 'Set up webhook integrations',
      })}`,
      action: WEBHOOKS,
      content: `${intl.formatMessage({
        id: 'integrations.overview.dataListItemContent3',
        defaultMessage:
          'Receive Hybrid Cloud Console event notifications in third-party applications where native integration is not available by configuring a webhook integration.',
      })}`,
      learnMoreLink:
        'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html-single/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/index#assembly-configuring-integration-with-webhooks_integrations',
    },
    {
      isExpanded: false,
      icon: <CloudIcon className="pf-u-primary-color-100" />,
      title: `${intl.formatMessage({
        id: 'integrations.overview.dataListItemTitle4',
        defaultMessage: 'Connect to cloud providers',
      })}`,
      actionTitle: `${intl.formatMessage({
        id: 'integrations.overview.dataListItemActionTitle4',
        defaultMessage: 'Connect to cloud providers',
      })}`,
      action: CLOUD_VENDOR,
      content: `${intl.formatMessage({
        id: 'integrations.overview.dataListItemContent4',
        defaultMessage:
          'To use public cloud provider data with Hybrid Cloud Console services, connect your Amazon Web Services (AWS), Google Cloud, Microsoft Azure, or Oracle Cloud account to the Hybrid Cloud Console.',
      })}`,
      learnMoreLink:
        'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/configuring_cloud_integrations_for_red_hat_services/about-cloud-integrations_crc-cloud-integrations',
    },
    {
      isExpanded: false,
      icon: <RedhatIcon className="pf-u-primary-color-100" />,
      title: `${intl.formatMessage({
        id: 'integrations.overview.dataListItemTitle5',
        defaultMessage: 'Connect with Red Hat platforms',
      })}`,
      actionTitle: `${intl.formatMessage({
        id: 'integrations.overview.dataListItemActionTitle5',
        defaultMessage: 'Connect with Red Hat platforms',
      })}`,
      action: REDHAT_VENDOR,
      content: `${intl.formatMessage({
        id: 'integrations.overview.dataListItemContent5',
        defaultMessage:
          'Manage your cloud costs with Hybrid Cloud Console services by connecting your Red Hat OpenShift Container Platform environment.',
      })}`,
      learnMoreLink:
        'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/configuring_cloud_integrations_for_red_hat_services/redhat-cloud-integrations_crc-cloud-integrations',
    },
  ];

  const handleActivateQuickstart = () => {
    quickStarts.activateQuickstart('integrations-slack-notifs-qs');
  };

  return (
    <React.Fragment>
      <Card className="pf-u-mb-lg">
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
              <TextContent>
                <Text component={TextVariants.p} className="pf-u-mb-md">
                  {intl.formatMessage({
                    id: 'integrations.overview.heroParagraph',
                    defaultMessage:
                      'Notifications and integrations services work together to transmit messages to third-party application endpoints, such as instant messaging platforms and external ticketing systems, when triggering events occur.',
                  })}
                </Text>
              </TextContent>
              <Title headingLevel="h4" className="pf-u-mb-sm">
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
              <IntegrationsDropdown
                popperProps={{
                  appendTo: document.body,
                  position: 'left',
                }}
              />
            </CardFooter>
          </GridItem>
          <GridItem md={6} lg={4} className="pf-u-display-none pf-u-display-block-on-md pf-c-card__cover-image"></GridItem>
        </Grid>
      </Card>

      <Hint className="pf-u-mb-lg">
        <HintBody>
          <span className="pf-u-font-weight-bold">
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

      <Title headingLevel="h2" className="pf-u-mb-md">
        {intl.formatMessage({
          id: 'integrations.overview.titleIntegrationTypes',
          defaultMessage: 'Integration types',
        })}
      </Title>
      <DataList aria-label="Integration types" className="pf-u-mb-lg">
        {data.map((item, index) => (
          <CustomDataListItem
            key={index}
            initialExpanded={item.isExpanded}
            icon={item.icon}
            title={item.title}
            actionTitle={item.actionTitle}
            action={item.action}
            content={item.content}
            learnMoreLink={item.learnMoreLink}
          />
        ))}
      </DataList>

      <Title headingLevel="h2" className="pf-u-mb-md">
        {intl.formatMessage({
          id: 'integrations.overview.titleRecommendedContent',
          defaultMessage: 'Recommended content',
        })}
      </Title>
      <Table aria-label="Recommended content" className="pf-u-mb-lg">
        <Tbody>
          <Tr>
            <Td>
              {intl.formatMessage({
                id: 'integrations.overview.recommendedContentTableTitle1',
                defaultMessage: 'Configuring notifications and integrations',
              })}
            </Td>
            <Td>
              <Label color="orange">
                {intl.formatMessage({
                  id: 'integrations.overview.recommendedContentTableLabel1',
                  defaultMessage: 'Documentation',
                })}
              </Label>
            </Td>
            <Td className="pf-v5-u-text-align-right">
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
            </Td>
          </Tr>
          <Tr>
            <Td>
              {intl.formatMessage({
                id: 'integrations.overview.recommendedContentTableTitle2',
                defaultMessage: 'Configuring console notifications in Slack',
              })}
            </Td>
            <Td>
              <Label color="green">
                {intl.formatMessage({
                  id: 'integrations.overview.recommendedContentTableLabel2',
                  defaultMessage: 'Quick start',
                })}
              </Label>
            </Td>
            <Td className="pf-v5-u-text-align-right">
              <Button variant="link" onClick={handleActivateQuickstart} isInline>
                {intl.formatMessage({
                  id: 'integrations.overview.recommendedContentTableLink2',
                  defaultMessage: 'Begin Quick start',
                })}{' '}
                <ArrowRightIcon />
              </Button>
            </Td>
          </Tr>
        </Tbody>
      </Table>
      <Link to={'/settings/learning-resources'}>
        <Button variant="link" className="pf-u-mb-lg" isInline>
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
