import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Text } from '@patternfly/react-core/dist/esm/components/Text/Text';
import { Stack } from '@patternfly/react-core/dist/esm/layouts/Stack/Stack';
import { StackItem } from '@patternfly/react-core/dist/esm/layouts/Stack/StackItem';
import { Flex } from '@patternfly/react-core/dist/esm/layouts/Flex/Flex';
import { FlexItem } from '@patternfly/react-core/dist/esm/layouts/Flex/FlexItem';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';

import useFormApi from '@data-driven-forms/react-form-renderer/dist/esm/use-form-api';

const Point = ({ title, description, isEnabled, ...props }) => (
  <StackItem {...props}>
    <Flex>
      <FlexItem spacer={{ default: 'spacerSm' }}>
        <CheckCircleIcon fill={isEnabled ? '#3E8635' : '#6A6E73'} />
      </FlexItem>
      <FlexItem>
        <Text className="pf-u-mb-xs ins-c-sources__wizard--rhel-desc-title">{title}</Text>
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

  const isEnabled = getState().values.application?.application_type_id === id;

  return (
    <Stack>
      <Point
        title={intl.formatMessage({
          id: 'rhelbundle.goldImages.title',
          defaultMessage: 'Red Hat Gold Images',
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
          defaultMessage: 'Cloud instances automatically connect to cloud.redhat.com when provisioned.',
        })}
        className="pf-u-mb-sm"
        isEnabled={isEnabled}
      />
      <Point
        title={intl.formatMessage({
          id: 'rhelbundle.redhatconnector.title',
          defaultMessage: 'Red Hat Connector',
        })}
        description={intl.formatMessage({
          id: 'rhelbundle.redhatconnector.description',
          defaultMessage: 'Simplified set up and registration of connected hosts.',
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
