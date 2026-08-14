import { createAuthTypeSelection } from '../../../../components/addSourceWizard/schemaBuilder';

jest.mock('../../../../components/addSourceWizard/hardcodedSchemas', () => ({
  openshift: {
    authentication: {
      token: {
        generic: {
          skipEndpoint: true,
        },
      },
    },
  },
}));

describe('generate auth selection pages', () => {
  let expectedSchema;
  const HAS_ENDPOINT = [];
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

  describe('createAuthTypeSelection - generic - with skip endpoint', () => {
    it('generate single selection', () => {
      const fields = ONE_SINGLE_SELECTION_TYPE.schema.authentication[0].fields.filter(({ stepKey }) => !stepKey);

      expectedSchema = expect.objectContaining({
        fields: expect.arrayContaining(fields),
        title: expect.any(Object),
        name: ONE_SINGLE_SELECTION_TYPE.name + '-generic',
        nextStep: 'summary',
      });

      expect(createAuthTypeSelection(ONE_SINGLE_SELECTION_TYPE, NO_APP, HAS_ENDPOINT, NOT_EDITING, HAS_ENDPOINT_STEP)).toEqual(
        expectedSchema,
      );
    });

    describe('generate multiple selection', () => {
      const ENDPOINT_STEP_NAME = `${MULTIPLE_SELECTION_TYPE.name}-endpoint`;

      const firstTypeName = MULTIPLE_SELECTION_TYPE.schema.authentication[0].type;
      const secondTypeName = MULTIPLE_SELECTION_TYPE.schema.authentication[1].type;

      const firstAuth = expect.objectContaining({ component: 'auth-select', authName: firstTypeName });
      const secondAuth = expect.objectContaining({ component: 'auth-select', authName: secondTypeName });

      it('skipEndpoint', () => {
        expectedSchema = expect.objectContaining({
          fields: expect.arrayContaining([firstAuth, secondAuth]),
          title: expect.any(Object),
          name: MULTIPLE_SELECTION_TYPE.name + '-generic',
          nextStep: {
            when: expect.any(String),
            stepMapper: {
              [firstTypeName]: 'summary',
              [secondTypeName]: ENDPOINT_STEP_NAME,
            },
          },
        });

        expect(createAuthTypeSelection(MULTIPLE_SELECTION_TYPE, NO_APP, HAS_ENDPOINT, NOT_EDITING, HAS_ENDPOINT_STEP)).toEqual(
          expectedSchema,
        );
      });
    });
  });
});
