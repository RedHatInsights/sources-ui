import { addedDiff, updatedDiff } from 'deep-object-diff';
import { patchSource, handleError } from '@redhat-cloud-services/frontend-components-sources';
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';

import { getSourcesApi, doCreateApplication } from './entities';
import { urlOrHost } from './doUpdateSource';

// modification of https://stackoverflow.com/a/38340374
export const removeEmpty = (obj) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') {
            if (isEmpty(obj[key])) {
                delete obj[key];
            } else {
                removeEmpty(obj[key]);
            }
        } else if (typeof obj[key] === 'undefined') {
            delete obj[key];
        }
    });
    return obj;
};

export const doAttachApp = async (values, formApi, authenticationInitialValues, initialValues) => {
    const formState = formApi.getState();

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

    const filteredValues = removeEmpty({
        ...merge(cloneDeep(newAddedValues), updatedValues),
        authentication: {
            ...merge(cloneDeep(newAddedAuthValues), updatedAuthValues)
        }
    });

    try {
        if (!allFormValues.source || !allFormValues.source.id) {
            throw 'Missing source id';
        }

        const sourceId = allFormValues.source.id;
        let endpointId = allFormValues.endpoint ? allFormValues.endpoint.id : undefined;

        const promises = [];

        if (filteredValues.source && !isEmpty(filteredValues.source)) {
            promises.push(getSourcesApi().updateSource(sourceId, filteredValues.source));
        }

        const hasModifiedEndpoint = filteredValues.endpoint && !isEmpty(filteredValues.endpoint);
        const hasModifiedUrl = filteredValues.url && !isEmpty(filteredValues.url);

        if (hasModifiedEndpoint || hasModifiedUrl) {
            const { scheme, host, port, path } = urlOrHost(filteredValues);

            const endPointPort = parseInt(port, 10);

            const endpointData = removeEmpty({
                ...filteredValues.endpoint,
                scheme,
                host,
                port: isNaN(endPointPort) ? undefined : endPointPort,
                path
            });

            if (endpointId) {
                promises.push(getSourcesApi().updateEndpoint(endpointId, endpointData));
            } else {
                const createEndpointData = {
                    ...endpointData,
                    default: true,
                    source_id: sourceId
                };

                const endpoint = await getSourcesApi().createEndpoint(createEndpointData);
                endpointId = endpoint.id;
            }
        }

        if (filteredValues.authentication && !isEmpty(filteredValues.authentication)) {
            if (selectedAuthId) {
                promises.push(getSourcesApi().updateAuthentication(selectedAuthId, filteredValues.authentication));
            } else if (endpointId) {
                const authenticationData = {
                    ...filteredValues.authentication,
                    resource_id: endpointId,
                    resource_type: 'Endpoint'
                };

                promises.push(getSourcesApi().createAuthentication(authenticationData));
            }
        }

        if (filteredValues.application && filteredValues.application.application_type_id) {
            promises.push(doCreateApplication(sourceId, filteredValues.application.application_type_id));
        }

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
