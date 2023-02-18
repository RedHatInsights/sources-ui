import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Button } from '@patternfly/react-core';
import computeSourcesUrl from '../../utilities/computeSourcesUrl';
import AppLink from '../AppLink';

const EditLink = ({ id }) => {
  const intl = useIntl();
  const message = intl.formatMessage({ id: 'wizard.editSource', defaultMessage: 'Edit source' });

  if (insights.chrome.getApp() === 'sources') {
    return (
      <AppLink to={`/detail/${id}`}>
        <Button variant="primary" className="pf-u-mt-xl">
          {message}
        </Button>
      </AppLink>
    );
  }

  return (
    <Button
      variant="primary"
      className="pf-u-mt-xl"
      component="a"
      target="_blank"
      href={`${computeSourcesUrl()}/detail/${id}`}
      rel="noopener noreferrer"
    >
      {message}
    </Button>
  );
};

EditLink.propTypes = {
  id: PropTypes.string.isRequired,
};

export default EditLink;
