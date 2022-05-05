import React from 'react';
import { FormattedMessage } from 'react-intl';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import hardcodedSchemas from './hardcodedSchemas';
import get from 'lodash/get';
import emptyAuthType from './emptyAuthType';

export const shouldAppendEmptyType = (type, appTypes) =>
  appTypes.some(
    ({ supported_source_types, supported_authentication_types }) =>
      supported_source_types.includes(type.name) &&
      (!supported_authentication_types[type.name] || !supported_authentication_types[type.name].length === 0)
  );

export const acronymMapper = (value) =>
  ({
    'Amazon Web Services': 'AWS',
  }[value] || value);

export const hardcodedSchema = (typeName, authName, appName) =>
  get(hardcodedSchemas, [typeName, 'authentication', authName, appName], undefined);

export const getAdditionalSteps = (typeName, authName, appName = 'generic') =>
  get(hardcodedSchemas, [typeName, 'authentication', authName, appName, 'additionalSteps'], []);

export const shouldSkipSelection = (typeName, authName, appName = 'generic') =>
  get(hardcodedSchemas, [typeName, 'authentication', authName, appName, 'skipSelection'], false);

export const shouldSkipEndpoint = (typeName, authName, appName = 'generic') =>
  get(hardcodedSchemas, [typeName, 'authentication', authName, appName, 'skipEndpoint'], false);

export const hasCustomSteps = (typeName, authName, appName = 'generic') =>
  get(hardcodedSchemas, [typeName, 'authentication', authName, appName, 'customSteps'], false);

export const getAdditionalStepKeys = (typeName, authName, appName = 'generic') =>
  get(hardcodedSchemas, [typeName, 'authentication', authName, appName, 'includeStepKeyFields'], []);

export const getOnlyHiddenFields = (typeName, authName, appName = 'generic') =>
  get(hardcodedSchemas, [typeName, 'authentication', authName, appName, 'onlyHiddenFields'], false);

export const getAdditionalStepFields = (fields, stepKey) =>
  fields.filter((field) => field.stepKey === stepKey).map(({ stepKey: _stepKey, ...field }) => field);

export const shouldUseAppAuth = (typeName, authName, appName = 'generic') =>
  get(hardcodedSchemas, [typeName, 'authentication', authName, appName, 'useApplicationAuth'], false);

export const getNoStepsFields = (fields, additionalStepKeys = []) =>
  fields.filter((field) => !field.stepKey || additionalStepKeys.includes(field.stepKey));

export const injectAuthFieldsInfo = (fields, type, auth, applicationName) =>
  fields.map((field) => {
    const specificFields = get(hardcodedSchemas, [type, 'authentication', auth, applicationName]);

    const hardcodedField = specificFields
      ? get(specificFields, field.name)
      : get(hardcodedSchemas, [type, 'authentication', auth, 'generic', field.name]);

    const resultedField = hardcodedField ? { ...field, ...hardcodedField } : field;

    if (resultedField.name === 'authentication.password') {
      resultedField.component = 'authentication';
    }

    return resultedField;
  });

export const injectEndpointFieldsInfo = (fields, type) =>
  fields.map((field) => {
    const hardcodedField = get(hardcodedSchemas, [type, 'endpoint', field.name]);

    return hardcodedField ? { ...field, ...hardcodedField } : field;
  });

export const getAdditionalAuthFields = (type, auth, applicationName = 'generic') =>
  get(hardcodedSchemas, [type, 'authentication', auth, applicationName, 'additionalFields'], []);

export const getAdditionalEndpointFields = (type) => get(hardcodedSchemas, [type, 'endpoint', 'additionalFields'], []);

export const createEndpointStep = (endpoint, typeName) => ({
  ...endpoint,
  fields: [...getAdditionalEndpointFields(typeName), ...injectEndpointFieldsInfo(endpoint.fields, typeName)],
  name: `${typeName}-endpoint`,
  nextStep: 'summary',
});

export const createAdditionalSteps = (additionalSteps, name, authName, hasEndpointStep, fields, appName = 'generic') =>
  additionalSteps.map((step) => {
    const stepKey = step.name || `${name}-${authName}-${appName}-additional-step`;

    const skipEndpoint = shouldSkipEndpoint(name, authName, appName);
    const customSteps = hasCustomSteps(name, authName, appName);

    return {
      name: stepKey,
      nextStep: hasEndpointStep && !skipEndpoint && !customSteps ? `${name}-endpoint` : 'summary',
      ...step,
      fields: [
        ...injectAuthFieldsInfo(step.fields, name, authName, appName),
        ...injectAuthFieldsInfo(getAdditionalStepFields(fields, stepKey), name, authName, appName),
      ],
    };
  });

