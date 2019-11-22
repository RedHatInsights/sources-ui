import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@patternfly/react-core';

const HorizontalFormWrapper = ({ children }) => <Form isHorizontal>{children}</Form>;

HorizontalFormWrapper.propTypes = {
    children: PropTypes.node
};

export default HorizontalFormWrapper;
