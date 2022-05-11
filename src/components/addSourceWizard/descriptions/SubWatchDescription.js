import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Text, Stack, StackItem, Flex, FlexItem } from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';

import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

const Point = ({ title, description, isEnabled, ...props }) => (
  <StackItem {...props}>
    <Flex>
      <FlexItem spacer={{ default: 'spacerSm' }}>
        <CheckCircleIcon fill={isEnabled ? '#3E8635' : '#6A6E73'} />
      </FlexItem>
      <FlexItem>
        <Text className="pf-u-mb-xs src-c-wizard__rhel-desc-title">{title}</Text>
        <Text>{description}</Text>
      </FlexItem>
    </Flex>
  </StackItem>
);

Point.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isEnabled: PropTypes.bool,
};

const SubWatchDescription = ({ id }) => {
  const intl = useIntl();
  const { getState } = useFormApi();

  const values = getState().values;

  const isEnabled =
    (values.source.app_creation_workflow === 'account_authorization' && values.applications?.includes(id)) ||
    (values.source.app_creation_workflow !== 'account_authorization' && values.application?.application_type_id === id);

  if (values.source_type === 'azure') {
    return (
      <Stack>
        <Point
          title={intl.formatMessage({
            id: 'rhelbundle.goldImages.title',
            defaultMessage: 'Red Hat gold images',
          })}
          description={intl.formatMessage({
            id: 'rhelbundle.goldImages.azure.description',
            defaultMessage: 'Unlock cloud images in Microsoft Azure and bring your own subscription instead of paying hourly.',
          })}
          className="pf-u-mb-sm"
          isEnabled={isEnabled}
        />
        <Point
          title={intl.formatMessage({
            id: 'rhelbundle.autoregistration.title',
            defaultMessage: 'Autoregistration',
          })}
          description={intl.formatMessage({
            id: 'rhelbundle.goldImages.description',
            defaultMessage: 'Cloud instances automatically connect to console.redhat.com when provisioned.',
          })}
          isEnabled={isEnabled}
        />
      </Stack>
    );
  }

  if (values.source_type === 'google') {
    return (
      <Stack>
        <Point
          title={intl.formatMessage({
            id: 'rhelbundle.goldImages.title',
            defaultMessage: 'Red Hat gold images',
          })}
          description={intl.formatMessage({
            id: 'rhelbundle.goldImages.google.description',
            defaultMessage: 'Unlock cloud images in Google Cloud and bring your own subscription instead of paying hourly.',
          })}
          className="pf-u-mb-sm"
          isEnabled={isEnabled}
        />
        <Point
          title={intl.formatMessage({
            id: 'rhelbundle.autoregistration.title',
            defaultMessage: 'Autoregistration',
          })}
          description={intl.formatMessage({
            id: 'rhelbundle.goldImages.description',
            defaultMessage: 'Cloud instances automatically connect to console.redhat.com when provisioned.',
          })}
          isEnabled={isEnabled}
        />
      </Stack>
    );
  }

  return (
    <Stack>
      <Point
        title={intl.formatMessage({
          id: 'rhelbundle.goldImages.title',
          defaultMessage: 'Red Hat gold images',
        })}
        description={intl.formatMessage({
          id: 'rhelbundle.goldImages.description',
          defaultMessage: 'Unlock cloud images in AWS and bring your own subscription instead of paying hourly.',
        })}
        className="pf-u-mb-sm"
        isEnabled={isEnabled}
      />
      <Point
        title={intl.formatMessage({
          id: 'rhelbundle.subwatch.title',
          defaultMessage: 'High precision subscription watch data',
        })}
        description={intl.formatMessage({
          id: 'rhelbundle.subwatch.description',
          defaultMessage: 'View precise public cloud usage data in subscription watch.',
        })}
        className="pf-u-mb-sm"
        isEnabled={isEnabled}
      />
      <Point
        title={intl.formatMessage({
          id: 'rhelbundle.autoregistration.title',
          defaultMessage: 'Autoregistration',
        })}
        description={intl.formatMessage({
          id: 'rhelbundle.goldImages.description',
          defaultMessage: 'Cloud instances automatically connect to console.redhat.com when provisioned.',
        })}
        isEnabled={isEnabled}
      />
    </Stack>
  );
};

SubWatchDescription.propTypes = {
  id: PropTypes.string.isRequired,
};

export default SubWatchDescription;
