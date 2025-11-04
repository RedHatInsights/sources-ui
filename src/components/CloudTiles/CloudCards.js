/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import {
  Card,
  CardBody,
  CardExpandableContent,
  CardHeader,
  CardTitle,
  Content,
  Grid,
  GridItem,
  Icon,
  Stack,
  StackItem,
} from '@patternfly/react-core';

import ArrowRightIcon from '@patternfly/react-icons/dist/esm/icons/arrow-right-icon';
import BuilderImageIcon from '@patternfly/react-icons/dist/esm/icons/builder-image-icon';
import TrendUpIcon from '@patternfly/react-icons/dist/esm/icons/trend-up-icon';
import ListIcon from '@patternfly/react-icons/dist/esm/icons/list-icon';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useFlag } from '@unleash/proxy-client-react';

export const CLOUD_CARDS_KEY = 'ins-c-sources__cloud_cards_expanded';
const GOLD_IMAGES_AWS =
  'https://docs.redhat.com/en/documentation/subscription_central/1-latest/html/red_hat_cloud_access_reference_guide/getting-started-with-ca_cloud-access#proc_new-ca-experience-option3_cloud-access';
const GOLD_IMAGES_AZURE =
  ' https://docs.redhat.com/en/documentation/subscription_central/1-latest/html/red_hat_cloud_access_reference_guide/getting-started-with-ca_cloud-access#proc_new-ca-experience-option3_cloud-access';
const GOLD_IMAGES_MORE =
  'https://docs.redhat.com/en/documentation/subscription_central/1-latest/html/red_hat_cloud_access_reference_guide/understanding-gold-images_cloud-access#getting-access-to-gold-images_cloud-access';
const INSIGHTS_REF = 'https://www.redhat.com/en/technologies/management/insights';
const SUBWATCH_MORE_HREF = 'https://access.redhat.com/products/subscription-central';

