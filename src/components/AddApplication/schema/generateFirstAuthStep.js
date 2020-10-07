import * as schemaBuilder from '@redhat-cloud-services/frontend-components-sources/cjs/schemaBuilder';

const generateFirstAuthStep = (type, appType, endpointFields, authtype, intl) => {
  let fields = [...endpointFields];

  if (schemaBuilder.shouldUseAppAuth(type.name, authtype, appType.name)) {
    fields = [];
  }

  const auth = type.schema.authentication.find(({ type }) => type === authtype);

  const additionalStepName = `${type.name}-${authtype}-${appType.name}-additional-step`;

  const skipEndpoint = schemaBuilder.shouldSkipEndpoint(type.name, authtype, appType.name);
  const customSteps = schemaBuilder.hasCustomSteps(type.name, authtype, appType.name);

  let nextStep;

  if (schemaBuilder.getAdditionalSteps(type.name, authtype, appType.name).length > 0) {
    nextStep = additionalStepName;
  } else if (endpointFields.length === 0 && !skipEndpoint) {
    nextStep = `${type.name}-endpoint`;
  } else {
    nextStep = 'summary';
  }

  const additionalIncludesStepKeys = schemaBuilder.getAdditionalStepKeys(type.name, authtype, appType.name);
  const hasCustomStep = schemaBuilder.shouldSkipSelection(type.name, authtype, appType.name);

  let stepProps = {};

  if (hasCustomStep) {
    const firstAdditonalStep = schemaBuilder.getAdditionalSteps(type.name, authtype, appType.name).find(({ name }) => !name);
    const additionalFields = schemaBuilder.getAdditionalStepFields(auth.fields, additionalStepName);

    if (firstAdditonalStep.nextStep) {
      nextStep = firstAdditonalStep.nextStep;
    } else if (endpointFields.length === 0 && !skipEndpoint && !customSteps) {
      nextStep = `${type.name}-endpoint`;
    } else {
      nextStep = 'summary';
    }

    stepProps = {
      ...firstAdditonalStep,
      fields: [
        ...fields,
        ...schemaBuilder.injectAuthFieldsInfo(
          [...firstAdditonalStep.fields, ...additionalFields],
          type.name,
          authtype,
          appType.name
        ),
      ],
    };
  }

  return {
    name: `${type.name}-${appType.id}-${authtype}`,
    title: intl.formatMessage({
      id: 'sources.configureCredentials',
      defaultMessage: 'Configure credentials',
    }),
    fields: [
      ...fields,
      ...schemaBuilder.getAdditionalAuthFields(type.name, authtype, appType.name),
      ...schemaBuilder.injectAuthFieldsInfo(
        schemaBuilder.getNoStepsFields(auth.fields, additionalIncludesStepKeys),
        type.name,
        authtype,
        appType.name
      ),
    ],
    nextStep,
    ...stepProps,
  };
};

export default generateFirstAuthStep;
