import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';

import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';

import { useIntl } from 'react-intl';
import * as schemaBuilder from '@redhat-cloud-services/frontend-components-sources/cjs/schemaBuilder';
import get from 'lodash/get';

import { AuthTypeCleaner } from './AuthTypeCleaner';
import AddApplicationDescription from './AddApplicationDescription';
import authenticationSelectionStep from './schema/authenticationSelectionStep';
import generateFirstAuthStep from './schema/generateFirstAuthStep';
import selectAuthenticationStep from './schema/selectAuthenticationStep';

export const ApplicationSummary = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'sources.reviewAddAppSummary',
          defaultMessage:
            'Review the information below and click Add to add the application to your source. Use the Back button to make changes.',
        })}
      </Text>
    </TextContent>
  );
};

export const hasAlreadySupportedAuthType = (authValues = [], appType, sourceTypeName) =>
  authValues.find(({ authtype }) => authtype === get(appType, `supported_authentication_types.${sourceTypeName}[0]`));

export const hasMultipleAuthenticationTypes = (app, sourceType) =>
  app.supported_source_types.includes(sourceType.name) && app.supported_authentication_types[sourceType.name]?.length > 1;

const fields = (applications = [], intl, sourceTypes, applicationTypes, authenticationValues, source, container) => {
  const hasAvailableApps = applications.length > 0;

  let nextStep = hasAvailableApps ? 'summary' : undefined;
  let authenticationFields = [];
  const sourceType = sourceTypes.find(({ id }) => id === source.source_type_id);

  if (!source.imported && hasAvailableApps) {
    const appendEndpoint = sourceType.schema.endpoint.hidden ? sourceType.schema.endpoint.fields : [];
    const hasEndpointStep = appendEndpoint.length === 0;

    applicationTypes.forEach((appType) => {
      if (appType.supported_source_types.includes(sourceType.name)) {
        appType.supported_authentication_types[sourceType.name].forEach((authtype) => {
          authenticationFields.push(generateFirstAuthStep(sourceType, appType, appendEndpoint, authtype, intl));
        });
      }
    });

    sourceType.schema.authentication.forEach((auth) => {
      applicationTypes.forEach((appType) => {
        if (appType.supported_source_types.includes(sourceType.name)) {
          const appAdditionalSteps = schemaBuilder.getAdditionalSteps(sourceType.name, auth.type, appType.name);

          if (appAdditionalSteps.length > 0) {
            authenticationFields.push(
              ...schemaBuilder.createAdditionalSteps(
                appAdditionalSteps,
                sourceType.name,
                auth.type,
                hasEndpointStep,
                auth.fields,
                appType.name
              )
            );
          }
        }
      });
    });

    if (hasEndpointStep) {
      authenticationFields.push(schemaBuilder.createEndpointStep(sourceType.schema.endpoint, sourceType.name));
    }

    nextStep = ({ values: { application } }) => {
      if (application) {
        const appType = applicationTypes.find(({ id }) => id === application.application_type_id);

        const hasMultipleAuthTypes = appType?.supported_authentication_types[sourceType.name]?.length > 1;

        if (hasMultipleAuthTypes) {
          return `selectAuthType-${application.application_type_id}`;
        }

        if (
          hasAlreadySupportedAuthType(
            authenticationValues,
            applicationTypes.find(({ id }) => id === application.application_type_id),
            sourceType.name
          )
        ) {
          return 'selectAuthentication';
        }

        const authType = appType?.supported_authentication_types[sourceType.name][0];

        return `${sourceType.name}-${application && application.application_type_id}-${authType}`;
      }
    };
  }

  const applicationSelection = {
    component: 'application-select',
    name: 'application.application_type_id',
    options: applications,
    container,
    validate: [
      {
        type: validatorTypes.REQUIRED,
      },
    ],
  };

  const selectionSteps = applicationTypes
    .filter((app) => hasMultipleAuthenticationTypes(app, sourceType))
    .map((app) => authenticationSelectionStep(sourceType, app, intl, authenticationValues));

  if (!source.imported && hasAvailableApps) {
    selectionSteps.push(
      selectAuthenticationStep({
        intl,
        source,
        authenticationValues,
        sourceType,
        applicationTypes,
      })
    );
  }

  return {
    fields: [
      {
        component: componentTypes.WIZARD,
        name: 'wizard',
        title: intl.formatMessage({
          id: 'sources.manageApps',
          defaultMessage: 'Manage applications',
        }),
        inModal: true,
        container,
        showTitles: true,
        crossroads: ['application.application_type_id', 'selectedAuthentication', 'authtype'],
        description: intl.formatMessage(
          {
            id: 'sources.addAppDescription',
            defaultMessage: 'Add or remove applications from {name}.',
          },
          { name: source.name }
        ),
        buttonLabels: {
          submit: intl.formatMessage({
            id: 'sources.add',
            defaultMessage: 'Add',
          }),
          cancel: intl.formatMessage({
            id: 'sources.cancel',
            defaultMessage: 'Cancel',
          }),
          back: intl.formatMessage({
            id: 'sources.back',
            defaultMessage: 'Back',
          }),
        },
        fields: [
          {
            nextStep,
            title: intl.formatMessage({
              id: 'sources.selectApp',
              defaultMessage: 'Add / remove applications',
            }),
            name: 'selectAppStep',
            fields: [
              {
                component: 'description',
                name: 'description',
                Content: AddApplicationDescription,
                container,
              },
              applicationSelection,
              {
                component: 'description',
                name: 'authtypesetter',
                Content: AuthTypeCleaner,
                hideField: true,
              },
            ],
          },
          {
            title: intl.formatMessage({
              id: 'sources.reviewDetails',
              defaultMessage: 'Review details',
            }),
            name: 'summary',
            fields: [
              {
                component: 'description',
                name: 'description-summary',
                Content: ApplicationSummary,
              },
              {
                component: 'summary',
                name: 'summary',
                sourceTypes,
                applicationTypes,
              },
            ],
          },
          ...selectionSteps,
          ...authenticationFields,
        ],
      },
    ],
  };
};

export default fields;
