import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { shallowEqual, useSelector } from 'react-redux';
import { Stack } from '@patternfly/react-core';
import { defineMessages, useIntl } from 'react-intl';

import Point from './Point';
import { ACCOUNT_AUTHORIZATION } from '../../constants';

const messages = defineMessages({
  hcsbundleTrackTitle: {
    id: 'hcsbundle.track.title',
    defaultMessage: 'Track Red Hat committed spend',
  },
  hcsbundleTrackDescription: {
    id: 'hcsbundle.track.description',
    defaultMessage: 'Track spend through {application} and apply them to your Red Hat committed spend.',
  },
  costAppTitle: {
    id: 'cost.app.title',
    defaultMessage: 'Cost management',
  },
  costAppDescription: {
    id: 'cost.app.description',
    defaultMessage: 'Analyze, forecast, and optimize your Red Hat OpenShift cluster costs in hybrid cloud environments.',
  },
});

const HybridCommittedSpendDescription = ({ id }) => {
  const intl = useIntl();
  const { getState } = useFormApi();

  const sourceTypes = useSelector(({ sources }) => sources.sourceTypes, shallowEqual);
  const values = getState().values;

  const isEnabled = useMemo(
    () =>
      (values.source?.app_creation_workflow === ACCOUNT_AUTHORIZATION && values.applications?.includes(id)) ||
      (values.source?.app_creation_workflow !== ACCOUNT_AUTHORIZATION && values.application?.application_type_id === id),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pre-existing pattern, see i18n cleanup ticket
    [values.application?.application_type_id],
  );

  return (
    <Stack>
      <Point
        title={intl.formatMessage(messages.hcsbundleTrackTitle)}
        description={intl.formatMessage(messages.hcsbundleTrackDescription, {
          application: sourceTypes.find((type) => type.name === values.source_type)?.product_name,
        })}
        className="pf-v6-u-mb-sm"
        isEnabled={isEnabled}
      />
      <Point
        title={intl.formatMessage(messages.costAppTitle)}
        description={intl.formatMessage(messages.costAppDescription)}
        isEnabled={isEnabled}
      />
    </Stack>
  );
};

HybridCommittedSpendDescription.propTypes = {
  id: PropTypes.string.isRequired,
};

export default HybridCommittedSpendDescription;
