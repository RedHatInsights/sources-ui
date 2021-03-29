/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import {
  Grid,
  GridItem,
  Stack,
  StackItem,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  CardExpandableContent,
  Text,
  TextContent,
  Label,
} from '@patternfly/react-core';

import ArrowRightIcon from '@patternfly/react-icons/dist/esm/icons/arrow-right-icon';
import BuilderImageIcon from '@patternfly/react-icons/dist/esm/icons/builder-image-icon';
import SubWatchIcon from './SubWatchIcon';

const PREFIX = insights.chrome.isBeta() ? 'beta/' : '';

const GOLD_IMAGES_AWS =
  'https://access.redhat.com/documentation/en-us/red_hat_subscription_management/1/html/red_hat_cloud_access_reference_guide/cloud-access-gold-images_cloud-access#using-gold-images-on-aws_cloud-access';
const GOLD_IMAGES_AZURE =
  'https://access.redhat.com/documentation/en-us/red_hat_subscription_management/1/html/red_hat_cloud_access_reference_guide/cloud-access-gold-images_cloud-access#using-gold-images-on-azure_cloud-access';
const GOLD_IMAGES_MORE =
  'https://access.redhat.com/documentation/en-us/red_hat_subscription_management/1/html/red_hat_cloud_access_reference_guide/cloud-access-gold-images_cloud-access';
const INSIGHTS_REF = 'https://www.redhat.com/en/technologies/management/insights';
const INSIGHTS_SERVICES = `/${PREFIX}settings/sed`;
const SUBWATCH_HREF = `/${PREFIX}subscriptions`;
const SUBWATCH_MORE_HREF = 'https://access.redhat.com/products/subscription-central';

export const CLOUD_CARDS_KEY = 'ins-c-sources__cloud_cards_expanded';

const INSIGHTS_ICON = `/${PREFIX}apps/landing/fonts/Insights.svg`;

