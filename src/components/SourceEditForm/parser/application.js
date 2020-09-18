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
        app.authentications.filter(auth => Object.keys(auth).length > 1),
        sourceType,
        appType?.name
    ),
    ...(appType?.name === APP_NAMES.COST_MANAGAMENT ? appendClusterIdentifier(sourceType) : [])
]);

export const applicationsFields = (
    applications,
    sourceType,
    appTypes,
) => {
    if (applications.length === 0) {
        return [];
    } else if (applications.length === 1) {
        const appType = appTypes.find(({ id }) => id === applications[0].application_type_id);

        return createOneAppFields(appType, sourceType, applications[0]);
    } else {
        return ([{
            component: componentTypes.TABS,
            name: 'app-tabs',
            fields: applications.map((app) => {
                const appType = appTypes.find(({ id }) => id === app.application_type_id);

                return ({
                    name: appType?.id,
                    title: appType?.display_name,
                    fields: createOneAppFields(appType, sourceType, app)
                });
            })
        }]);
    }
};
