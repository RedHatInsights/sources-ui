import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@patternfly/react-core/dist/js/components/Form/Form';

const HorizontalFormWrapper = ({ children, ...props }) => <Form {...props} isHorizontal>{children}</Form>;

HorizontalFormWrapper.propTypes = {
    children: PropTypes.node
};

export default HorizontalFormWrapper;
