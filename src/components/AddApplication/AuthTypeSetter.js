import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';

export const innerSetter = ({
    formOptions,
    modifiedValues,
    authenticationValues,
    selectedAuthentication
}) => {
    if (selectedAuthentication !== 'new') {
        const authentication = authenticationValues.find(({ id }) => id === selectedAuthentication);

        if (modifiedValues && modifiedValues.authentication) {
            const newAuthenticationValues = merge(cloneDeep(authentication), modifiedValues.authentication);
            formOptions.change('authentication', newAuthenticationValues);
        } else {
            formOptions.change('authentication', authentication);
        }
    } else {
        if (modifiedValues && modifiedValues.authentication) {
            formOptions.change('authentication', modifiedValues.authentication);
        } else {
            formOptions.change('authentication', undefined);
        }
    }
};

export const AuthTypeSetter = ({ formOptions, authenticationValues, modifiedValues }) => {
    const selectedAuthentication = formOptions.getState().values.selectedAuthentication;

    const [initialValue] = useState(selectedAuthentication);

    useEffect(() => {
        if (initialValue !== selectedAuthentication) {
            innerSetter({ formOptions, authenticationValues, modifiedValues, selectedAuthentication });
        }
    }, [selectedAuthentication]);

    return null;
};

AuthTypeSetter.propTypes = {
    formOptions: PropTypes.shape({
        getState: PropTypes.func.isRequired,
        change: PropTypes.func.isRequired
    }).isRequired,
    authenticationValues: PropTypes.arrayOf(PropTypes.object),
    modifiedValues: PropTypes.object
};
