import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import { FormattedMessage } from 'react-intl';
import { authenticationFields } from './authentication';

export const APP_NAMES = {
    COST_MANAGAMENT: '/insights/platform/cost-management'
};

export const appendClusterIdentifier = (sourceType) =>
    sourceType.name === 'openshift' ? [{
        name: 'source.source_ref',
        label: <FormattedMessage
            id="sources.clusterIdentifier"
            defaultMessage="Cluster identifier"
        />,
        isRequired: true,
        validate: [{ type: validatorTypes.REQUIRED }],
        component: componentTypes.TEXT_FIELD,
    }] : [];

const createOneAppFields = (appType, sourceType, app) => ([
    ...authenticationFields(
        app.authentications?.filter(auth => Object.keys(auth).length > 1),
        sourceType,
        appType?.name
    ),
    ...(appType?.name === APP_NAMES.COST_MANAGAMENT ? appendClusterIdentifier(sourceType) : [])
]);

const unusedAuthsWarning = (length) => ({
    component: componentTypes.PLAIN_TEXT,
    name: 'unused-auth-warning',
    label: <FormattedMessage
        id='sources.authNotUsed'
        // eslint-disable-next-line max-len
        defaultMessage='The following {length, plural, one {authentication is not} other {authentications are not}} used by any application.'
        values={{ length }}
    />
});

const unusedAuthentications = (authentications, sourceType, appsLength) => {
    if (!authentications || authentications.length === 0) {
        return [];
    }

    let authenticationsInputs = sourceType?.schema?.authentication?.reduce((acc, { type }) => {
        const auths = authentications.filter(({ authtype }) => type === authtype);

        if (auths?.length > 0) {
            return ([
                ...acc,
                ...authenticationFields(auths, sourceType)
            ]);
        }

        return acc;
    }, [])?.filter(Boolean);

    const transformToTabs = appsLength !== 0;

    if (transformToTabs) {
        authenticationsInputs = [{
            fields: [
                unusedAuthsWarning(authenticationsInputs.length),
                ...authenticationsInputs
            ],
            title: sourceType.product_name,
            name: 'unused-auths-tab'
        }];
    } else {
        authenticationsInputs = [{
            fields: [
                unusedAuthsWarning(authenticationsInputs.length),
                ...authenticationsInputs
            ],
            component: componentTypes.SUB_FORM,
            name: 'unused-auths-group'
        }];
    }

    return authenticationsInputs;
};

export const applicationsFields = (
    applications,
    sourceType,
    appTypes,
    authentications
) => {
    const authenticationTypesFormGroups = unusedAuthentications(authentications, sourceType, applications?.length);

    if (!applications || applications.length === 0) {
        return authenticationTypesFormGroups;
    } else if (applications.length === 1 && authenticationTypesFormGroups.length === 0) {
        const appType = appTypes.find(({ id }) => id === applications[0].application_type_id);

        return createOneAppFields(appType, sourceType, applications[0]);
    } else {
        return ([{
            component: componentTypes.TABS,
            name: 'app-tabs',
            isBox: true,
            fields: [
                ...applications.map((app) => {
                    const appType = appTypes.find(({ id }) => id === app.application_type_id);

                    return ({
                        name: appType?.id,
                        title: appType?.display_name,
                        fields: createOneAppFields(appType, sourceType, app)
                    });
                }),
                ...authenticationTypesFormGroups
            ]
        }]);
    }
};
