import React from 'react';
import PropTypes from 'prop-types';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { Stack } from '@patternfly/react-core';
import { useIntl } from 'react-intl';

import Point from './Point';
import { ACCOUNT_AUTHORIZATION } from '../../constants';

const HybridCommittedSpendDescription = ({ id }) => {
  const intl = useIntl();
  const { getState } = useFormApi();

  const values = getState().values;

  const isEnabled =
    (values.source.app_creation_workflow === ACCOUNT_AUTHORIZATION && values.applications?.includes(id)) ||
    (values.source.app_creation_workflow !== ACCOUNT_AUTHORIZATION && values.application?.application_type_id === id);

  return (
    <Stack>
      <Point
        title={intl.formatMessage({
          id: 'hcsbundle.track.title',
          defaultMessage: 'Track Red Hat spend regardless of point of purchase',
        })}
        description={intl.formatMessage({
          id: 'hcsbundle.track.description',
          defaultMessage: 'Unlock cloud images in Microsoft Azure and bring your own subscription instead of paying hourly.',
        })}
        className="pf-u-mb-sm"
        isEnabled={isEnabled}
      />
      <Point
        title={intl.formatMessage({
          id: 'cost.app.title',
          defaultMessage: 'Cost management',
        })}
        description={intl.formatMessage({
          id: 'cost.app.description',
          defaultMessage: 'Analyze, forecast, and optimize your Red Hat OpenShift cluster costs in hybrid cloud environments.',
        })}
        isEnabled={isEnabled}
      />
    </Stack>
  );
};

HybridCommittedSpendDescription.propTypes = {
  id: PropTypes.string.isRequired,
};

export default HybridCommittedSpendDescription;
