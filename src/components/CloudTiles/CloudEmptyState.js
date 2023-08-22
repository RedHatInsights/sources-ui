/* eslint-disable react/display-name */
import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Card, CardBody, CardFooter, CardTitle, Text } from '@patternfly/react-core';

import CloudTiles from './CloudTiles';

const CLOUD_CATALOG_HREF = 'https://catalog.redhat.com/cloud';

const CloudEmptyState = ({ setSelectedType }) => {
  const intl = useIntl();

  return (
    <Card className="src-c-card__cloud-empty-state pf-v5-u-mt-md pf-v5-u-mt-0-on-md">
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
            defaultMessage: 'Select an available provider.',
          })}
        </Text>
        <div className="provider-tiles pf-v5-u-mt-md pf-v5-u-mb-lg">
          <CloudTiles setSelectedType={setSelectedType} />
        </div>
      </CardBody>
      <CardFooter className="cloud-footer">
        <Text className="catalog-link pf-v5-u-mt-lg">
          {intl.formatMessage(
            {
              id: 'cloud.emptystate.catalogLink',
              defaultMessage: 'Looking for a different provider? <a>See all Red Hat Certified Cloud and Service Providers</a>',
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
