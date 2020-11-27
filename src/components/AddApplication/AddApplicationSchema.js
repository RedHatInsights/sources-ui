import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';

import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';

import { useIntl } from 'react-intl';
import * as schemaBuilder from '@redhat-cloud-services/frontend-components-sources/cjs/schemaBuilder';
import get from 'lodash/get';

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

const fields = (intl, sourceType, appType, authenticationValues, source, container, title, description, applicationTypes) => {
  let authenticationFields = [];
  let firstStep;
  let hasMultipleAuthTypes;
  let hasAlreadyType;

  if (!source.imported) {
    const appendEndpoint = sourceType.schema.endpoint.hidden ? sourceType.schema.endpoint.fields : [];
    const hasEndpointStep = appendEndpoint.length === 0;

    if (appType.supported_source_types.includes(sourceType.name)) {
      appType.supported_authentication_types[sourceType.name].forEach((authtype) => {
        authenticationFields.push(generateFirstAuthStep(sourceType, appType, appendEndpoint, authtype, intl));
      });
    }

    sourceType.schema.authentication.forEach((auth) => {
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

    if (hasEndpointStep) {
      authenticationFields.push(schemaBuilder.createEndpointStep(sourceType.schema.endpoint, sourceType.name));
    }

    firstStep = authenticationFields[0];

    hasMultipleAuthTypes = appType?.supported_authentication_types[sourceType.name]?.length > 1;

    if (hasMultipleAuthTypes) {
      firstStep = authenticationSelectionStep(sourceType, appType, intl, authenticationValues);
    }

    hasAlreadyType = hasAlreadySupportedAuthType(authenticationValues, appType, sourceType.name);

    if (hasAlreadyType) {
      firstStep = selectAuthenticationStep({
        intl,
        source,
        authenticationValues,
        sourceType,
        app: appType,
        applicationTypes,
      });
    }
  }

  const appTypeSetter = {
    component: componentTypes.TEXT_FIELD,
    name: 'application.application_type_id',
    hideField: true,
    initialValue: appType.id,
  };

  return {
    fields: [
      {
        component: componentTypes.WIZARD,
        name: 'wizard',
        title,
        inModal: true,
        container,
        showTitles: true,
        crossroads: ['selectedAuthentication', 'authtype'],
        description,
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
          ...(source.imported
            ? []
            : [
                {
                  ...firstStep,
                  fields: [...firstStep.fields, appTypeSetter],
                },
              ]),
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
                sourceTypes: [sourceType],
                applicationTypes: [appType],
              },
              ...(source.imported ? [appTypeSetter] : []),
            ],
          },
          ...(hasAlreadyType || hasMultipleAuthTypes ? authenticationFields : authenticationFields.splice(1)),
        ],
      },
    ],
  };
};

export default fields;
