import axios from 'axios';
import { DefaultApi as SourcesDefaultApi } from '@redhat-cloud-services/sources-client';
import { Base64 } from 'js-base64';

import { SOURCES_API_BASE } from '../Utilities/Constants';

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

let apiInstance;

export const getSourcesApi = () =>
    apiInstance || (apiInstance = new SourcesDefaultApi(undefined, SOURCES_API_BASE, axiosInstance));

export const doLoadAppTypes = () =>
    axiosInstance.get(`${SOURCES_API_BASE}/application_types`);

export function doRemoveSource(sourceId) {
    return getSourcesApi().deleteSource(sourceId).catch((_error) => {
        throw { error: 'Source removal failed.' };
    });
}

export function doLoadSourceForEdit(sourceId) {
    return getSourcesApi().showSource(sourceId).then(sourceData => {
        return getSourcesApi().listSourceEndpoints(sourceId, {}).then(endpoints => {
            // we take just the first endpoint
            const endpoint = endpoints && endpoints.data && endpoints.data[0];

            if (!endpoint) { // bail out
                return sourceData;
            }

            sourceData.endpoint = endpoint;

            return getSourcesApi().listEndpointAuthentications(endpoint.id, {}).then(authentications => {
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
        return ({});
    }
};

/*
 * If there's an URL in the formData, parse it and use it,
 * else use individual fields (scheme, host, port, path).
 */
const urlOrHost = formData => formData.url ? parseUrl(formData.url) : formData;

export function doUpdateSource(source, formData) {
    const inst = getSourcesApi();

    let sourceData = {
        name: formData.source_name
    };

    return inst.updateSource(source.id, sourceData)
    .then((_sourceDataOut) => {
        const { scheme, host, port, path } = urlOrHost(formData);

        const endPointPort = parseInt(port, 10);

        const endpointData = {
            scheme,
            host,
            port: isNaN(endPointPort) ? undefined : endPointPort,
            path,
            verify_ssl: formData.verify_ssl,
            certificate_authority: formData.certificate_authority
        };

        return inst.updateEndpoint(source.endpoint.id, endpointData)
        .then((_endpointDataOut) => {
            const authenticationData = {
                username: formData.username,
                password: formData.token || formData.password // FIXME: unify
            };

            return inst.updateAuthentication(source.authentication.id, authenticationData)
            .then((authenticationDataOut) => {
                return authenticationDataOut;
            }, (_error) => {
                throw { error: 'Authentication update failure.' };
            });
        }, (_error) => {
            throw { error: 'Endpoint update failure.' };
        });

    }, (_error) => {
        throw { error: 'Source update failure.' };
    });
}

/* Source type limitation by location (URL). Now disabled.
 *
 *  export const sourceTypeStrFromLocation = () => (
 *      window.appGroup === 'insights' ? 'amazon' :
 *          window.appGroup === 'hybrid' ? 'openshift' : null
 * );
 */
export const sourceTypeStrFromLocation = () => null;

// Loads all sources with endpoints and applications infor
export const doLoadEntities = () => getSourcesApi().postGraphQL({
    query: `{ sources 
        { id, 
          created_at,
          source_type_id,
          name,
          tenant,
          uid,
          updated_at
          applications { application_type_id, id },
          endpoints { id, scheme, host, port, path } }}`
}).then(({ data }) => data);

export const doCreateApplication = (source_id, application_type_id) => getSourcesApi().createApplication({
    source_id,
    application_type_id
});

export const doDeleteApplication = (appId) => getSourcesApi().deleteApplication(appId);
