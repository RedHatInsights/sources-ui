import React from 'react';
import get from 'lodash/get';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import { FormattedMessage } from 'react-intl';
import { doLoadRegions } from '../../../api/doLoadRegions';
import hardcodedSchemas from '../../../components/addSourceWizard/hardcodedSchemas';

export const createAuthFieldName = (fieldName, id) => `authentications.a${id}.${fieldName.replace('authentication.', '')}`;

export const createAuthAppFieldName = (fieldName, id) => `applications.a${id}.${fieldName.replace('application.', '')}`;

export const getLastPartOfName = (fieldName) => fieldName.split('.').pop();

export const removeRequiredValidator = (validate = []) =>
  validate.filter((validation) => validation.type !== validatorTypes.REQUIRED && validation.type !== 'required-validator');

export const getEnhancedAuthField = (sourceType, authtype, name, appName = 'generic') =>
  get(hardcodedSchemas, [sourceType, 'authentication', authtype, appName, name], {});

export const getAdditionalAuthSteps = (sourceType, authtype, appName = 'generic') =>
  get(hardcodedSchemas, [sourceType, 'authentication', authtype, appName, 'additionalSteps'], []);

export const getAdditionalAuthStepsKeys = (sourceType, authtype, appName = 'generic') =>
  get(hardcodedSchemas, [sourceType, 'authentication', authtype, appName, 'includeStepKeyFields'], []);

export const getAdditionalFields = (auth, stepKey) => auth?.fields?.filter((field) => stepKey && field.stepKey === stepKey) || [];

export const modifyAuthSchemas = (fields, id, appId) =>
  fields.map((field) => {
    let editedName = field.name.startsWith('authentication')
      ? createAuthFieldName(field.name, id)
      : field.name.startsWith('application')
      ? createAuthAppFieldName(field.name, appId)
      : field.name;

    const finalField = {
      ...field,
      name: editedName,
    };

    const isPassword = getLastPartOfName(finalField.name) === 'password';
    const isAwsRegion = getLastPartOfName(finalField.name) === 'bucket_region' && finalField.label.includes('AWS');
    const isExternalId = getLastPartOfName(finalField.name) === 'external_id';

    if (isPassword) {
      finalField.component = 'authentication';
    }

    if (isAwsRegion) {
      finalField.loadOptions = () => doLoadRegions().then((data) => data.map((item) => ({ value: item, label: item })));
    }

    if (isExternalId) {
      finalField.hideField = false;
      finalField.label = <FormattedMessage id="cost.arn.externalId" defaultMessage="External ID" />;
      finalField.component = 'clipboard-copy';
      finalField.isReadOnly = true;
    }

    return finalField;
  });

export const authenticationFields = (authentications, sourceType, appName, appId) => {
  if (!authentications || authentications.length === 0 || !sourceType.schema || !sourceType.schema.authentication) {
    return [];
  }

  return authentications.map((auth) => {
    const schemaAuth = sourceType?.schema?.authentication?.find(({ type }) => type === auth.authtype);

    if (!schemaAuth) {
      return [];
    }

    const additionalStepKeys = getAdditionalAuthStepsKeys(sourceType.name, auth.authtype, appName);
    const additionalStepsFields = getAdditionalAuthSteps(sourceType.name, auth.authtype, appName)
      ?.map((step) => ({
        ...step,
        fields: [...step.fields, ...getAdditionalFields(schemaAuth, step.name)],
      }))
      .map(({ fields }) => fields.map(({ name }) => name))
      .flatMap((x) => x);

    let enhancedFields = schemaAuth.fields
      .filter(
        (field) =>
          additionalStepsFields.includes(field.name) ||
          (!additionalStepsFields.length && !field.stepKey) ||
          (field.stepKey && additionalStepKeys.includes(field.stepKey)),
      )
      .map((field) => ({
        ...field,
        ...getEnhancedAuthField(sourceType.name, auth.authtype, field.name, appName),
      }));

    return modifyAuthSchemas(enhancedFields, auth.id, appId);
  });
};
