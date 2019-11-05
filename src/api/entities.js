import axios from 'axios';
import { DefaultApi as SourcesDefaultApi } from '@redhat-cloud-services/sources-client';
import { Base64 } from 'js-base64';

import { SOURCES_API_BASE } from '../Utilities/Constants';
import { defaultPort } from '../components/SourcesSimpleView/formatters';

const axiosInstance = axios.create(
    process.env.FAKE_IDENTITY ? {
        headers: {
            common: {
                'x-rh-identity': Base64.encode(
                    JSON.stringify(
                        {
                            identity: { account_number: process.env.FAKE_IDENTITY }
                        }
                    )
                )
            }
        }
    } : {}
);

axiosInstance.interceptors.request.use(async (config) => {
    await window.insights.chrome.auth.getUser();
    return config;
});
axiosInstance.interceptors.response.use(response => response.data || response);
axiosInstance.interceptors.response.use(null, error => { throw { ...error.response }; });
axiosInstance.interceptors.response.use(response => {
    if (response.errors && response.errors.length > 0) {
        return Promise.reject({ detail: response.errors[0].message });
    }

    return response;
});

let apiInstance;

export const getSourcesApi = () =>
    apiInstance || (apiInstance = new SourcesDefaultApi(undefined, SOURCES_API_BASE, axiosInstance));

export const doLoadAppTypes = () =>
    axiosInstance.get(`${SOURCES_API_BASE}/application_types`);

export function doRemoveSource(sourceId) {
    return getSourcesApi().deleteSource(sourceId).catch((data) => {
        throw { error: { detail: data.data.errors[0].detail } };
    });
}

export const doLoadSourceForEdit = sourceId => Promise.all([
    getSourcesApi().showSource(sourceId),
    getSourcesApi().listSourceEndpoints(sourceId, {})
]).then(([sourceData, endpoints]) => {
    const endpoint = endpoints && endpoints.data && endpoints.data[0];

    if (!endpoint) { // bail out
        return sourceData;
    }

    sourceData.endpoint = endpoint;

    return getSourcesApi().listEndpointAuthentications(endpoint.id, {}).then(authentications => {
        const authentication = authentications && authentications.data && authentications.data[0];

        if (authentication) {
            sourceData.authentication = authentication;
        }

        return { ...sourceData, source: { name: sourceData.name } };
    });
});

const parseUrl = url => {
    if (!url) {
        return ({});
    }

    try {
        const u = new URL(url);
        return {
            scheme: u.protocol.replace(/:$/, ''),
            host: u.hostname,
            port: u.port === '' ? defaultPort(u.protocol.replace(/:$/, '')) : u.port,
            path: u.pathname
        };
    } catch (error) {
        return ({});
    }
};

const urlOrHost = formData => formData.url ? parseUrl(formData.url) : formData.endpoint ? formData.endpoint : formData;

export const doUpdateSource = (source, formData, errorTitles) => {
    const { scheme, host, port, path } = urlOrHost(formData);
    const endPointPort = parseInt(port, 10);

    const endpointData = {
        scheme,
        host,
        path,
        port: isNaN(endPointPort) ? undefined : endPointPort,
        ...formData.endpoint
    };

    return Promise.all([
        getSourcesApi().updateSource(source.id, formData.source).catch((error) => {
            throw { error: { title: errorTitles.source, detail: error.data.errors[0].detail } };
        }),
        getSourcesApi().updateEndpoint(source.endpoint.id, endpointData).catch((error) => {
            throw { error: { title: errorTitles.endpoint, detail: error.data.errors[0].detail } };
        }),
        getSourcesApi().updateAuthentication(source.authentication.id, formData.authentication).catch((error) => {
            throw { error: { title: errorTitles.authentication, detail: error.data.errors[0].detail } };
        })
    ]);
};

export const doLoadEntities = () => getSourcesApi().postGraphQL({
    query: `{ sources
        {
            id,
            created_at,
            source_type_id,
            name,
            tenant,
            uid,
            updated_at,
            imported,
            applications { application_type_id, id },
            endpoints { id, scheme, host, port, path }
        }
    }`
}).then(({ data }) => data);

export const doCreateApplication = (source_id, application_type_id) => getSourcesApi().createApplication({
    source_id,
    application_type_id
});

export const doDeleteApplication = (appId, errorMessage) =>
    getSourcesApi()
    .deleteApplication(appId)
    .catch(({ data: { errors: [{ detail }] } }) => { throw { error: { title: errorMessage, detail } };});
