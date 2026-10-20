/* eslint-disable react/display-name */
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Card, CardBody, CardFooter, CardTitle, Content } from '@patternfly/react-core';

import CloudTiles from './CloudTiles';

const messages = defineMessages({
  cloudEmptystateCardtitle: {
    id: 'cloud.emptystate.cardTitle',
    defaultMessage: 'Get started by connecting to your public clouds',
  },
  cloudEmptystateCarddescription: {
    id: 'cloud.emptystate.cardDescription',
    defaultMessage: 'Select an available provider.',
  },
  cloudEmptystateCataloglink: {
    id: 'cloud.emptystate.catalogLink',
    defaultMessage: 'Looking for a different provider? <a>See all Red Hat Certified Cloud and Service Providers</a>',
  },
});

const CLOUD_CATALOG_HREF = 'https://catalog.redhat.com/cloud';

const CloudEmptyState = ({ setSelectedType }) => {
  const intl = useIntl();

  return (
    <Card className="src-c-card__cloud-empty-state pf-v6-u-mt-md pf-v6-u-mt-0-on-md">
      <CardTitle>{intl.formatMessage(messages.cloudEmptystateCardtitle)}</CardTitle>
      <CardBody>
        <Content component="p">{intl.formatMessage(messages.cloudEmptystateCarddescription)}</Content>
        <div className="provider-tiles pf-v6-u-mt-md pf-v6-u-mb-lg">
          <CloudTiles setSelectedType={setSelectedType} />
        </div>
      </CardBody>
      <CardFooter className="cloud-footer">
        <Content component="p" className="catalog-link pf-v6-u-mt-lg">
          {intl.formatMessage(messages.cloudEmptystateCataloglink, {
            a: (chunks) => (
              <Content key="link" component="a" href={CLOUD_CATALOG_HREF} target="_blank" rel="noopener noreferrer">
                {chunks}
              </Content>
            ),
          })}
        </Content>
      </CardFooter>
    </Card>
  );
};

CloudEmptyState.propTypes = {
  setSelectedType: PropTypes.func.isRequired,
};

export default CloudEmptyState;
