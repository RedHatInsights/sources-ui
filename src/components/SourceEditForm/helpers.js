import get from 'lodash/get';
import set from 'lodash/set';

import { endpointToUrl, UNAVAILABLE } from '../../views/formatters';
import { APP_NAMES } from './parser/application';

export const CHECK_ENDPOINT_COMMAND = 'check-endpoint';

export const selectOnlyEditedValues = (values, editing) => {
  const filteredValues = {};

  Object.keys(editing)
    .filter((key) => editing[key])
    .forEach((key) => {
      set(filteredValues, key, get(values, key));
    });

  return filteredValues;
};

export const prepareInitialValues = ({ endpoints, authentications, applications, ...rest }, sourceTypeName) => {
  const auhenticationsFinal = {};

  const mergeAuths = [
    ...(authentications || []),
    ...(applications?.reduce((acc, curr) => [...acc, ...curr.authentications], []) || []),
  ];

  if (mergeAuths.length > 0) {
    mergeAuths.forEach((auth) => {
      auhenticationsFinal[`a${auth.id}`] = auth;
    });
  }

  let endpoint;
  let url;

  if (endpoints && endpoints.length > 0) {
    endpoint = endpoints[0];
  }

  if (endpoint) {
    url = endpoint.scheme || endpoint.host || endpoint.path || endpoint.port ? endpointToUrl(endpoint) : undefined;
  }

  const applicationsFinal = {};
  if (applications?.length > 0) {
    applications.forEach((app) => {
      if (app.extra && Object.keys(app.extra).length > 0) {
        applicationsFinal[`a${app.id}`] = { extra: app.extra };
      }
    });
  }

  return {
    source_type: sourceTypeName,
    endpoint,
    authentications: auhenticationsFinal,
    url,
    ...(Object.keys(applicationsFinal).length && {
      applications: applicationsFinal,
    }),
    ...rest,
  };
};

export const hasCostManagement = (source, appTypes) =>
  source.applications
    .map(({ application_type_id }) => application_type_id)
    .includes(appTypes.find(({ name }) => name === APP_NAMES.COST_MANAGAMENT)?.id);

const addIfUnique = (array, item) => !array.includes(item) && array.push(item);

export const getEditedApplications = (source, editing, appTypes) => {
  const editedApplications = [];

  const editedFields = Object.keys(editing);

  const costId = appTypes.find(({ name }) => name === APP_NAMES.COST_MANAGAMENT)?.id;

  editedFields.forEach((key) => {
    if (editing[key]) {
      const editedId = key.match(/.a\d+/)?.[0]?.replace('.a', '');

      if (key.startsWith('applications')) {
        addIfUnique(editedApplications, editedId);
      }

      if (key.startsWith('authentications')) {
        source.applications.forEach((app) =>
          app.authentications.forEach(
            ({ id, resource_type }) =>
              resource_type &&
              id === editedId &&
              addIfUnique(editedApplications, resource_type === 'Application' ? app.id : `${CHECK_ENDPOINT_COMMAND}-${app.id}`)
          )
        );
      }

      if (key.startsWith('billing_source') || key.startsWith('credentials')) {
        addIfUnique(
          editedApplications,
          source.applications.find(({ application_type_id }) => application_type_id === costId)?.id
        );
      }

      if (key.startsWith('url') || key.startsWith('endpoint')) {
        source.applications.forEach((app) =>
          app.authentications.forEach(
            ({ resource_type }) =>
              resource_type === 'Endpoint' && addIfUnique(editedApplications, `${CHECK_ENDPOINT_COMMAND}-${app.id}`)
          )
        );
      }
    }
  });

  return editedApplications.filter(Boolean);
};

export const prepareMessages = (source, intl) => {
  const messages = {};

  source.applications.forEach(({ id, availability_status_error, availability_status }) => {
    if (availability_status === UNAVAILABLE) {
      messages[id] = {
        title: intl.formatMessage({
          id: 'wizard.failEditToastTitleBeforeEdit',
          defaultMessage: 'This application is unavailable',
        }),
        description: availability_status_error,
        variant: 'danger',
      };
    }
  });

  if (source.endpoints?.[0]?.availability_status_error) {
    const applicationsUsingEndpoint = source.applications
      .map((app) => (app.authentications.find(({ resource_type }) => resource_type === 'Endpoint') ? app.id : undefined))
      .filter(Boolean);

    applicationsUsingEndpoint.forEach((id) => {
      messages[id] = {
        title: intl.formatMessage({
          id: 'wizard.failEditToastTitleBeforeEdit',
          defaultMessage: 'This application is unavailable',
        }),
        description: source.endpoints?.[0]?.availability_status_error,
        variant: 'danger',
      };
    });
  }

  return messages;
};
