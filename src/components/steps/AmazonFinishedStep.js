import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Alert,
  Bullseye,
  Button,
  Content,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateVariant,
  Grid,
  GridItem,
  Icon,
  Title,
} from '@patternfly/react-core';

import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const AwsLink = ({ href, children }) => (
  <React.Fragment>
    <Icon className="pf-v6-u-mr-sm" status="success">
      <CheckCircleIcon />
    </Icon>
    <Content component="a" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </Content>
  </React.Fragment>
);

AwsLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const GOLDIMAGES_HREF = 'https://access.redhat.com/management/cloud';
const LEARNMORE_HREF = 'https://access.redhat.com/public-cloud/aws';

const AmazonFinishedStep = ({ onClose }) => {
  const intl = useIntl();
  const { isBeta } = useChrome();
  const PREFIX = isBeta() ? 'preview/' : '';

  const SUBWATCH_HREF = `/${PREFIX}subscriptions`;
  const INSIGHTS_HREF = `/${PREFIX}insights`;
  const COST_HREF = `/${PREFIX}cost-management`;

  return (
    <Fragment>
      <Alert
        variant="info"
        isInline
        title={intl.formatMessage({ id: 'aws.alertTitle', defaultMessage: 'Allow 24 hours for full activation' })}
      >
        {intl.formatMessage({
          id: 'aws.alertDescription',
          defaultMessage: 'Manage connections for this integration at any time in Settings > Integrations.',
        })}
      </Alert>
      <Bullseye>
        <EmptyState
          titleText={
            <Title headingLevel="h2" size="xl" className="pf-v6-u-mt-xl">
              {intl.formatMessage({ id: 'aws.successTitle', defaultMessage: 'Amazon Web Services connection established' })}
            </Title>
          }
          icon={CheckCircleIcon}
          variant={EmptyStateVariant.full}
          className="pf-v6-u-mt-md"
        >
          <EmptyStateBody>
            {intl.formatMessage({
              id: 'aws.successDescription',
              defaultMessage: 'Discover the benefits of your connection or exit to manage your new integration.',
            })}
            <Grid hasGutter className="src-c-aws-grid pf-v6-u-mt-md">
              <GridItem md="6">
                <AwsLink href={GOLDIMAGES_HREF}>
                  {intl.formatMessage({ id: 'aws.goldImages', defaultMessage: 'View enabled AWS gold images' })}
                </AwsLink>
              </GridItem>
              <GridItem md="6">
                <AwsLink href={SUBWATCH_HREF}>
                  {intl.formatMessage({ id: 'aws.subwtachUsage', defaultMessage: 'Subscription Watch usage' })}
                </AwsLink>
              </GridItem>
              <GridItem md="6">
                <AwsLink href={INSIGHTS_HREF}>
                  {intl.formatMessage({ id: 'aws.insights', defaultMessage: 'Get started with Red Hat Insights' })}
                </AwsLink>
              </GridItem>
              <GridItem md="6">
                <AwsLink href={COST_HREF}>
                  {intl.formatMessage({ id: 'aws.costLink', defaultMessage: 'Cost Management reporting' })}
                </AwsLink>
              </GridItem>
            </Grid>
          </EmptyStateBody>
          <Button variant="primary" onClick={onClose} className="pf-v6-u-mt-xl">
            {intl.formatMessage({ id: 'exit', defaultMessage: 'Exit' })}
          </Button>
          <EmptyStateActions>
            <Content component="a" href={LEARNMORE_HREF} target="_blank" rel="noopener noreferrer">
              {intl.formatMessage({ id: 'aws.learnMore', defaultMessage: 'Learn more about this Cloud' })}
            </Content>
          </EmptyStateActions>
        </EmptyState>
      </Bullseye>
    </Fragment>
  );
};

AmazonFinishedStep.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AmazonFinishedStep;
