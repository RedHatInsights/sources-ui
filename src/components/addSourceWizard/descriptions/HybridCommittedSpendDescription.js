import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { shallowEqual, useSelector } from 'react-redux';
import { Stack } from '@patternfly/react-core';
import { useIntl } from 'react-intl';

import Point from './Point';
import { ACCOUNT_AUTHORIZATION } from '../../constants';

const HybridCommittedSpendDescription = ({ id }) => {
  const intl = useIntl();
  const { getState } = useFormApi();

  const sourceTypes = useSelector(({ sources }) => sources.sourceTypes, shallowEqual);
  const values = getState().values;

  const isEnabled = useMemo(
    () =>
      (values.source.app_creation_workflow === ACCOUNT_AUTHORIZATION && values.applications?.includes(id)) ||
      (values.source.app_creation_workflow !== ACCOUNT_AUTHORIZATION && values.application?.application_type_id === id),
    [values.application?.application_type_id],
  );

  return (
    <Stack>
      <Point
        title={intl.formatMessage({
          id: 'hcsbundle.track.title',
          defaultMessage: 'Track Red Hat committed spend',
        })}
        description={intl.formatMessage(
          {
            id: 'hcsbundle.track.description',
            defaultMessage: 'Track spend through {application} and apply them to your Red Hat committed spend.',
          },
          {
            application: sourceTypes.find((type) => type.name === values.source_type)?.product_name,
          },
        )}
        className="pf-v5-u-mb-sm"
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