const CloudCards = () => {
  const [isExpanded, setExpanded] = useState(() => {
    const session = sessionStorage.getItem(CLOUD_CARDS_KEY);

    return session ? session === 'true' : true;
  });
  const intl = useIntl();
  const { isBeta } = useChrome();

  useEffect(() => {
    sessionStorage.setItem(CLOUD_CARDS_KEY, isExpanded);
  }, [isExpanded]);

  const PREFIX = isBeta() ? 'preview/' : '';

  const INSIGHTS_SERVICES = `/${PREFIX}settings/connector`;
  const SUBWATCH_HREF = `/${PREFIX}insights/subscriptions/rhel`;

  const lightspeedRebrand = useFlag('platform.lightspeed-rebrand');

  return (
    <Card isExpanded={isExpanded} className="pf-v6-u-mb-lg pf-v6-u-mt-md pf-v6-u-mt-0-on-md src-c-card-info">
      <CardHeader onExpand={() => setExpanded(!isExpanded)}>
        <CardTitle>{intl.formatMessage({ id: 'cloud.nowWhat', defaultMessage: 'I connected to cloud. Now what?' })}</CardTitle>
      </CardHeader>
      <CardExpandableContent>
        <CardBody>
          <Content>
            <Grid hasGutter>
              <GridItem md={4}>
                <Stack>
                  <StackItem className="pf-v6-u-mb-sm">
                    <Content component="p" className="pf-v6-u-font-size-sm pf-v6-u-font-weight-bold pf-v6-u-link-color-hover">
                      <Icon size="md" className="pf-v6-u-pl-sm pf-v6-u-pr-md">
                        <BuilderImageIcon color="#0066cc" aria-label="Builder image icon" />
                      </Icon>
                      {intl.formatMessage({ id: 'cloud.goldImages', defaultMessage: 'Use gold images' })}
                    </Content>
                  </StackItem>
                  <StackItem isFilled>
                    <Content component="p" className="text pf-v6-u-mb-sm">
                      {intl.formatMessage({
                        id: 'cloud.goldImages.description',
                        defaultMessage:
                          'Connecting to Amazon Web Services or Microsoft Azure unlocks automatic access to Red Hat gold images. View gold images in your provider console.',
                      })}
                    </Content>
                    <Content className="text" component="a" href={GOLD_IMAGES_AWS} target="_blank" rel="noopener noreferrer">
                      {intl.formatMessage({
                        id: 'cloud.goldImages.awsLink',
                        defaultMessage: 'Use Red Hat gold images on AWS',
                      })}
                    </Content>
                    <br />
                    <Content className="text" component="a" href={GOLD_IMAGES_AZURE} target="_blank" rel="noopener noreferrer">
                      {intl.formatMessage({
                        id: 'cloud.goldImages.azureLink',
                        defaultMessage: 'Use Red Hat gold images on Microsoft Azure',
                      })}
                    </Content>
                  </StackItem>
                  <StackItem className="pf-v6-u-mt-lg">
                    <Content className="text" component="a" href={GOLD_IMAGES_MORE} target="_blank" rel="noopener noreferrer">
                      {intl.formatMessage({
                        id: 'cloud.goldImages.moreLink',
                        defaultMessage: 'Learn more about Red Hat gold images',
                      })}
                      <ArrowRightIcon className="pf-v6-u-ml-sm" />
                    </Content>
                  </StackItem>
                </Stack>
              </GridItem>
              <GridItem md={4}>
                <Stack>
                  <StackItem className="pf-v6-u-mb-sm">
                    <Content component="p" className="pf-v6-u-font-size-sm pf-v6-u-font-weight-bold pf-v6-u-link-color-hover">
                      <Icon size="md" className="pf-v6-u-pl-sm pf-v6-u-pr-md">
                        <TrendUpIcon color="#0066cc" aria-label="Trend up icon" />
                      </Icon>
                      {intl.formatMessage({
                        id: lightspeedRebrand ? 'cloud.lightspeed' : 'cloud.insights',
                        defaultMessage: lightspeedRebrand ? 'Explore Red Hat Lightspeed' : 'Explore Red Hat Insights',
                      })}
                    </Content>
                  </StackItem>
                  <StackItem isFilled>
                    <Content component="p" className="text pf-v6-u-mb-sm">
                      {intl.formatMessage({
                        id: 'cloud.insights.description',
                        defaultMessage:
                          'Use RHEL instances in the cloud and gain other value-add services, such as predictive analytics.',
                      })}
                    </Content>
                    <Content className="text" component="a" href={INSIGHTS_REF} target="_blank" rel="noopener noreferrer">
                      {intl.formatMessage({
                        id: lightspeedRebrand ? 'cloud.lightspeed.lightspeedLink' : 'cloud.insights.insightsLinkt',
                        defaultMessage: lightspeedRebrand
                          ? 'Learn more about Red Hat Lightspeed'
                          : 'Learn more about Red Hat Insights',
                      })}
                    </Content>
                  </StackItem>
                  <StackItem className="pf-v6-u-mt-lg">
                    <Content className="text" component="a" href={INSIGHTS_SERVICES} target="_blank" rel="noopener noreferrer">
                      {intl.formatMessage({
                        id: lightspeedRebrand ? 'cloud.lightspeed.moreLink' : 'cloud.insights.moreLink',
                        defaultMessage: lightspeedRebrand
                          ? 'Enable additional Red Hat Lightspeed services'
                          : 'Enable additional Insights services',
                      })}
                      <ArrowRightIcon className="pf-v6-u-ml-sm" />
                    </Content>
                  </StackItem>
                </Stack>
              </GridItem>
              <GridItem md={4}>
                <Stack>
                  <StackItem className="pf-v6-u-mb-sm">
                    <Content component="p" className="pf-v6-u-font-size-sm pf-v6-u-font-weight-bold pf-v6-u-link-color-hover">
                      <Icon size="md" className="pf-v6-u-pl-sm pf-v6-u-pr-md">
                        <ListIcon color="#0066cc" aria-label="List icon" />
                      </Icon>
                      {intl.formatMessage({ id: 'cloud.subwatch', defaultMessage: 'Track usage with Subscriptions' })}
                    </Content>
                  </StackItem>
                  <StackItem isFilled>
                    <Content component="p" className="text pf-v6-u-mb-sm">
                      {intl.formatMessage({
                        id: 'cloud.subwatch.description',
                        defaultMessage:
                          'Use the Subscriptions service to monitor account-level summaries of your Red Hat subscription profile.',
                      })}
                    </Content>
                    <Content className="text" component="a" href={SUBWATCH_MORE_HREF} target="_blank" rel="noopener noreferrer">
                      {intl.formatMessage({
                        id: 'cloud.subwatch.learnMore',
                        defaultMessage: 'Learn more about Subscriptions',
                      })}
                    </Content>
                  </StackItem>
                  <StackItem className="pf-v6-u-mt-lg">
                    <Content className="text" component="a" href={SUBWATCH_HREF} target="_blank" rel="noopener noreferrer">
                      {intl.formatMessage({
                        id: 'cloud.subwatch.goTo',
                        defaultMessage: 'Go to Subscriptions',
                      })}
                      <ArrowRightIcon className="pf-v6-u-ml-sm" />
                    </Content>
                  </StackItem>
                </Stack>
              </GridItem>
            </Grid>
          </Content>
        </CardBody>
      </CardExpandableContent>
    </Card>
  );
};

export default React.memo(CloudCards);
