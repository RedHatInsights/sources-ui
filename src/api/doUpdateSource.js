import { defaultPort } from '../components/SourcesTable/formatters';
import { getSourcesApi } from './entities';
import { patchCmValues } from './patchCmValues';

export const parseUrl = (url) => {
  if (url === null) {
    return {
      scheme: null,
      host: null,
      port: null,
      path: null,
    };
  }

  if (!url) {
    return {};
  }

  try {
    const u = new URL(url);
    const scheme = u.protocol.replace(/:$/, '');

    return {
      scheme,
      host: u.hostname,
      port: u.port === '' ? defaultPort(scheme) : u.port,
      path: u.pathname,
    };
  } catch (error) {
    return {};
  }
};

export const urlOrHost = (formData) =>
  formData.url || formData.url === null ? parseUrl(formData.url) : formData.endpoint ? formData.endpoint : formData;

export const doUpdateSource = (source, formData) => {
  const promises = [];

  if (formData.source) {
    promises.push(getSourcesApi().updateSource(source.source.id, formData.source));
  }

  if (formData.endpoint || formData.url || formData.url === null) {
    const { scheme, host, port, path } = urlOrHost(formData);
    const endPointPort = port === null ? null : parseInt(port, 10);

    const endpointData = {
      scheme,
      host,
      path,
      port: endPointPort === null ? null : isNaN(endPointPort) ? undefined : endPointPort,
      ...formData.endpoint,
    };

    promises.push(getSourcesApi().updateEndpoint(source.endpoints[0].id, endpointData));
  }

  if (formData.authentications) {
    Object.keys(formData.authentications).forEach((key) => {
      const idWithoutPrefix = key.replace('a', '');

      promises.push(getSourcesApi().updateAuthentication(idWithoutPrefix, formData.authentications[key]));
    });
  }

  if (formData.billing_source || formData.credentials) {
    let cmDataOut = {};

    if (formData.credentials) {
      cmDataOut = {
        authentication: {
          credentials: formData.credentials,
        },
      };
    }

    if (formData.billing_source) {
      cmDataOut = {
        ...cmDataOut,
        billing_source: formData.billing_source,
      };
    }

    promises.push(patchCmValues(source.source.id, cmDataOut));
  }

  return Promise.all(promises);
};
