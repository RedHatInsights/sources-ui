import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';

export const innerSetter = ({
    formOptions,
    modifiedValues,
    authenticationValues,
    selectedAuthentication
}) => {
    if (!selectedAuthentication.startsWith('new-')) {
        const authentication = authenticationValues.find(({ id }) => id === selectedAuthentication);

        if (modifiedValues && modifiedValues.authentication) {
            const newAuthenticationValues = merge(cloneDeep(authentication), modifiedValues.authentication);
            formOptions.change('authentication', newAuthenticationValues);
        } else {
            formOptions.change('authentication', authentication);
        }
    } else {
        const authtype = selectedAuthentication.replace('new-', '');
        if (modifiedValues && modifiedValues.authentication) {
            formOptions.change('authentication', { ...modifiedValues.authentication, authtype });
        } else {
            formOptions.change('authentication', { authtype });
        }
    }
};

export const AuthTypeSetter = ({ authenticationValues, modifiedValues }) => {
    const formOptions = useFormApi();

    const selectedAuthentication = formOptions.getState().values.selectedAuthentication;

    const [initialValue, setInitialValue] = useState(selectedAuthentication);

    useEffect(() => {
        if (initialValue !== selectedAuthentication) {
            innerSetter({ formOptions, authenticationValues, modifiedValues, selectedAuthentication });
            setInitialValue(undefined);
        }
    }, [selectedAuthentication]);

    return null;
};

AuthTypeSetter.propTypes = {
    authenticationValues: PropTypes.arrayOf(PropTypes.object),
    modifiedValues: PropTypes.object
};
