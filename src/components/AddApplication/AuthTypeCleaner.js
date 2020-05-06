import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';

export const AuthTypeCleaner = ({ modifiedValues }) => {
    const formOptions = useFormApi();

    const selectedAppId = get(formOptions.getState().values, 'application.application_type_id', '');

    const [initialValue, setInitialValue] = useState(selectedAppId);

    useEffect(() => {
        if (initialValue !== selectedAppId) {
            const values = modifiedValues && modifiedValues.authentication ? modifiedValues.authentication : undefined;
            formOptions.batch(() => {
                formOptions.change('authentication', values);
                formOptions.change('selectedAuthentication', undefined);
            });
            setInitialValue(undefined);
        }
    }, [selectedAppId]);

    return null;
};

AuthTypeCleaner.propTypes = {
    modifiedValues: PropTypes.object
};
