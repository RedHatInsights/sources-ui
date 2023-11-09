import React from 'react';
import PropTypes from 'prop-types';
import { Flex, FlexItem, StackItem, Text } from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';

const Point = ({ title, description, isEnabled, ...props }) => (
  <StackItem {...props}>
    <Flex>
      <FlexItem spacer={{ default: 'spacerSm' }}>
        <CheckCircleIcon fill={isEnabled ? '#3E8635' : '#6A6E73'} />
      </FlexItem>
      <FlexItem>
        <Text className="pf-v5-u-mb-xs src-c-wizard__rhel-desc-title">{title}</Text>
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

export default Point;
