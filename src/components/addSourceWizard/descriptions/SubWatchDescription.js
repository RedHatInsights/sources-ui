import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { ACCOUNT_AUTHORIZATION } from '../../constants';
import { Stack } from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import Point from './Point';

const messages = defineMessages({
  rhelbundleGoldimagesTitle: {
    id: 'rhelbundle.goldImages.title',
    defaultMessage: 'Red Hat gold images',
  },
  rhelbundleGoldimagesAzureDescription: {
    id: 'rhelbundle.goldImages.azure.description',
    defaultMessage: 'Unlock cloud images in Microsoft Azure and bring your own subscription instead of paying hourly.',
  },
  rhelbundleAutoregistrationTitle: {
    id: 'rhelbundle.autoregistration.title',
    defaultMessage: 'Autoregistration',
  },
  rhelbundleGoldimagesDescription: {
    id: 'rhelbundle.goldImages.description',
    defaultMessage: 'Cloud instances automatically connect to console.redhat.com when provisioned.',
  },
  rhelbundleGoldimagesGoogleDescription: {
    id: 'rhelbundle.goldImages.google.description',
    defaultMessage: 'Unlock cloud images in Google Cloud and bring your own subscription instead of paying hourly.',
  },
  rhelbundleGoldimagesDescription_1: {
    id: 'rhelbundle.goldImages.bringYourOwn',
    defaultMessage: 'Unlock cloud images in AWS and bring your own subscription instead of paying hourly.',
  },
  rhelbundleSubwatchTitle: {
    id: 'rhelbundle.subwatch.title',
    defaultMessage: 'High precision subscription watch data',
  },
  rhelbundleSubwatchDescription: {
    id: 'rhelbundle.subwatch.description',
    defaultMessage: 'View precise public cloud usage data in subscription watch.',
  },
});

const SubWatchDescription = ({ id }) => {
  const intl = useIntl();
  const { getState } = useFormApi();

  const values = getState().values;

  const isEnabled =
    (values.source.app_creation_workflow === ACCOUNT_AUTHORIZATION && values.applications?.includes(id)) ||
    (values.source.app_creation_workflow !== ACCOUNT_AUTHORIZATION && values.application?.application_type_id === id);

  if (values.source_type === 'azure') {
    return (
      <Stack>
        <Point
          title={intl.formatMessage(messages.rhelbundleGoldimagesTitle)}
          description={intl.formatMessage(messages.rhelbundleGoldimagesAzureDescription)}
          className="pf-v6-u-mb-sm"
          isEnabled={isEnabled}
        />
        <Point
          title={intl.formatMessage(messages.rhelbundleAutoregistrationTitle)}
          description={intl.formatMessage(messages.rhelbundleGoldimagesDescription)}
          isEnabled={isEnabled}
        />
      </Stack>
    );
  }

  if (values.source_type === 'google') {
    return (
      <Stack>
        <Point
          title={intl.formatMessage(messages.rhelbundleGoldimagesTitle)}
          description={intl.formatMessage(messages.rhelbundleGoldimagesGoogleDescription)}
          className="pf-v6-u-mb-sm"
          isEnabled={isEnabled}
        />
        <Point
          title={intl.formatMessage(messages.rhelbundleAutoregistrationTitle)}
          description={intl.formatMessage(messages.rhelbundleGoldimagesDescription)}
          isEnabled={isEnabled}
        />
      </Stack>
    );
  }

  return (
    <Stack>
      <Point
        title={intl.formatMessage(messages.rhelbundleGoldimagesTitle)}
        description={intl.formatMessage(messages.rhelbundleGoldimagesDescription_1)}
        className="pf-v6-u-mb-sm"
        isEnabled={isEnabled}
      />
      <Point
        title={intl.formatMessage(messages.rhelbundleSubwatchTitle)}
        description={intl.formatMessage(messages.rhelbundleSubwatchDescription)}
        className="pf-v6-u-mb-sm"
        isEnabled={isEnabled}
      />
      <Point
        title={intl.formatMessage(messages.rhelbundleAutoregistrationTitle)}
        description={intl.formatMessage(messages.rhelbundleGoldimagesDescription)}
        isEnabled={isEnabled}
      />
    </Stack>
  );
};

SubWatchDescription.propTypes = {
  id: PropTypes.string.isRequired,
};

export default SubWatchDescription;