const CloudCards = () => {
  const [isExpanded, setExpanded] = useState(() => {
    const session = sessionStorage.getItem(CLOUD_CARDS_KEY);

    return session ? session === 'true' : true;
  });
  const intl = useIntl();

  useEffect(() => {
    sessionStorage.setItem(CLOUD_CARDS_KEY, isExpanded);
  }, [isExpanded]);

  return (
    <Card isExpanded={isExpanded} className="pf-u-mb-lg pf-u-mt-md pf-u-mt-0-on-md ins-c-sources__info-card">
      <CardHeader onExpand={() => setExpanded(!isExpanded)}>
        <CardTitle>{intl.formatMessage({ id: 'cloud.nowWhat', defaultMessage: 'I connected to cloud. Now what?' })}</CardTitle>
      </CardHeader>
      <CardExpandableContent>
        <CardBody>
          <TextContent>
            <Grid hasGutter>
              <GridItem md={4}>
                <Stack>
                  <StackItem className="pf-u-mb-sm">
                    <Label color="orange" icon={<BuilderImageIcon fill="#F4C145" />}>
                      {intl.formatMessage({ id: 'cloud.goldImages', defaultMessage: 'Use Gold Images' })}
                    </Label>
                  </StackItem>
                  <StackItem isFilled>
                    <Text className="text pf-u-mb-sm">
                      {intl.formatMessage({
                        id: 'cloud.goldImages.description',
                        defaultMessage:
                          'Connecting to Amazon Web Services or Microsoft Azure unlocks automatic access to Red Hat Gold Images. View Gold Images in your provider console.',
                      })}
                    </Text>
                    <Text className="text" component="a" href={GOLD_IMAGES_AWS} target="_blank" rel="noopener noreferrer">
                      {intl.formatMessage({
                        id: 'cloud.goldImages.awsLink',
                        defaultMessage: 'Use Red Hat Gold Images in AWS',
                      })}
                    </Text>
                    <br />
                    <Text className="text" component="a" href={GOLD_IMAGES_AZURE} target="_blank" rel="noopener noreferrer">
                      {intl.formatMessage({
                        id: 'cloud.goldImages.azureLink',
                        defaultMessage: 'Use Red Hat Gold Images in Microsoft Azure',
                      })}
                    </Text>
                  </StackItem>
                  <StackItem className="pf-u-mt-lg">
                    <Text className="text" component="a" href={GOLD_IMAGES_MORE} target="_blank" rel="noopener noreferrer">
                      {intl.formatMessage({
                        id: 'cloud.goldImages.moreLink',
                        defaultMessage: 'Learn more about Red Hat Gold Images',
                      })}
                      <ArrowRightIcon className="pf-u-ml-sm" />
                    </Text>
                  </StackItem>
                </Stack>
              </GridItem>
              <GridItem md={4}>
                <Stack>
                  <StackItem className="pf-u-mb-sm">
                    <Label color="red" icon={<img src={INSIGHTS_ICON} fill="#EE0000" className="custom-icon" />}>
                      {intl.formatMessage({ id: 'cloud.insights', defaultMessage: 'Explore Red Hat Insights' })}
                    </Label>
                  </StackItem>
                  <StackItem isFilled>
                    <Text className="text pf-u-mb-sm">
                      {intl.formatMessage({
                        id: 'cloud.insights.description',
                        defaultMessage:
                          'Use RHEL instances in the cloud and gain other value-add services, such as predictive analytics.',
                      })}
                    </Text>
                    <Text className="text" component="a" href={INSIGHTS_REF} target="_blank" rel="noopener noreferrer">
                      {intl.formatMessage({
                        id: 'cloud.insights.insightsLinkt',
                        defaultMessage: 'Learn more about Red Hat Insights',
                      })}
                    </Text>
                  </StackItem>
                  <StackItem className="pf-u-mt-lg">
                    <Text className="text" component="a" href={INSIGHTS_SERVICES} target="_blank" rel="noopener noreferrer">
                      {intl.formatMessage({
                        id: 'cloud.insights.moreLink',
                        defaultMessage: 'Enable additional Insights services',
                      })}
                      <ArrowRightIcon className="pf-u-ml-sm" />
                    </Text>
                  </StackItem>
                </Stack>
              </GridItem>
              <GridItem md={4}>
                <Stack>
                  <StackItem className="pf-u-mb-sm">
                    <Label color="purple" icon={<SubWatchIcon className="custom-icon" />}>
                      {intl.formatMessage({ id: 'cloud.subwatch', defaultMessage: 'Track usage with Subscription Watch' })}
                    </Label>
                  </StackItem>
                  <StackItem isFilled>
                    <Text className="text pf-u-mb-sm">
                      {intl.formatMessage({
                        id: 'cloud.subwatch.description',
                        defaultMessage:
                          'See precise RHEL subscription usage information across your hybrid cloud infrastructure.',
                      })}
                    </Text>
                    <Text className="text" component="a" href={SUBWATCH_MORE_HREF} target="_blank" rel="noopener noreferrer">
                      {intl.formatMessage({
                        id: 'cloud.subwatch.learnMore',
                        defaultMessage: 'Learn more about Subscription Watch',
                      })}
                    </Text>
                  </StackItem>
                  <StackItem className="pf-u-mt-lg">
                    <Text className="text" component="a" href={SUBWATCH_HREF} target="_blank" rel="noopener noreferrer">
                      {intl.formatMessage({
                        id: 'cloud.subwatch.goTo',
                        defaultMessage: 'Go to Subscription Watch',
                      })}
                      <ArrowRightIcon className="pf-u-ml-sm" />
                    </Text>
                  </StackItem>
                </Stack>
              </GridItem>
            </Grid>
          </TextContent>
        </CardBody>
      </CardExpandableContent>
    </Card>
  );
};

export default React.memo(CloudCards);
