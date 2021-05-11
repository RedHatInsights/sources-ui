import React from 'react';
import PauseIcon from '@patternfly/react-icons/dist/esm/icons/pause-icon';

import get from 'lodash/get';
import set from 'lodash/set';

import { endpointToUrl, UNAVAILABLE } from '../../views/formatters';

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

const addIfUnique = (array, item) => !array.includes(item) && array.push(item);

export const getEditedApplications = (source, editing) => {
  const editedApplications = [];

  const editedFields = Object.keys(editing);

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

export const prepareMessages = (source, intl, appTypes) => {
  const messages = {};

  source.applications.forEach(({ id, application_type_id, availability_status_error, availability_status, paused_at }) => {
    if (paused_at) {
      const application = appTypes.find((type) => type.id === application_type_id)?.display_name || id;
      messages[id] = {
        title: intl.formatMessage(
          {
            id: 'wizard.pausedApplication',
            defaultMessage: '{application} is paused',
          },
          { application }
        ),
        description: intl.formatMessage(
          {
            id: 'wizard.pausedApplicationDescription',
            defaultMessage:
              'To resume data collection for this application, switch {application} on in the <b>Applications</b> section of this page.',
          },
          // eslint-disable-next-line react/display-name
          { application, b: (chunks) => <b key="bold">{chunks}</b> }
        ),
        variant: 'default',
        customIcon: <PauseIcon />,
      };
    } else if (availability_status === UNAVAILABLE) {
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
      .map((app) =>
        app.authentications.find(({ resource_type }) => !app.paused_at && resource_type === 'Endpoint') ? app.id : undefined
      )
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
