/* eslint-disable react/display-name */
import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Card } from '@patternfly/react-core/dist/js/components/Card/Card';
import { CardBody } from '@patternfly/react-core/dist/js/components/Card/CardBody';
import { CardTitle } from '@patternfly/react-core/dist/js/components/Card/CardTitle';
import { CardFooter } from '@patternfly/react-core/dist/js/components/Card/CardFooter';
import { Text } from '@patternfly/react-core/dist/js/components/Text/Text';

import CloudTiles from './CloudTiles';
import ProvidersLink from './ProvidersLink';

const CLOUD_CATALOG_HREF = 'https://catalog.redhat.com/cloud';

const CloudEmptyState = ({ setSelectedType }) => {
  const intl = useIntl();

  return (
    <Card className="pf-m-selectable pf-m-selected ins-c-sources__cloud-empty-state-card pf-u-mt-md pf-u-mt-0-on-md">
      <CardTitle>
        {intl.formatMessage({
          id: 'cloud.emptystate.cardTitle',
          defaultMessage: 'Get started by connecting to your public clouds',
        })}
      </CardTitle>
      <CardBody>
        <Text>
          {intl.formatMessage({
            id: 'cloud.emptystate.cardDescription',
            defaultMessage: 'Choose a provider to begin.',
          })}
        </Text>
        <div className="provider-tiles pf-u-mt-md pf-u-mb-lg">
          <CloudTiles setSelectedType={setSelectedType} />
        </div>
      </CardBody>
      <CardFooter className="cloud-footer">
        <ProvidersLink />
        <Text className="catalog-link pf-u-mt-md">
          {intl.formatMessage(
            {
              id: 'cloud.emptystate.catalogLink',
              defaultMessage: 'Not set up with a Cloud provider? <a>Find a Cloud & Service Provider with Red Hat Ecosystem</a>',
            },
            {
              a: (chunks) => (
                <Text key="link" component="a" href={CLOUD_CATALOG_HREF} target="_blank" rel="noopener noreferrer">
                  {chunks}
                </Text>
              ),
            }
          )}
        </Text>
      </CardFooter>
    </Card>
  );
};

CloudEmptyState.propTypes = {
  setSelectedType: PropTypes.func.isRequired,
};

export default CloudEmptyState;
