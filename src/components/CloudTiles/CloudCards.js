/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Grid } from '@patternfly/react-core/dist/js/layouts/Grid/Grid';
import { GridItem } from '@patternfly/react-core/dist/js/layouts/Grid/GridItem';
import { Card } from '@patternfly/react-core/dist/js/components/Card/Card';
import { CardBody } from '@patternfly/react-core/dist/js/components/Card/CardBody';
import { CardTitle } from '@patternfly/react-core/dist/js/components/Card/CardTitle';
import { CardHeader } from '@patternfly/react-core/dist/js/components/Card/CardHeader';
import { CardExpandableContent } from '@patternfly/react-core/dist/js/components/Card/CardExpandableContent';
import { Text } from '@patternfly/react-core/dist/js/components/Text/Text';

import PlusIcon from '@patternfly/react-icons/dist/js/icons/plus-icon';
import CloudTiles from './CloudTiles';
import ProvidersLink from './ProvidersLink';

const Point = ({ bold, text }) => (
  <div className="ins-c-sources__info-point">
    <Text component="span" className="pf-u-mr-sm">
      <PlusIcon fill="#EE0000" />
    </Text>
    <Text component="span">
      <b>{bold}</b>&nbsp;
      {text}
    </Text>
  </div>
);

Point.propTypes = {
  bold: PropTypes.node.isRequired,
  text: PropTypes.node.isRequired,
};

const PREFIX = insights.chrome.isBeta() ? 'beta/' : '';

const GOLDIMAGES_HREF = 'https://access.redhat.com/management/cloud';
const SUBWATCH_HREF = `/${PREFIX}subscriptions`;

export const CLOUD_CARDS_KEY = 'ins-c-sources__cloud_cards_expanded';

const CloudCards = (props) => {
  const [isExpanded, setExpanded] = useState(() => {
    const session = sessionStorage.getItem(CLOUD_CARDS_KEY);

    return session ? session === 'true' : true;
  });
  const intl = useIntl();

  useEffect(() => {
    sessionStorage.setItem(CLOUD_CARDS_KEY, isExpanded);
  }, [isExpanded]);

  return (
    <Grid hasGutter className="pf-u-mb-lg pf-u-mt-md pf-u-mt-0-on-md">
      <GridItem md="6">
        <Card isExpanded={isExpanded} className="ins-c-sources__info-card">
          <CardHeader onExpand={() => setExpanded(!isExpanded)}>
            <CardTitle>{intl.formatMessage({ id: 'cloud.providers', defaultMessage: 'Certified cloud providers' })}</CardTitle>
          </CardHeader>
          <CardExpandableContent>
            <CardBody>
              <Text>
                {intl.formatMessage({
                  id: 'cloud.providersDescription',
                  defaultMessage: 'Add a source for following cloud providers.',
                })}
              </Text>
              <div className="center">
                <div className="pf-u-mt-md pf-u-mb-md">
                  <CloudTiles {...props} />
                </div>
                <ProvidersLink />
              </div>
            </CardBody>
          </CardExpandableContent>
        </Card>
      </GridItem>
      <GridItem md="6">
        <Card isExpanded={isExpanded} className="ins-c-sources__info-card">
          <CardHeader onExpand={() => setExpanded(!isExpanded)}>
            <CardTitle>
              {intl.formatMessage({ id: 'cloud.nowWhat', defaultMessage: 'I connected to cloud. Now what?' })}
            </CardTitle>
          </CardHeader>
          <CardExpandableContent>
            <CardBody>
              <Point
                bold={intl.formatMessage({ id: 'cloud.goldImages', defaultMessage: 'Cloud Images.' })}
                text={intl.formatMessage(
                  {
                    id: 'cloud.goldImagesDesc',
                    defaultMessage: '<a>Cloud Access</a> unlocks automatic access to Red Hat Gold Images.',
                  },
                  {
                    a: (chunks) => (
                      <Text key="link" component="a" href={GOLDIMAGES_HREF} target="_blank" rel="noopener noreferrer">
                        {chunks}
                      </Text>
                    ),
                  }
                )}
              />
              <Point
                bold={intl.formatMessage({ id: 'cloud.redhatInsights', defaultMessage: 'Red Hat Insights.' })}
                text={intl.formatMessage({
                  id: 'cloud.redhatInsightsDesc',
                  defaultMessage: 'Use RHEL instances in the cloud and gain other value-add services.',
                })}
              />
              <Point
                bold={intl.formatMessage({ id: 'cloud.subWatch', defaultMessage: 'Subscription Watch.' })}
                text={intl.formatMessage(
                  {
                    id: 'cloud.subWatchDesc',
                    defaultMessage: 'See precise usage reporting in <a>Subscription Watch.</a>',
                  },
                  {
                    a: (chunks) => (
                      <Text key="link" component="a" href={SUBWATCH_HREF} target="_blank" rel="noopener noreferrer">
                        {chunks}
                      </Text>
                    ),
                  }
                )}
              />
            </CardBody>
          </CardExpandableContent>
        </Card>
      </GridItem>
    </Grid>
  );
};

export default CloudCards;
