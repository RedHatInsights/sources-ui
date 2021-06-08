/* eslint-disable react/display-name */
import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Card, CardBody, CardTitle, Text } from '@patternfly/react-core';

import RedHatTiles from './RedHatTiles';

const RedHatEmptyState = ({ setSelectedType }) => {
  const intl = useIntl();

  return (
    <Card className="ins-c-sources__cloud-empty-state-card pf-u-mt-md pf-u-mt-0-on-md">
      <CardTitle>
        {intl.formatMessage({
          id: 'redhat.emptystate.cardTitle',
          defaultMessage: 'Get started by connecting to your Red Hat applications',
        })}
      </CardTitle>
      <CardBody>
        <Text>
          {intl.formatMessage({
            id: 'redhat.emptystate.cardDescription',
            defaultMessage: 'Select an available application.',
          })}
        </Text>
        <div className="provider-tiles pf-u-mt-md pf-u-mb-lg">
          <RedHatTiles setSelectedType={setSelectedType} />
        </div>
      </CardBody>
    </Card>
  );
};

RedHatEmptyState.propTypes = {
  setSelectedType: PropTypes.func.isRequired,
};

export default RedHatEmptyState;
