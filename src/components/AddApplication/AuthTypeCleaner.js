import { useState, useEffect } from 'react';
import get from 'lodash/get';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';

export const AuthTypeCleaner = () => {
    const formOptions = useFormApi();

    const selectedAppId = get(formOptions.getState().values, 'application.application_type_id', '');

    const [initialValue, setInitialValue] = useState(selectedAppId);

    useEffect(() => {
        if (initialValue !== selectedAppId) {
            formOptions.batch(() => {
                formOptions.change('authentication', undefined);
                formOptions.change('selectedAuthentication', undefined);
            });
            setInitialValue(undefined);
        }
    }, [selectedAppId]);

    return null;
};