export const createAuthTypeSelection = (
  type,
  appType = { name: 'generic', id: 'generic' },
  endpointFields,
  disableAuthType,
  hasEndpointStep
) => {
  const isGeneric = appType.name === 'generic';

  const auths = type.schema.authentication;
  const supportedAuthTypes = isGeneric
    ? auths.map(({ type }) => type)
    : appType.supported_authentication_types[type.name] || [emptyAuthType.type];

  const hasMultipleAuthTypes = supportedAuthTypes.length > 1;

  const stepMapper = {};

  let fields = [...endpointFields];

  if (hasMultipleAuthTypes) {
    fields = [];
    auths
      .filter(({ type }) => supportedAuthTypes.includes(type))
      .forEach((auth) => {
        const hasHardcodedSchema = hardcodedSchema(type.name, auth.type, appType.name);
        const hardcodedAppName = hasHardcodedSchema ? appType.name : 'generic';

        const skipEndpoint = shouldSkipEndpoint(type.name, auth.type, hardcodedAppName);
        const customSteps = hasCustomSteps(type.name, auth.type, hardcodedAppName);
        const onlyHiddenFields = getOnlyHiddenFields(type.name, auth.type, hardcodedAppName);
        const additionalIncludesStepKeys = getAdditionalStepKeys(type.name, auth.type, hardcodedAppName);
        const authFields = onlyHiddenFields ? auth.fields.filter(({ hideField }) => hideField) : auth.fields;

        let nextStep;

        if (getAdditionalSteps(type.name, auth.type, hardcodedAppName).length > 0) {
          nextStep = `${type.name}-${auth.type}-${hardcodedAppName}-additional-step`;
        } else if (endpointFields.length === 0 && !skipEndpoint && !customSteps && hasEndpointStep) {
          nextStep = `${type.name}-endpoint`;
        } else {
          nextStep = 'summary';
        }

        fields.push({
          component: 'auth-select',
          name: 'auth_select',
          label: auth.name,
          authName: auth.type,
          validate: [
            {
              type: validatorTypes.REQUIRED,
            },
          ],
          supportedAuthTypes,
          disableAuthType,
        });
        fields.push({
          component: componentTypes.SUB_FORM,
          name: `${auth.type}-subform`,
          className: 'pf-u-pl-md',
          fields: [
            ...(!shouldUseAppAuth(type.name, auth.type, hardcodedAppName) ? endpointFields : []),
            ...getAdditionalAuthFields(type.name, auth.type, hardcodedAppName),
            ...injectAuthFieldsInfo(
              getNoStepsFields(authFields, additionalIncludesStepKeys),
              type.name,
              auth.type,
              hardcodedAppName
            ),
          ],
          condition: {
            when: 'auth_select',
            is: auth.type,
          },
          hideField: onlyHiddenFields,
        });
        stepMapper[auth.type] = nextStep;
      });

    return {
      name: `${type.name}-${appType.id}`,
      title: <FormattedMessage id="wizard.credentials" defaultMessage="Credentials" />,
      fields,
      nextStep: {
        when: 'auth_select',
        stepMapper,
      },
    };
  } else {
    const auth = isGeneric
      ? auths[0]
      : [emptyAuthType, ...auths].find(({ type: authType }) => supportedAuthTypes.includes(authType));

    const hasHardcodedSchema = hardcodedSchema(type.name, auth.type, appType.name);
    const hardcodedAppName = hasHardcodedSchema ? appType.name : 'generic';

    const additionalStepName = `${type.name}-${auth.type}-${hardcodedAppName}-additional-step`;

    const skipEndpoint = shouldSkipEndpoint(type.name, auth.type, hardcodedAppName);
    const customSteps = hasCustomSteps(type.name, auth.type, hardcodedAppName);
    const hasCustomStep = shouldSkipSelection(type.name, auth.type, hardcodedAppName);
    const additionalIncludesStepKeys = getAdditionalStepKeys(type.name, auth.type, hardcodedAppName);

    if (shouldUseAppAuth(type.name, auth.type, hardcodedAppName)) {
      fields = [];
    }

    let nextStep;

    if (getAdditionalSteps(type.name, auth.type, hardcodedAppName).length > 0) {
      nextStep = additionalStepName;
    } else if (endpointFields.length === 0 && !skipEndpoint && hasEndpointStep) {
      nextStep = `${type.name}-endpoint`;
    } else {
      nextStep = 'summary';
    }

    let stepProps = {};

    if (hasCustomStep) {
      const firstAdditonalStep = getAdditionalSteps(type.name, auth.type, hardcodedAppName).find(({ name }) => !name);
      const additionalFields = getAdditionalStepFields(auth.fields, additionalStepName);

      if (firstAdditonalStep.nextStep) {
        nextStep = firstAdditonalStep.nextStep;
      } else if (endpointFields.length === 0 && !skipEndpoint && !customSteps && hasEndpointStep) {
        nextStep = `${type.name}-endpoint`;
      } else {
        nextStep = 'summary';
      }

      stepProps = {
        ...firstAdditonalStep,
        fields: [
          ...fields,
          ...injectAuthFieldsInfo([...firstAdditonalStep.fields, ...additionalFields], type.name, auth.type, hardcodedAppName),
        ],
      };
    }

    return {
      name: `${type.name}-${appType.id}`,
      title: <FormattedMessage id="wizard.credentials" defaultMessage="Credentials" />,
      fields: [
        ...fields,
        ...getAdditionalAuthFields(type.name, auth.type, hardcodedAppName),
        ...injectAuthFieldsInfo(
          getNoStepsFields(auth.fields, additionalIncludesStepKeys),
          type.name,
          auth.type,
          hardcodedAppName
        ),
      ],
      nextStep,
      ...stepProps,
    };
  }
};

