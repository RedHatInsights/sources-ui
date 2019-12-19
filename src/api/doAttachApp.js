import { addedDiff, updatedDiff } from 'deep-object-diff';
import { patchSource, handleError } from '@redhat-cloud-services/frontend-components-sources';

import { getSourcesApi, doCreateApplication } from './entities';
import { urlOrHost } from './doUpdateSource';

export const convertToUndefined = (value) => {
    if (typeof value === 'undefined') {
        return null;
    }

    if (Array.isArray(value)) {
        return value.map((val) => convertToUndefined(val));
    }

    if (typeof value === 'object') {
        return Object.keys(value).reduce((acc, curr) => ({ ...acc, [curr]: convertToUndefined(value[curr]) }), {});
    }

    return value;
};

export const doAttachApp = async (values, formApi, authenticationInitialValues) => {
    const formState = formApi.getState();

    const initialValues = formState.initialValues;
    const allFormValues = formState.values;

    const selectedAuthId = allFormValues.authentication ? allFormValues.authentication.id : undefined;

    const authInitialValues = selectedAuthId
        ? authenticationInitialValues.find(({ id }) => id === selectedAuthId)
        : undefined;

    const { authentication, ...valuesWithoutAuth } = values;

    const newAddedValues = addedDiff(initialValues, valuesWithoutAuth);
    const updatedValues = updatedDiff(initialValues, valuesWithoutAuth);
    const newAddedAuthValues = addedDiff(authInitialValues, authentication);
    const updatedAuthValues = updatedDiff(authInitialValues, authentication);

    const filteredValues = {
        ...newAddedValues,
        ...convertToUndefined(updatedValues),
        authentication: {
            ...newAddedAuthValues,
            ...convertToUndefined(updatedAuthValues)
        }
    };

    try {
        const sourceId = allFormValues.source.id;
        let endpointId = allFormValues.endpoint ? allFormValues.endpoint.id : undefined;

        const promises = [];

        if (filteredValues.source) {
            promises.push(getSourcesApi().updateSource(sourceId, filteredValues.source));
        }

        if (filteredValues.endpoint || filteredValues.url) {
            const { scheme, host, port, path } = urlOrHost(filteredValues);

            const endPointPort = parseInt(port, 10);

            const endpointData = {
                ...filteredValues.endpoint,
                default: true,
                source_id: sourceId,
                scheme,
                host,
                port: isNaN(endPointPort) ? undefined : endPointPort,
                path
            };

            if (endpointId) {
                promises.push(getSourcesApi().updateEndpoint(endpointId, endpointData));
            } else {
                const endpoint = await getSourcesApi().createEndpoint(endpointData);
                endpointId = endpoint.id;
            }
        }

        if (filteredValues.authentication) {
            if (selectedAuthId) {
                promises.push(getSourcesApi().updateAuthentication(selectedAuthId, filteredValues.authentication));
            } else {
                const authenticationData = {
                    ...filteredValues.authentication,
                    resource_id: endpointId,
                    resource_type: 'Endpoint'
                };

                promises.push(getSourcesApi().createAuthentication(authenticationData));
            }
        }

        promises.push(doCreateApplication(sourceId, filteredValues.application.application_type_id));

        await Promise.all(promises);

        const isAttachingCostManagement = filteredValues.credentials || filteredValues.billing_source;
        if (isAttachingCostManagement) {
            const { credentials, billing_source } = filteredValues;
            let data = {};
            data = credentials ? { authentication: { credentials } } : {};
            data = billing_source ? { ...data, billing_source } : data;
            await patchSource({ id: sourceId, ...data });
        }
    } catch (error) {
        const errorMessage = await handleError(error);
        throw errorMessage;
    }
};
