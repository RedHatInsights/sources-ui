/* eslint-disable react/display-name */
import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Card, CardBody, CardFooter, CardTitle, Content } from '@patternfly/react-core';

import CloudTiles from './CloudTiles';

const CLOUD_CATALOG_HREF = 'https://catalog.redhat.com/cloud';

const CloudEmptyState = ({ setSelectedType }) => {
  const intl = useIntl();

  return (
    <Card className="src-c-card__cloud-empty-state pf-v6-u-mt-md pf-v6-u-mt-0-on-md">
      <CardTitle>
        {intl.formatMessage({
          id: 'cloud.emptystate.cardTitle',
          defaultMessage: 'Get started by connecting to your public clouds',
        })}
      </CardTitle>
      <CardBody>
        <Content component="p">
          {intl.formatMessage({
            id: 'cloud.emptystate.cardDescription',
            defaultMessage: 'Select an available provider.',
          })}
        </Content>
        <div className="provider-tiles pf-v6-u-mt-md pf-v6-u-mb-lg">
          <CloudTiles setSelectedType={setSelectedType} />
        </div>
      </CardBody>
      <CardFooter className="cloud-footer">
        <Content component="p" className="catalog-link pf-v6-u-mt-lg">
          {intl.formatMessage(
            {
              id: 'cloud.emptystate.catalogLink',
              defaultMessage: 'Looking for a different provider? <a>See all Red Hat Certified Cloud and Service Providers</a>',
            },
            {
              a: (chunks) => (
                <Content key="link" component="a" href={CLOUD_CATALOG_HREF} target="_blank" rel="noopener noreferrer">
                  {chunks}
                </Content>
              ),
            },
          )}
        </Content>
      </CardFooter>
    </Card>
  );
};

CloudEmptyState.propTypes = {
  setSelectedType: PropTypes.func.isRequired,
};

export default CloudEmptyState;