export const createSpecificAuthTypeSelection = (type, appType, endpointFields, disableAuthType, hasEndpointStep) => {
  const auths = type.schema.authentication;
  const supportedAuthTypes = appType.supported_authentication_types[type.name] || [emptyAuthType.type];

  const hasMultipleAuthTypes = supportedAuthTypes.length > 1;

  let fields = [...endpointFields];
  const stepMapper = {};

  if (hasMultipleAuthTypes) {
    fields = [];
    auths
      .filter(({ type: authType }) => supportedAuthTypes.includes(authType))
      .forEach((auth) => {
        const appName = hardcodedSchema(type.name, auth.type, appType.name) ? appType.name : 'generic';

        const skipEndpoint = shouldSkipEndpoint(type.name, auth.type, appName);
        const customSteps = hasCustomSteps(type.name, auth.type, appName);

        let nextStep;

        if (getAdditionalSteps(type.name, auth.type, appType.name).length > 0) {
          nextStep = `${type.name}-${auth.type}-${appType.name}-additional-step`;
        } else if (endpointFields.length === 0 && !skipEndpoint && !customSteps && hasEndpointStep) {
          nextStep = `${type.name}-endpoint`;
        } else {
          nextStep = 'summary';
        }

        const additionalIncludesStepKeys = getAdditionalStepKeys(type.name, auth.type, appName);

        const onlyHiddenFields = getOnlyHiddenFields(type.name, auth.type, appName);
        const authFields = onlyHiddenFields ? auth.fields.filter(({ hideField }) => hideField) : auth.fields;

        fields.push({
          component: 'auth-select',
          name: 'auth_select',
          label: auth.name,
          authName: auth.type,
          validate: [
            {
              type: validatorTypes.REQUIRED,
            },
          ],
          supportedAuthTypes: appType.supported_authentication_types[type.name],
          disableAuthType,
        });
        fields.push({
          component: componentTypes.SUB_FORM,
          name: `${auth.type}-subform`,
          className: 'pf-u-pl-md',
          fields: [
            ...(!shouldUseAppAuth(type.name, auth.type, appName) ? endpointFields : []),
            ...getAdditionalAuthFields(type.name, auth.type, appName),
            ...injectAuthFieldsInfo(getNoStepsFields(authFields, additionalIncludesStepKeys), type.name, auth.type, appName),
          ],
          condition: {
            when: 'auth_select',
            is: auth.type,
          },
          hideField: onlyHiddenFields,
        });
        stepMapper[auth.type] = nextStep;
      });

    return {
      name: `${type.name}-${appType.id}`,
      title: <FormattedMessage id="wizard.chooseAuthType" defaultMessage="Choose authentication type" />,
      fields,
      nextStep: {
        when: 'auth_select',
        stepMapper,
      },
    };
  } else {
    const auth = [emptyAuthType, ...auths].find(({ type: authType }) => supportedAuthTypes.includes(authType));
    const appName = hardcodedSchema(type.name, auth.type, appType.name) ? appType.name : 'generic';

    const additionalStepName = `${type.name}-${auth.type}-${appType.name}-additional-step`;

    const skipEndpoint = shouldSkipEndpoint(type.name, auth.type, appName);
    const customSteps = hasCustomSteps(type.name, auth.type, appName);

    if (shouldUseAppAuth(type.name, auth.type, appName)) {
      fields = [];
    }

    let nextStep;

    if (getAdditionalSteps(type.name, auth.type, appName).length > 0) {
      nextStep = additionalStepName;
    } else if (endpointFields.length === 0 && !skipEndpoint && hasEndpointStep) {
      nextStep = `${type.name}-endpoint`;
    } else {
      nextStep = 'summary';
    }

    const additionalIncludesStepKeys = getAdditionalStepKeys(type.name, auth.type, appName);
    const hasCustomStep = shouldSkipSelection(type.name, auth.type, appName);

    let stepProps = {};

    if (hasCustomStep) {
      const firstAdditonalStep = getAdditionalSteps(type.name, auth.type, appName).find(({ name }) => !name);
      const additionalFields = getAdditionalStepFields(auth.fields, additionalStepName);

      if (firstAdditonalStep.nextStep) {
        nextStep = firstAdditonalStep.nextStep;
      } else if (endpointFields.length === 0 && !skipEndpoint && !customSteps && hasEndpointStep) {
        nextStep = `${type.name}-endpoint`;
      } else {
        nextStep = 'summary';
      }

      stepProps = {
        ...firstAdditonalStep,
        fields: [
          ...fields,
          ...injectAuthFieldsInfo([...firstAdditonalStep.fields, ...additionalFields], type.name, auth.type, appName),
        ],
      };
    }

    return {
      name: `${type.name}-${appType.id}`,
      title: <FormattedMessage id="wizard.credentials" defaultMessage="Credentials" />,
      fields: [
        ...fields,
        ...getAdditionalAuthFields(type.name, auth.type, appName),
        ...injectAuthFieldsInfo(getNoStepsFields(auth.fields, additionalIncludesStepKeys), type.name, auth.type, appName),
      ],
      nextStep,
      ...stepProps,
    };
  }
};

