import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';

export const innerSetter = ({
    formOptions,
    authenticationValues,
    selectedAuthentication
}) => {
    if (!selectedAuthentication.startsWith('new-')) {
        const authentication = authenticationValues.find(({ id }) => id === selectedAuthentication);

        formOptions.change('authentication', authentication);
    } else {
        const authtype = selectedAuthentication.replace('new-', '');

        formOptions.change('authentication', { authtype });
    }
};

export const AuthTypeSetter = ({ authenticationValues }) => {
    const formOptions = useFormApi();

    const selectedAuthentication = formOptions.getState().values.selectedAuthentication;

    const [initialValue, setInitialValue] = useState(selectedAuthentication);

    useEffect(() => {
        if (initialValue !== selectedAuthentication) {
            innerSetter({ formOptions, authenticationValues, selectedAuthentication });
            setInitialValue(undefined);
        }
    }, [selectedAuthentication]);

    return null;
};

AuthTypeSetter.propTypes = {
    authenticationValues: PropTypes.arrayOf(PropTypes.object),
};
