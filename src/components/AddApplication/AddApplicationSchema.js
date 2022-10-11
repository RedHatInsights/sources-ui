import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';

import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useIntl } from 'react-intl';
import * as schemaBuilder from '../../components/addSourceWizard/schemaBuilder';
import get from 'lodash/get';

import authenticationSelectionStep from './schema/authenticationSelectionStep';
import generateFirstAuthStep from './schema/generateFirstAuthStep';
import selectAuthenticationStep from './schema/selectAuthenticationStep';
import emptyAuthType from '../addSourceWizard/emptyAuthType';
import { useFlag } from '@unleash/proxy-client-react';

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

const fields = (intl, sourceType, appType, authenticationValues, source, container, title, description, applicationTypes) => {
  let authenticationFields = [];
  let firstStep;
  let hasMultipleAuthTypes;
  let hasAlreadyType;
  const enableLighthouse = useFlag('sources.wizard.lighthouse');

  if (!source.imported) {
    const appendEndpoint = sourceType.schema.endpoint?.hidden ? sourceType.schema.endpoint?.fields : [];
    const hasEndpointStep = typeof sourceType.schema.endpoint === 'undefined' ? false : appendEndpoint.length === 0;

    const shouldAddEmpty =
      !appType.supported_authentication_types[sourceType.name] ||
      appType.supported_authentication_types[sourceType.name].length === 0;

    const authTypes = shouldAddEmpty ? [emptyAuthType.type] : appType.supported_authentication_types[sourceType.name];
    const authentications = shouldAddEmpty ? [emptyAuthType] : sourceType.schema.authentication;

    if (appType.supported_source_types.includes(sourceType.name)) {
      authTypes.forEach((authtype) => {
        authenticationFields.push(generateFirstAuthStep(sourceType, appType, appendEndpoint, authtype, intl, shouldAddEmpty));
      });
    }

    authentications.forEach((auth) => {
      if (appType.supported_source_types.includes(sourceType.name)) {
        const appAdditionalSteps = schemaBuilder.getAdditionalSteps(sourceType.name, auth.type, appType.name, enableLighthouse);

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
        className: 'sources',
        name: 'wizard',
        title,
        inModal: true,
        container,
        showTitles: true,
        crossroads: ['selectedAuthentication', 'authtype'],
        description,
        closeButtonAriaLabel: intl.formatMessage({
          id: 'wizard.close',
          defaultMessage: 'Close wizard',
        }),
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