export const schemaBuilder = (sourceTypes, appTypes, disableAuthType) => {
  const schema = [];

  sourceTypes.forEach((type) => {
    const appendEndpoint = type.schema.endpoint?.hidden ? type.schema.endpoint.fields : [];
    const hasEndpointStep = type.schema.endpoint && appendEndpoint.length === 0;

    schema.push(createAuthTypeSelection(type, undefined, appendEndpoint, disableAuthType, hasEndpointStep));

    appTypes.forEach((appType) => {
      if (appType.supported_source_types.includes(type.name)) {
        schema.push(createAuthTypeSelection(type, appType, appendEndpoint, disableAuthType, hasEndpointStep));
      }
    });

    const auhtentications = type.schema.authentication;

    if (shouldAppendEmptyType(type, appTypes)) {
      auhtentications.push(emptyAuthType);
    }

    auhtentications.forEach((auth) => {
      const additionalSteps = getAdditionalSteps(type.name, auth.type);

      if (additionalSteps.length > 0) {
        schema.push(...createAdditionalSteps(additionalSteps, type.name, auth.type, hasEndpointStep, auth.fields));
      }

      appTypes.forEach((appType) => {
        const appAdditionalSteps = getAdditionalSteps(type.name, auth.type, appType.name);

        if (appAdditionalSteps.length > 0) {
          schema.push(
            ...createAdditionalSteps(appAdditionalSteps, type.name, auth.type, hasEndpointStep, auth.fields, appType.name)
          );
        }
      });
    });

    if (hasEndpointStep) {
      schema.push(createEndpointStep(type.schema.endpoint, type.name));
    }
  });

  return schema;
};
