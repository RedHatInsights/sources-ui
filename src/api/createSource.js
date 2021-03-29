import { handleError } from './handleError';

import { getSourcesApi } from './entities';
import { checkAppAvailability } from './getApplicationStatus';
import checkSourceStatus from './checkSourceStatus';
import { NO_APPLICATION_VALUE } from '../components/addSourceWizard/stringConstants';

export const parseUrl = (url) => {
  if (!url) {
    return {};
  }

  try {
    const u = new URL(url);
    return {
      scheme: u.protocol.replace(/:$/, ''),
      host: u.hostname,
      port: u.port,
      path: u.pathname,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return {};
  }
};

export const urlOrHost = (formData) => (formData.url ? parseUrl(formData.url) : formData);

export const handleErrorWrapper = (sourceId) => async (error) => await handleError(error, sourceId);

export const doCreateSource = async (formData, timetoutedApps = [], applicationTypes) => {
  let source;
  try {
    const payload = {
      sources: [{ ...formData.source, source_type_name: formData.source_type }],
      endpoints: [],
      authentications: [],
      applications: [],
    };

    const hasEndpoint = formData.url || formData.endpoint;
    if (hasEndpoint) {
      const { scheme, host, port, path } = urlOrHost(formData);

      const endPointPort = parseInt(port, 10);

      payload.endpoints.push({
        ...formData.endpoint,
        default: true,
        source_name: formData.source.name,
        scheme,
        host,
        port: isNaN(endPointPort) ? undefined : endPointPort,
        path,
      });
    }

    const hasApplication =
      formData.application?.application_type_id && formData.application?.application_type_id !== NO_APPLICATION_VALUE;

    if (hasApplication) {
      payload.applications.push({
        ...formData.application,
        source_name: formData.source.name,
      });
    }

    if (formData.authentication) {
      payload.authentications.push({
        ...formData.authentication,
        resource_type: hasEndpoint ? 'endpoint' : hasApplication ? 'application' : 'source',
        resource_name: formData.source.name,
        ...(hasEndpoint && { resource_name: urlOrHost(formData).host }),
        ...(hasApplication && {
          resource_name: applicationTypes?.find(({ id }) => id === formData.application.application_type_id)?.name,
        }),
      });
    }

    const dataOut = await getSourcesApi().bulkCreate(payload);

    source = dataOut.sources?.[0];
    let app = dataOut.applications?.[0];
    let endpoint = dataOut.endpoints?.[0];

    await checkSourceStatus(source.id);

    if (app) {
      const timeout = timetoutedApps.includes(app.application_type_id) ? 10000 : 0;
      app = await checkAppAvailability(app.id, timeout);
    }

    if (endpoint) {
      endpoint = await checkAppAvailability(endpoint.id, undefined, undefined, 'getEndpoint');
    }

    return {
      ...source,
      endpoint: [endpoint].filter(Boolean),
      applications: [app].filter(Boolean),
    };
  } catch (error) {
    const errorMessage = await handleError(error, source ? source.id : undefined);
    throw errorMessage;
  }
};
