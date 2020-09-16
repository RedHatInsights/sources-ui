import React from 'react';
import PropTypes from 'prop-types';

import { Title } from '@patternfly/react-core/dist/js/components/Title/Title';

const AuthenticationManagement = ({ schemaAuth }) => (
    <Title headingLevel="h1" size="xl">{schemaAuth.name}</Title>
);

AuthenticationManagement.propTypes = {
    schemaAuth: PropTypes.shape({
        name: PropTypes.string.isRequired
    }).isRequired,
};

export default AuthenticationManagement;
