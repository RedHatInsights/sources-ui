import get from 'lodash/get';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import hardcodedSchemas from '@redhat-cloud-services/frontend-components-sources/cjs/hardcodedSchemas';

export const createAuthFieldName = (fieldName, id) => `authentications.a${id}.${fieldName.replace('authentication.', '')}`;

export const getLastPartOfName = (fieldName) => fieldName.split('.').pop();

export const removeRequiredValidator = (validate = []) =>
  validate.filter((validation) => validation.type !== validatorTypes.REQUIRED && validation.type !== 'required-validator');

export const getEnhancedAuthField = (sourceType, authtype, name, appName = 'generic') =>
  get(hardcodedSchemas, [sourceType, 'authentication', authtype, appName, name], {});

export const getAdditionalAuthSteps = (sourceType, authtype, appName = 'generic') =>
  get(hardcodedSchemas, [sourceType, 'authentication', authtype, appName, 'additionalSteps'], []);

export const getAdditionalAuthStepsKeys = (sourceType, authtype, appName = 'generic') =>
  get(hardcodedSchemas, [sourceType, 'authentication', authtype, appName, 'includeStepKeyFields'], []);

export const getAdditionalFields = (auth, stepKey) => auth?.fields?.filter((field) => field.stepKey === stepKey) || [];

export const modifyAuthSchemas = (fields, id) =>
  fields.map((field) => {
    const editedName = field.name.startsWith('authentication') ? createAuthFieldName(field.name, id) : field.name;

    const finalField = {
      ...field,
      name: editedName,
    };

    const isPassword = getLastPartOfName(finalField.name) === 'password';

    if (isPassword) {
      finalField.component = 'authentication';
    }

    return finalField;
  });

const specialModifierAWS = (field, authtype) => {
  if (getLastPartOfName(field.name) !== 'password') {
    return field;
  }

  if (authtype === 'arn') {
    return {
      ...field,
      label: 'Cost Management ARN',
    };
  }

  if (authtype === 'cloud-meter-arn') {
    return {
      ...field,
      label: 'Subscription Watch ARN',
    };
  }

  return field;
};

export const authenticationFields = (authentications, sourceType, appName) => {
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
          !field.stepKey ||
          (field.stepKey && additionalStepKeys.includes(field.stepKey))
      )
      .map((field) => ({
        ...field,
        ...getEnhancedAuthField(sourceType.name, auth.authtype, field.name, appName),
      }));

    if (!appName && sourceType.name === 'amazon') {
      enhancedFields = enhancedFields.map((field) => specialModifierAWS(field, auth.authtype));
    }

    return modifyAuthSchemas(enhancedFields, auth.id);
  });
};
