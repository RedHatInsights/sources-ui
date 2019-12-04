import { defaultPort } from '../components/SourcesSimpleView/formatters';
import { getSourcesApi } from './entities';

export const parseUrl = url => {
    if (!url) {
        return ({});
    }

    try {
        const u = new URL(url);
        const scheme =  u.protocol.replace(/:$/, '');

        return {
            scheme,
            host: u.hostname,
            port: u.port === '' ? defaultPort(scheme) : u.port,
            path: u.pathname
        };
    } catch (error) {
        return ({});
    }
};

export const urlOrHost = formData => formData.url ? parseUrl(formData.url) : formData.endpoint ? formData.endpoint : formData;

export const doUpdateSource = (source, formData, errorTitles) => {
    const promises = [];

    if (formData.source) {
        promises.push(getSourcesApi().updateSource(source.source.id, formData.source).catch((error) => {
            throw { error: { title: errorTitles.source, detail: error.errors[0].detail } };
        }));
    }

    if (formData.endpoint) {
        const { scheme, host, port, path } = urlOrHost(formData);
        const endPointPort = parseInt(port, 10);

        const endpointData = {
            scheme,
            host,
            path,
            port: isNaN(endPointPort) ? undefined : endPointPort,
            ...formData.endpoint
        };

        promises.push(getSourcesApi().updateEndpoint(source.endpoints[0].id, endpointData).catch((error) => {
            throw { error: { title: errorTitles.endpoint, detail: error.errors[0].detail } };
        }));
    }

    if (formData.authentications) {
        Object.keys(formData.authentications).forEach((key) => {
            const idWithoutPrefix = key.replace('a', '');

            promises.push(getSourcesApi().updateAuthentication(idWithoutPrefix, formData.authentications[key]).catch((error) => {
                throw { error: { title: errorTitles.authentication, detail: error.errors[0].detail } };
            }));
        });
    }

    return Promise.all(promises);
};
