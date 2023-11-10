import { createAuthTypeSelection } from '../../../../components/addSourceWizard/schemaBuilder';

jest.mock('../../../../components/addSourceWizard/hardcodedSchemas', () => ({
  openshiftAdditionalStep: {
    authentication: {
      token: {
        generic: {
          additionalSteps: [{}],
        },
      },
    },
  },
  useAppAuth: {
    authentication: {
      token: {
        generic: {
          useApplicationAuth: true,
        },
      },
    },
  },
}));

describe('generate auth selection pages', () => {
  let expectedSchema;
  const APPEND_ENDPOINT_FIELDS = [true];
  const EMPTY_APPEND_ENDPOINT = [];
  const NOT_EDITING = false;
  const HAS_ENDPOINT_STEP = true;
  const NO_APP = undefined;

  const ONE_SINGLE_SELECTION_TYPE = {
    id: '1',
    name: 'openshift',
    product_name: 'OpenShift Container Platform',
    schema: {
      authentication: [
        {
          type: 'token',
          name: 'Token',
          fields: [
            {
              component: 'text-field',
              name: 'authentication.password',
              label: 'Token',
            },
          ],
        },
      ],
      endpoint: {
        title: 'Configure OpenShift endpoint',
        fields: [
          {
            component: 'text-field',
            name: 'endpoint.certificate_authority',
            label: 'Certificate Authority',
          },
        ],
      },
    },
  };

  const MULTIPLE_SELECTION_TYPE = {
    id: '1',
    name: 'openshift',
    product_name: 'OpenShift Container Platform',
    schema: {
      authentication: [
        {
          type: 'token',
          name: 'Token',
          fields: [
            {
              component: 'text-field',
              name: 'authentication.password',
              label: 'Token',
            },
          ],
        },
        {
          type: 'arn',
          name: 'ARN',
          fields: [
            {
              component: 'text-field',
              name: 'authentication.password',
              label: 'ARN',
            },
          ],
        },
      ],
      endpoint: {
        title: 'Configure OpenShift endpoint',
        fields: [
          {
            component: 'text-field',
            name: 'endpoint.certificate_authority',
            label: 'Certificate Authority',
          },
        ],
      },
    },
  };

  describe('createAuthTypeSelection - generic', () => {
    it('generate single selection', () => {
      const ENDPOINT_FIELDS = [{ name: 'endpoint' }];

      const fields = [
        ...ENDPOINT_FIELDS,
        ...ONE_SINGLE_SELECTION_TYPE.schema.authentication[0].fields.filter(({ stepKey }) => !stepKey),
      ];

      expectedSchema = expect.objectContaining({
        fields: expect.arrayContaining(fields),
        title: expect.any(Object),
        name: ONE_SINGLE_SELECTION_TYPE.name + '-generic',
        nextStep: 'summary',
      });

      expect(createAuthTypeSelection(ONE_SINGLE_SELECTION_TYPE, NO_APP, ENDPOINT_FIELDS, NOT_EDITING, HAS_ENDPOINT_STEP)).toEqual(
        expectedSchema,
      );
    });

    it('do not containe endpoint fields when useApplicationAuth set', () => {
      const ENDPOINT_FIELDS = [{ name: 'endpoint' }];

      const TYPE = {
        ...ONE_SINGLE_SELECTION_TYPE,
        name: 'useAppAuth',
      };

      const fields = ONE_SINGLE_SELECTION_TYPE.schema.authentication[0].fields.filter(({ stepKey }) => !stepKey);

      expectedSchema = expect.objectContaining({
        fields: expect.arrayContaining(fields),
        title: expect.any(Object),
        name: TYPE.name + '-generic',
        nextStep: 'summary',
      });

      expect(createAuthTypeSelection(TYPE, NO_APP, ENDPOINT_FIELDS, NOT_EDITING, HAS_ENDPOINT_STEP)).toEqual(expectedSchema);
    });

    it('generate single selection with additional steps', () => {
      const ONE_SINGLE_SELECTION_TYPE_ADD_STEPS = {
        ...ONE_SINGLE_SELECTION_TYPE,
        name: 'openshiftAdditionalStep',
      };

      const EXPECTED_NEXTSTEP = `${ONE_SINGLE_SELECTION_TYPE_ADD_STEPS.name}-token-generic-additional-step`;

      const fields = ONE_SINGLE_SELECTION_TYPE_ADD_STEPS.schema.authentication[0].fields.filter(({ stepKey }) => !stepKey);

      expectedSchema = expect.objectContaining({
        fields: expect.arrayContaining(fields),
        title: expect.any(Object),
        name: ONE_SINGLE_SELECTION_TYPE_ADD_STEPS.name + '-generic',
        nextStep: EXPECTED_NEXTSTEP,
      });

      expect(
        createAuthTypeSelection(
          ONE_SINGLE_SELECTION_TYPE_ADD_STEPS,
          NO_APP,
          APPEND_ENDPOINT_FIELDS,
          NOT_EDITING,
          HAS_ENDPOINT_STEP,
        ),
      ).toEqual(expectedSchema);
    });

    it('generate single selection with endpoint', () => {
      expectedSchema = expect.objectContaining({
        fields: expect.any(Array),
        title: expect.any(Object),
        name: ONE_SINGLE_SELECTION_TYPE.name + '-generic',
        nextStep: `${ONE_SINGLE_SELECTION_TYPE.name}-endpoint`,
      });

      expect(
        createAuthTypeSelection(ONE_SINGLE_SELECTION_TYPE, NO_APP, EMPTY_APPEND_ENDPOINT, NOT_EDITING, HAS_ENDPOINT_STEP),
      ).toEqual(expectedSchema);
    });

    describe('generate multiple selection', () => {
      const firstTypeName = MULTIPLE_SELECTION_TYPE.schema.authentication[0].type;
      const secondTypeName = MULTIPLE_SELECTION_TYPE.schema.authentication[1].type;

      const firstAuth = expect.objectContaining({ component: 'auth-select', authName: firstTypeName });
      const secondAuth = expect.objectContaining({ component: 'auth-select', authName: secondTypeName });

      it('no endpoint', () => {
        expectedSchema = expect.objectContaining({
          fields: expect.arrayContaining([firstAuth, secondAuth]),
          title: expect.any(Object),
          name: MULTIPLE_SELECTION_TYPE.name + '-generic',
          nextStep: {
            when: expect.any(String),
            stepMapper: {
              [firstTypeName]: 'summary',
              [secondTypeName]: 'summary',
            },
          },
        });

        expect(
          createAuthTypeSelection(MULTIPLE_SELECTION_TYPE, NO_APP, APPEND_ENDPOINT_FIELDS, NOT_EDITING, HAS_ENDPOINT_STEP),
        ).toEqual(expectedSchema);
      });

      it('with endpoint', () => {
        const ENDPOINT_STEP_NAME = `${MULTIPLE_SELECTION_TYPE.name}-endpoint`;

        expectedSchema = expect.objectContaining({
          fields: expect.arrayContaining([firstAuth, secondAuth]),
          title: expect.any(Object),
          name: MULTIPLE_SELECTION_TYPE.name + '-generic',
          nextStep: {
            when: expect.any(String),
            stepMapper: {
              [firstTypeName]: ENDPOINT_STEP_NAME,
              [secondTypeName]: ENDPOINT_STEP_NAME,
            },
          },
        });

        expect(
          createAuthTypeSelection(MULTIPLE_SELECTION_TYPE, NO_APP, EMPTY_APPEND_ENDPOINT, NOT_EDITING, HAS_ENDPOINT_STEP),
        ).toEqual(expectedSchema);
      });

      it('do not contain endpoint fields when useApplicationAuth set', () => {
        const MULTIPLE_SELECTION_TYPE_USE_AUTH_APP = {
          ...MULTIPLE_SELECTION_TYPE,
          name: 'useAppAuth',
        };

        expectedSchema = expect.objectContaining({
          fields: expect.arrayContaining([firstAuth, secondAuth]),
          title: expect.any(Object),
          name: MULTIPLE_SELECTION_TYPE_USE_AUTH_APP.name + '-generic',
          nextStep: {
            when: expect.any(String),
            stepMapper: {
              [firstTypeName]: 'summary',
              [secondTypeName]: 'summary',
            },
          },
        });

        expect(
          createAuthTypeSelection(
            MULTIPLE_SELECTION_TYPE_USE_AUTH_APP,
            NO_APP,
            APPEND_ENDPOINT_FIELDS,
            NOT_EDITING,
            HAS_ENDPOINT_STEP,
          ),
        ).toEqual(expectedSchema);
      });
    });
  });
});
