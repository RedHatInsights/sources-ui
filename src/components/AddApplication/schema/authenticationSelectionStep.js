import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';

const authenticationSelectionStep = (sourceType, appType, intl, authenticationValues) => {
    const nextStep = ({ values: { application, authtype } }) => {
        if (authtype) {
            const hasSupportedAuthType = authenticationValues.find((auth) => auth.authtype === authtype);

            if (hasSupportedAuthType) {
                return 'selectAuthentication';
            }

            return `${sourceType.name}-${application && application.application_type_id}-${authtype}`;
        }
    };

    return ({
        name: `selectAuthType-${appType.id}`,
        title: intl.formatMessage({
            id: 'sources.selectAuthenticationTitle',
            defaultMessage: 'Select authentication type'
        }),
        fields: [{
            component: componentTypes.RADIO,
            name: 'authtype',
            options: appType.supported_authentication_types[sourceType.name].map(type => ({
                value: type,
                label: sourceType.schema.authentication.find((authtype) => authtype.type === type)?.name || 'Unknown type'
            })),
            isRequired: true,
            validate: [{ type: validatorTypes.REQUIRED }]
        }],
        nextStep
    });
};

export default authenticationSelectionStep;
