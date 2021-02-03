import generateFirstAuthStep from '../../../../components/AddApplication/schema/generateFirstAuthStep';

jest.mock('@redhat-cloud-services/frontend-components-sources/esm/schemaBuilder', () => ({
  __esModule: true,
  shouldSkipEndpoint: (type) => ['shouldskip', 'tosummary'].includes(type),
  hasCustomSteps: (type) => type === 'enhanced',
  getAdditionalSteps: (type) => {
    switch (type) {
      case 'enhanced':
        return [
          { fields: [{ component: 'description' }], nextStep: 'secondstep' },
          { name: 'secondstep', fields: [{ component: 'cosi' }] },
        ];
      case 'enhancedtoendpoint':
        return [{ fields: [{ component: 'description' }] }];
      case 'tosummary':
        return [{ fields: [{ component: 'description' }] }];
      case 'additional':
        return [{}];
      default:
        return [];
    }
  },
  getAdditionalStepKeys: () => [],
  shouldSkipSelection: (type) => ['enhanced', 'tosummary', 'enhancedtoendpoint'].includes(type),
  injectAuthFieldsInfo: (fields) => fields,
  getNoStepsFields: (fields) => fields,
  getAdditionalAuthFields: () => [],
  getAdditionalStepFields: () => [],
  shouldUseAppAuth: (typeName) => typeName === 'custom-authapp',
}));

describe('generateFirstAuthStep', () => {
  let TYPE;
  const APP_TYPE = {
    name: 'application_name',
    id: '123',
  };
  const ENDPOINT_FIELDS = [];
  const AUTHTYPE = 'arn';
  const INTL = { formatMessage: ({ defaultMessage }) => defaultMessage };

  it('generates step from API', () => {
    TYPE = {
      name: 'custom',
      schema: {
        authentication: [{ type: 'arn', fields: [{ component: 'text', name: 'username' }] }],
      },
    };

    const firstStep = generateFirstAuthStep(TYPE, APP_TYPE, ENDPOINT_FIELDS, AUTHTYPE, INTL);

    expect(firstStep).toEqual({
      name: `${TYPE.name}-${APP_TYPE.id}-${AUTHTYPE}`,
      nextStep: `${TYPE.name}-endpoint`,
      title: 'Configure credentials',
      fields: [
        {
          component: 'text',
          name: 'username',
        },
      ],
    });
  });

  it('generates step from API - with endpoint fields', () => {
    const ENDPOINT_FIELDS_FULL = [{ role: 'endpoint' }];

    TYPE = {
      name: 'custom',
      schema: {
        authentication: [{ type: 'arn', fields: [{ component: 'text', name: 'username' }] }],
      },
    };

    const firstStep = generateFirstAuthStep(TYPE, APP_TYPE, ENDPOINT_FIELDS_FULL, AUTHTYPE, INTL);

    expect(firstStep).toEqual({
      name: `${TYPE.name}-${APP_TYPE.id}-${AUTHTYPE}`,
      nextStep: `summary`,
      title: 'Configure credentials',
      fields: [
        ...ENDPOINT_FIELDS_FULL,
        {
          component: 'text',
          name: 'username',
        },
      ],
    });
  });

  it('generates step from API - should use appAuth', () => {
    const ENDPOINT_FIELDS_FULL = [{ role: 'endpoint' }];

    TYPE = {
      name: 'custom-authapp',
      schema: {
        authentication: [{ type: 'arn', fields: [{ component: 'text', name: 'username' }] }],
      },
    };

    const firstStep = generateFirstAuthStep(TYPE, APP_TYPE, ENDPOINT_FIELDS_FULL, AUTHTYPE, INTL);

    expect(firstStep).toEqual({
      name: `${TYPE.name}-${APP_TYPE.id}-${AUTHTYPE}`,
      nextStep: `summary`,
      title: 'Configure credentials',
      fields: [
        {
          component: 'text',
          name: 'username',
        },
      ],
    });
  });

  it('generates step from API - no endpoint', () => {
    TYPE = {
      name: 'shouldskip',
      schema: {
        authentication: [{ type: 'arn', fields: [{ component: 'text', name: 'username' }] }],
      },
    };

    const firstStep = generateFirstAuthStep(TYPE, APP_TYPE, ENDPOINT_FIELDS, AUTHTYPE, INTL);

    expect(firstStep).toEqual({
      name: `${TYPE.name}-${APP_TYPE.id}-${AUTHTYPE}`,
      nextStep: `summary`,
      title: 'Configure credentials',
      fields: [
        {
          component: 'text',
          name: 'username',
        },
      ],
    });
  });

  it('generates step with custom step', () => {
    TYPE = {
      name: 'enhanced',
      schema: {
        authentication: [{ type: 'arn', fields: [{ component: 'text', name: 'username' }] }],
      },
    };

    const firstStep = generateFirstAuthStep(TYPE, APP_TYPE, ENDPOINT_FIELDS, AUTHTYPE, INTL);

    expect(firstStep).toEqual({
      name: `${TYPE.name}-${APP_TYPE.id}-${AUTHTYPE}`,
      nextStep: `secondstep`,
      title: 'Configure credentials',
      fields: [
        {
          component: 'description',
        },
      ],
    });
  });

  it('generates step with additional step to endpoint', () => {
    TYPE = {
      name: 'enhancedtoendpoint',
      schema: {
        authentication: [{ type: 'arn', fields: [{ component: 'text', name: 'username' }] }],
      },
    };

    const firstStep = generateFirstAuthStep(TYPE, APP_TYPE, ENDPOINT_FIELDS, AUTHTYPE, INTL);

    expect(firstStep).toEqual({
      name: `${TYPE.name}-${APP_TYPE.id}-${AUTHTYPE}`,
      nextStep: `${TYPE.name}-endpoint`,
      title: 'Configure credentials',
      fields: [
        {
          component: 'description',
        },
      ],
    });
  });

  it('generates step with additional step to summary', () => {
    TYPE = {
      name: 'tosummary',
      schema: {
        authentication: [{ type: 'arn', fields: [{ component: 'text', name: 'username' }] }],
      },
    };

    const firstStep = generateFirstAuthStep(TYPE, APP_TYPE, ENDPOINT_FIELDS, AUTHTYPE, INTL);

    expect(firstStep).toEqual({
      name: `${TYPE.name}-${APP_TYPE.id}-${AUTHTYPE}`,
      nextStep: `summary`,
      title: 'Configure credentials',
      fields: [
        {
          component: 'description',
        },
      ],
    });
  });

  it('generates step with additional steps', () => {
    TYPE = {
      name: 'additional',
      schema: {
        authentication: [{ type: 'arn', fields: [{ component: 'text', name: 'username' }] }],
      },
    };

    const firstStep = generateFirstAuthStep(TYPE, APP_TYPE, ENDPOINT_FIELDS, AUTHTYPE, INTL);

    expect(firstStep).toEqual({
      name: `${TYPE.name}-${APP_TYPE.id}-${AUTHTYPE}`,
      nextStep: `${TYPE.name}-${AUTHTYPE}-${APP_TYPE.name}-additional-step`,
      title: 'Configure credentials',
      fields: [
        {
          component: 'text',
          name: 'username',
        },
      ],
    });
  });
});
