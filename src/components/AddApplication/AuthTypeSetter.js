import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import { useSource } from '../../hooks/useSource';
import get from 'lodash/get';

export const checkAuthTypeMemo = () => {
    let previousAuthType;

    return (newAuthType) => {
        if (previousAuthType === newAuthType) {
            return false;
        }

        previousAuthType = newAuthType;
        return true;
    };
};

export const innerSetter = ({ sourceTypes, source, appTypes, formOptions, checkAuthType, authenticationValues }) => {
    const sourceType = sourceTypes.find(({ id }) => id === source.source_type_id);

    const formValues = formOptions.getState();

    const application = appTypes.find(
        ({ id }) => id === get(formValues, 'values.application.application_type_id', undefined)
    );
    const supported_auth_type = get(application, `supported_authentication_types[${sourceType.name}][0]`, '');

    if (checkAuthType(supported_auth_type)) {
        formOptions.change('supported_auth_type', supported_auth_type);

        const hasAuthenticationAlready = authenticationValues.find(({ authtype }) => authtype === supported_auth_type);

        if (hasAuthenticationAlready) {
            formOptions.change('authentication', hasAuthenticationAlready);
        } else {
            formOptions.change('authentication', undefined);
        }
    }
};

export const AuthTypeSetter = ({ formOptions, authenticationValues }) => {
    const [checkAuthType] = useState(() => checkAuthTypeMemo());

    const { appTypes, sourceTypes } = useSelector(({ sources }) => sources, shallowEqual);

    const source = useSource();

    innerSetter({ sourceTypes, checkAuthType, formOptions, authenticationValues, appTypes, source });

    return null;
};

AuthTypeSetter.propTypes = {
    formOptions: PropTypes.shape({
        getState: PropTypes.func.isRequired,
        change: PropTypes.func.isRequired
    }).isRequired,
    authenticationValues: PropTypes.arrayOf(PropTypes.object)
};
