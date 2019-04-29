import axios from 'axios';
import { DefaultApi as SourcesDefaultApi } from '@redhat-cloud-services/sources-client';
import find from 'lodash/find';

import { sourcesViewDefinition } from '../views/sourcesViewDefinition';
import { SOURCES_API_BASE } from '../Utilities/Constants';

const axiosInstance = axios.create();
axiosInstance.interceptors.response.use(async (config) => {
    await window.insights.chrome.auth.getUser();
    return config;
});
axiosInstance.interceptors.response.use(response => response.data || response);
axiosInstance.interceptors.response.use(null, error => { throw { ...error.response }; });

let apiInstance;

export function getSourcesApi() {
    if (apiInstance) {
        return apiInstance;
    }

    apiInstance = new SourcesDefaultApi(undefined, SOURCES_API_BASE, axiosInstance);
    return apiInstance;
}

export const getEntities = (_pagination, filter) => {
    const filterFragment = filter.prefixed ? `?filter[source_type_id][eq]=${filter.prefixed}` : '';
    return axiosInstance.get(`${SOURCES_API_BASE}${sourcesViewDefinition.url}${filterFragment}`);
};

export function doRemoveSource(sourceId) {
    return getSourcesApi().deleteSource(sourceId).then((sourceDataOut) => {
        console.log('API call deleteSource returned data: ', sourceDataOut);
    }, (_error) => {
        console.error('Source removal failed.');
        throw { error: 'Source removal failed.' };
    });
}

export function doLoadSourceForEdit(sourceId) {
    return getSourcesApi().showSource(sourceId).then(sourceData => {
        console.log('API call showSource returned: ', sourceData);

        return getSourcesApi().listSourceEndpoints(sourceId, {}).then(endpoints => {
            console.log('API call listSourceEndpoints returned: ', endpoints);

            // we take just the first endpoint
            const endpoint = endpoints && endpoints.data && endpoints.data[0];

            if (!endpoint) { // bail out
                return sourceData;
            }

            sourceData.endpoint = endpoint;

            return getSourcesApi().listEndpointAuthentications(endpoint.id, {}).then(authentications => {
                console.log('API call listEndpointAuthentications returned: ', authentications);

                // we take just the first authentication
                const authentication = authentications && authentications.data && authentications.data[0];

                if (authentication) {
                    sourceData.authentication = authentication;
                }

                return sourceData;
            });
        });
    });
}

const parseUrl = url => {
    if (!url) {
        return ({});
    }

    try {
        const u = new URL(url);
        return {
            scheme: u.protocol.replace(/:$/, ''),
            host: u.hostname,
            port: u.port,
            path: u.pathname
        };
    } catch (error) {
        console.log(error);
        return ({});
    }
};

/*
 * If there's an URL in the formData, parse it and use it,
 * else use individual fields (scheme, host, port, path).
 */
const urlOrHost = formData => formData.url ? parseUrl(formData.url) : formData;

export function doCreateSource(formData, sourceTypes) {
    let sourceData = {
        name: formData.source_name,
        source_type_id: find(sourceTypes, { name: formData.source_type }).id
    };

    return getSourcesApi().createSource(sourceData).then((sourceDataOut) => {
        const { scheme, host, port, path } = urlOrHost(formData);

        const endpointData = {
            source_id: parseInt(sourceDataOut.id, 10),
            role: formData.role,
            scheme,
            host,
            port: parseInt(port, 10),
            path,
            verify_ssl: formData.verify_ssl,
            certificate_authority: formData.certificate_authority
        };

        return getSourcesApi().createEndpoint(endpointData).then((endpointDataOut) => {
            const authenticationData = {
                resource_id: parseInt(endpointDataOut.id, 10),
                resource_type: 'Endpoint',
                password: formData.token || formData.password
            };

            return getSourcesApi().createAuthentication(authenticationData).then((authenticationDataOut) => {
                return authenticationDataOut;
            }, (_error) => {
                console.error('Authentication creation failure.');
                throw { error: 'Authentication creation failure.' };
            });
        }, (_error) => {
            console.error('Endpoint creation failure.');
            throw { error: 'Endpoint creation failure.' };
        });

    }, (_error) => {
        console.error('Source creation failure.');
        throw { error: 'Source creation failure.' };
    });
}

export function doUpdateSource(source, formData) {
    const inst = getSourcesApi();

    let sourceData = {
        name: formData.source_name
    };

    return inst.updateSource(source.id, sourceData)
    .then((_sourceDataOut) => {
        const { scheme, host, port, path } = urlOrHost(formData);

        const endpointData = {
            scheme,
            host,
            port: parseInt(port, 10),
            path,
            verify_ssl: formData.verify_ssl,
            certificate_authority: formData.certificate_authority
        };

        return inst.updateEndpoint(source.endpoint.id, endpointData)
        .then((_endpointDataOut) => {
            const authenticationData = {
                // FIXME: missing USER here?
                password: formData.token || formData.password // FIXME: unify
            };

            return inst.updateAuthentication(source.authentication.id, authenticationData)
            .then((authenticationDataOut) => {
                return authenticationDataOut;
            }, (_error) => {
                console.error('Authentication update failure.');
                throw { error: 'Authentication update failure.' };
            });
        }, (_error) => {
            console.error('Endpoint update failure.');
            throw { error: 'Endpoint update failure.' };
        });

    }, (_error) => {
        console.error('Source update failure.');
        throw { error: 'Source update failure.' };
    });
}

export const sourceTypeStrFromLocation = () => (
    window.appGroup === 'insights' ? 'amazon' :
        window.appGroup === 'hybrid' ? 'openshift' : null
);
