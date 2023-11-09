/* eslint-disable react/display-name */
import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Card, CardBody, CardTitle, Text } from '@patternfly/react-core';

import RedHatTiles from './RedHatTiles';

const RedHatEmptyState = ({ setSelectedType }) => {
  const intl = useIntl();

  return (
    <Card className="src-c-card__cloud-empty-state pf-v5-u-mt-md pf-v5-u-mt-0-on-md">
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
        <div className="provider-tiles pf-v5-u-mt-md pf-v5-u-mb-lg">
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
