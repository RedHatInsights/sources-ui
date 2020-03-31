import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

export const AuthTypeCleaner = ({ formOptions, modifiedValues }) => {
    const selectedAppId = get(formOptions.getState().values, 'application.application_type_id', '');

    const [initialValue] = useState(selectedAppId);

    useEffect(() => {
        if (initialValue !== selectedAppId) {
            const values = modifiedValues && modifiedValues.authentication ? modifiedValues.authentication : undefined;
            formOptions.batch(() => {
                formOptions.change('authentication', values);
                formOptions.change('selectedAuthentication', undefined);
            });
        }
    }, [selectedAppId]);

    return null;
};

AuthTypeCleaner.propTypes = {
    formOptions: PropTypes.shape({
        getState: PropTypes.func.isRequired,
        change: PropTypes.func.isRequired
    }).isRequired,
    modifiedValues: PropTypes.object
};
