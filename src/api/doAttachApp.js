import { addedDiff, updatedDiff } from 'deep-object-diff';
import { patchSource } from '@redhat-cloud-services/frontend-components-sources/cjs/costManagementAuthentication';
import { handleError } from '@redhat-cloud-services/frontend-components-sources/cjs/handleError';
import { checkAppAvailability } from '@redhat-cloud-services/frontend-components-sources/cjs/getApplicationStatus';
import { timeoutedApps } from '@redhat-cloud-services/frontend-components-sources/cjs/constants';

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

export const doAttachApp = async (
    values, formApi, authenticationInitialValues, initialValues, appTypes = []
) => {
    let appId;

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
        if (!allFormValues?.source?.id) {
            throw 'Missing source id';
        }

        const sourceId = allFormValues.source.id;
        let endpointId = allFormValues?.endpoint?.id;

        const promises = [];

        if (filteredValues.source && !isEmpty(filteredValues.source)) {
            promises.push(getSourcesApi().updateSource(sourceId, filteredValues.source));
        } else {
            promises.push(Promise.resolve(undefined));
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

                promises.push(getSourcesApi().createEndpoint(createEndpointData));
            }
        } else {
            promises.push(Promise.resolve(undefined));
        }

        if (filteredValues.application?.application_type_id) {
            promises.push(doCreateApplication(sourceId, filteredValues.application.application_type_id));
        } else {
            promises.push(Promise.resolve(undefined));
        }

        // eslint-disable-next-line no-unused-vars
        const [_sourceDataOut, endpointDataOut, applicationDataOut] = await Promise.all(promises);

        let authenticationDataOut;

        if (filteredValues.authentication && !isEmpty(filteredValues.authentication)) {
            if (selectedAuthId) {
                authenticationDataOut = await getSourcesApi().updateAuthentication(selectedAuthId, filteredValues.authentication);
            } else {
                const authenticationData = {
                    ...filteredValues.authentication,
                    resource_id: endpointDataOut?.id || applicationDataOut?.id,
                    resource_type: endpointDataOut?.id ? 'Endpoint' : 'Application'
                };

                authenticationDataOut = await getSourcesApi().createAuthentication(authenticationData);
            }
        }

        appId = applicationDataOut?.id;

        const authenticationId = selectedAuthId || authenticationDataOut?.id;

        const promisesSecondRound = [];

        if (applicationDataOut?.id && authenticationId) {
            const authAppData = {
                application_id: applicationDataOut.id,
                authentication_id: authenticationId
            };

            promisesSecondRound.push(getSourcesApi().createAuthApp(authAppData));
        }

        const isAttachingCostManagement = filteredValues.credentials || filteredValues.billing_source;
        if (isAttachingCostManagement) {
            const { credentials, billing_source } = filteredValues;
            let data = {};
            data = credentials ? { authentication: { credentials } } : {};
            data = billing_source ? { ...data, billing_source } : data;
            promisesSecondRound.push(patchSource({ id: sourceId, ...data }));
        }

        await Promise.all(promisesSecondRound);

        if (applicationDataOut) {
            const timeout = timeoutedApps(appTypes).includes(applicationDataOut.application_type_id) ? 10000 : 0;
            return await checkAppAvailability(applicationDataOut.id, timeout);
        }

        return {};
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        if (appId) {
            await getSourcesApi().deleteApplication(appId);
        }

        const errorMessage = await handleError(error);
        throw errorMessage;
    }
};
