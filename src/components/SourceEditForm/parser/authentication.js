import get from 'lodash/get';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
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

    if (isPassword) {
      finalField.component = 'authentication';
    }

    return finalField;
  });

export const authenticationFields = (authentications, sourceType, appType, app) => {
  const onlyAppFields = Boolean((!authentications || authentications.length === 0) && Object.keys(app?.extra || {}).length);

  const authenticationsFinal = authentications || [];

  if (onlyAppFields) {
    const authtype = appType?.supported_authentication_types[sourceType.name]?.[0];

    if (authtype) {
      authenticationsFinal.push({ authtype });
    }
  }

  if (!authenticationsFinal.length || !sourceType.schema || !sourceType.schema.authentication) {
    return [];
  }

  return authenticationsFinal.map((auth) => {
    const schemaAuth = sourceType?.schema?.authentication?.find(({ type }) => type === auth.authtype);

    if (!schemaAuth) {
      return [];
    }

    const additionalStepKeys = getAdditionalAuthStepsKeys(sourceType.name, auth.authtype, appType?.name);
    const additionalStepsFields = getAdditionalAuthSteps(sourceType.name, auth.authtype, appType?.name)
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
          (field.stepKey && additionalStepKeys.includes(field.stepKey))
      )
      .map((field) => ({
        ...field,
        ...getEnhancedAuthField(sourceType.name, auth.authtype, field.name, appType?.name),
      }));

    return modifyAuthSchemas(enhancedFields, auth.id, app?.id);
  });
};
