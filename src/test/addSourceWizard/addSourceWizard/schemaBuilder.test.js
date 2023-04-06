import {
  createAdditionalSteps,
  createAuthTypeSelection,
  createEndpointStep,
  getAdditionalAuthFields,
  getAdditionalEndpointFields,
  getAdditionalStepFields,
  getAdditionalStepKeys,
  getAdditionalSteps,
  getNoStepsFields,
  injectAuthFieldsInfo,
  injectEndpointFieldsInfo,
  schemaBuilder,
  shouldSkipSelection,
  shouldUseAppAuth,
} from '../../../components/addSourceWizard/schemaBuilder';
import hardcodedSchemas from '../../../components/addSourceWizard/hardcodedSchemas';
import sourceTypes, { AMAZON_TYPE, ANSIBLE_TOWER_TYPE, AZURE_TYPE, OPENSHIFT_TYPE } from '../../__mocks__/sourceTypes';
import applicationTypes, { COST_MANAGEMENT_APP, TOPOLOGY_INV_APP } from '../../__mocks__/applicationTypes';
import { validatorTypes } from '@data-driven-forms/react-form-renderer';

describe('schema builder', () => {
  describe('stepKey fields', () => {
    const STEP_KEY = 'pepa';
    const NO_STEP_FIELD_1 = { name: 'cosi-1' };
    const NO_STEP_FIELD_2 = { name: 'cosi-2' };
    const STEP_FIELD_1 = { name: 'cosi-a-1', stepKey: STEP_KEY };
    const NO_STEP_FIELD_3 = { name: 'cosi-3' };
    const STEP_FIELD_2 = { name: 'cosi-a-2', stepKey: STEP_KEY };

    const NO_STEP_FIELDS = [NO_STEP_FIELD_1, NO_STEP_FIELD_2, NO_STEP_FIELD_3];

    const STEP_FIELDS = [STEP_FIELD_1, STEP_FIELD_2];

    const FIELDS = [...NO_STEP_FIELDS, ...STEP_FIELDS];

    const STEP_FIELDS_PARSED = [
      { ...STEP_FIELD_1, stepKey: undefined },
      { ...STEP_FIELD_2, stepKey: undefined },
    ];

    describe('getAdditionalStepFields', () => {
      it('returns fields with stepKey and removes stepKey', () => {
        expect(getAdditionalStepFields(FIELDS, STEP_KEY)).toEqual(STEP_FIELDS_PARSED);
      });
    });

    describe('getNoStepsFields', () => {
      it('returns fields with no stepKey', () => {
        expect(getNoStepsFields(FIELDS)).toEqual(NO_STEP_FIELDS);
      });
    });
  });

  describe('getAdditionalSteps', () => {
    it('returns additional steps for amazon-arn-cost-management', () => {
      expect(getAdditionalSteps('amazon', 'arn', COST_MANAGEMENT_APP.name)).toEqual(
        hardcodedSchemas.amazon.authentication.arn[COST_MANAGEMENT_APP.name].additionalSteps
      );
    });
  });

  describe('shouldUseAppAuth', () => {
    it('returns true for amazon-arn-cost', () => {
      expect(shouldUseAppAuth('amazon', 'arn', COST_MANAGEMENT_APP.name)).toEqual(true);
    });

    it('returns false for tower-username-topology', () => {
      expect(shouldUseAppAuth('ansible-tower', 'username_password', TOPOLOGY_INV_APP.name)).toEqual(false);
    });
  });

  describe('getAdditionalEndpointFields', () => {
    it('returns additionalEndpointFields for openshift', () => {
      expect(getAdditionalEndpointFields('openshift')).toEqual(hardcodedSchemas.openshift.endpoint.additionalFields);
    });

    it('returns additionalEndpointFields for amazon (empty)', () => {
      expect(getAdditionalEndpointFields('amazon')).toEqual([]);
    });
  });

  describe('getAdditionalAuthFields', () => {
    it('returns additionalAuthFields for openshift token, generic', () => {
      expect(getAdditionalAuthFields('openshift', 'token', 'generic')).toEqual(
        hardcodedSchemas.openshift.authentication.token.generic.additionalFields
      );
    });

    it('returns additionalAuthFields for amazon arn (empty)', () => {
      expect(getAdditionalAuthFields('amazon', 'arn', 'generic')).toEqual([]);
    });
  });

  describe('injectEndpointFieldsInfo', () => {
    const FIELDS = [
      {
        name: 'url',
        component: 'cosi',
      },
    ];

    it('returns injected fields for openshift token', () => {
      expect(injectEndpointFieldsInfo(FIELDS, 'openshift')).toEqual([
        {
          ...FIELDS[0],
          ...hardcodedSchemas.openshift.endpoint.url,
        },
      ]);
    });

    it('returns uninjected fields', () => {
      expect(injectEndpointFieldsInfo(FIELDS, 'amazon')).toEqual(FIELDS);
    });
  });

  describe('injectAuthFieldsInfo', () => {
    const FIELDS = [
      {
        name: 'authentication.username',
        component: 'cosi',
      },
    ];

    it('returns injected fields for amazon access_key_secret_key', () => {
      expect(injectAuthFieldsInfo(FIELDS, 'amazon', 'access_key_secret_key', 'generic')).toEqual([
        {
          ...FIELDS[0],
          ...hardcodedSchemas.amazon.authentication.access_key_secret_key.generic['authentication.username'],
        },
      ]);
    });

    it('returns uninjected fields', () => {
      expect(injectAuthFieldsInfo(FIELDS, 'openshift', 'token', 'generic')).toEqual(FIELDS);
    });

    it('removes password requirements', () => {
      const disablePassword = true;

      const passwordField = {
        name: 'authentication.password',
        isRequired: true,
        validate: [{ type: validatorTypes.REQUIRED }, { type: 'cosi' }],
      };
      const unchangedField = { name: 'unchanged', isRequired: true, validate: [{ type: validatorTypes.REQUIRED }] };

      const fields = [passwordField, unchangedField];

      expect(injectAuthFieldsInfo(fields, 'nonsense', 'nonsense', 'generic', disablePassword)).toEqual([
        { ...passwordField, component: 'authentication' },
        unchangedField,
      ]);
    });
  });

  describe('createEndpointStep', () => {
    it('returns createEndpointStep for openshift', () => {
      const ENDPOINT = sourceTypes.find(({ name }) => name === 'openshift').schema.endpoint;

      expect(createEndpointStep(ENDPOINT, 'openshift')).toEqual(
        expect.objectContaining({
          fields: [...getAdditionalEndpointFields('openshift'), ...injectEndpointFieldsInfo(ENDPOINT.fields, 'openshift')],
          title: sourceTypes.find(({ name }) => name === 'openshift').schema.endpoint.title,
          name: 'openshift-endpoint',
          nextStep: 'summary',
        })
      );
    });
  });

  describe('createAdditionalSteps', () => {
    const ADDITIONAL_STEPS = [
      { nextStep: 'step-2', fields: ['a'] },
      { name: 'step-2', nextStep: 'step-3', fields: ['b'] },
      { name: 'step-3', fields: ['c'] },
    ];

    const INSERTED_STEP = { name: 'component-1', stepKey: 'red-hat-generic-additional-step' };

    const TYPES_FIELDS = [INSERTED_STEP, { name: 'component-2' }];

    it('returns createAdditionalSteps', () => {
      const HAS_ENDPOINT = false;

      expect(createAdditionalSteps(ADDITIONAL_STEPS, 'red', 'hat', HAS_ENDPOINT, TYPES_FIELDS)).toEqual([
        {
          ...ADDITIONAL_STEPS[0],
          fields: [
            ...ADDITIONAL_STEPS[0].fields,
            { ...INSERTED_STEP, stepKey: undefined }, // insert the right field
          ],
          nextStep: 'step-2',
          name: 'red-hat-generic-additional-step',
        },
        {
          ...ADDITIONAL_STEPS[1],
          fields: expect.any(Array),
          nextStep: 'step-3',
        },
        {
          ...ADDITIONAL_STEPS[2],
          fields: expect.any(Array),
          nextStep: 'summary',
        },
      ]);
    });

    it('returns createAdditionalSteps with endpoint', () => {
      const HAS_ENDPOINT = true;

      expect(createAdditionalSteps(ADDITIONAL_STEPS, 'red', 'hat', HAS_ENDPOINT, TYPES_FIELDS)).toEqual([
        {
          ...ADDITIONAL_STEPS[0],
          fields: expect.any(Array),
          nextStep: 'step-2',
          name: 'red-hat-generic-additional-step',
        },
        {
          ...ADDITIONAL_STEPS[1],
          fields: expect.any(Array),
          nextStep: 'step-3',
        },
        {
          ...ADDITIONAL_STEPS[2],
          fields: expect.any(Array),
          nextStep: 'red-endpoint',
        },
      ]);
    });
  });

  describe('Cost management shouldSkipSelection', () => {
    it('should skip selection page for AWS+CM', () => {
      expect(shouldSkipSelection(AMAZON_TYPE.name, 'arn', COST_MANAGEMENT_APP.name)).toEqual(true);
    });

    it('should skip selection for openshift', () => {
      expect(shouldSkipSelection(OPENSHIFT_TYPE.name, 'token', COST_MANAGEMENT_APP.name)).toEqual(true);
    });
  });

  describe('getAdditionalStepKeys', () => {
    it('should get Additional Step Keys for generic AWS', () => {
      const expectedStepKeys = hardcodedSchemas.amazon.authentication.arn.generic.includeStepKeyFields;

      expect(getAdditionalStepKeys(AMAZON_TYPE.name, 'arn')).toEqual(expectedStepKeys);
    });

    it('should not get Additional Step Keys for openshift', () => {
      expect(getAdditionalStepKeys(OPENSHIFT_TYPE.name, 'token')).toEqual([]);
    });
  });

  describe('generate auth selection pages', () => {
    let expectedSchema;
    const APPEND_ENDPOINT_FIELDS = [true];
    const EMPTY_APPEND_ENDPOINT = [];
    const HAS_ENDPOINT_STEP = true;
    const DISABLE_AUTH_TYPE = undefined;
    const NO_APP = undefined;

    describe('createAuthTypeSelection - generic', () => {
      it('generate single selection', () => {
        const fields = OPENSHIFT_TYPE.schema.authentication[0].fields
          .filter(({ stepKey }) => !stepKey)
          .map((field) =>
            expect.objectContaining(field.name === 'authentication.password' ? { ...field, component: 'authentication' } : field)
          );

        expectedSchema = expect.objectContaining({
          fields: expect.arrayContaining(fields),
          title: expect.any(Object),
          name: OPENSHIFT_TYPE.name + '-generic',
          nextStep: 'summary',
        });

        expect(createAuthTypeSelection(OPENSHIFT_TYPE, NO_APP, APPEND_ENDPOINT_FIELDS)).toEqual(expectedSchema);
      });

      it('generate single selection with endpoint', () => {
        expectedSchema = expect.objectContaining({
          fields: expect.any(Array),
          title: expect.any(Object),
          name: OPENSHIFT_TYPE.name + '-generic',
          nextStep: `${OPENSHIFT_TYPE.name}-endpoint`,
        });

        expect(
          createAuthTypeSelection(OPENSHIFT_TYPE, NO_APP, EMPTY_APPEND_ENDPOINT, DISABLE_AUTH_TYPE, HAS_ENDPOINT_STEP)
        ).toEqual(expectedSchema);
      });

      it('generate multiple selection', () => {
        const arnSelect = expect.objectContaining({ component: 'auth-select', authName: 'arn' });
        const secretKey = expect.objectContaining({ component: 'auth-select', authName: 'access_key_secret_key' });
        const arnCloudMeter = expect.objectContaining({ component: 'auth-select', authName: 'cloud-meter-arn' });

        expectedSchema = expect.objectContaining({
          fields: expect.arrayContaining([arnSelect, secretKey, arnCloudMeter]),
          title: expect.any(Object),
          name: AMAZON_TYPE.name + '-generic',
          nextStep: {
            when: expect.any(String),
            stepMapper: {
              access_key_secret_key: 'amazon-access_key_secret_key-generic-additional-step',
              arn: 'summary',
              'cloud-meter-arn': 'summary',
            },
          },
        });

        expect(createAuthTypeSelection(AMAZON_TYPE, NO_APP, APPEND_ENDPOINT_FIELDS)).toEqual(expectedSchema);
      });
    });

    describe('createAuthTypeSelection', () => {
      it('generate single selection', () => {
        const fields = AZURE_TYPE.schema.authentication[1].fields.filter(({ stepKey }) => !stepKey);
        const expectedName = `${AZURE_TYPE.name}-${TOPOLOGY_INV_APP.id}`;

        expectedSchema = expect.objectContaining({
          fields: expect.arrayContaining(fields),
          title: expect.any(Object),
          name: expectedName,
          nextStep: 'summary',
        });

        expect(createAuthTypeSelection(AZURE_TYPE, TOPOLOGY_INV_APP, APPEND_ENDPOINT_FIELDS)).toEqual(expectedSchema);
      });

      it('generate single selection - do not append endpoint fields for azure/cost', () => {
        const ENDPOINT_FIELDS = [{ name: 'endpoint' }];

        expect(createAuthTypeSelection(AZURE_TYPE, COST_MANAGEMENT_APP, ENDPOINT_FIELDS).fields.map(({ name }) => name)).toEqual([
          'cost-export-scope-description',
          'application.extra.storage_only',
          'cost-export-scope',
          'application.extra.scope',
        ]);
      });

      it('generate single selection with endpoints', () => {
        const fields = AZURE_TYPE.schema.authentication[1].fields.filter(({ stepKey }) => !stepKey);
        const expectedName = `${AZURE_TYPE.name}-${TOPOLOGY_INV_APP.id}`;

        expectedSchema = expect.objectContaining({
          fields: expect.arrayContaining(fields),
          title: expect.any(Object),
          name: expectedName,
          nextStep: `${AZURE_TYPE.name}-endpoint`,
        });

        expect(
          createAuthTypeSelection(AZURE_TYPE, TOPOLOGY_INV_APP, EMPTY_APPEND_ENDPOINT, DISABLE_AUTH_TYPE, HAS_ENDPOINT_STEP)
        ).toEqual(expectedSchema);
      });

      it('generate with custom steps', () => {
        const expectedName = `${AMAZON_TYPE.name}-${COST_MANAGEMENT_APP.id}`;
        const firstAdditionalStep = hardcodedSchemas[AMAZON_TYPE.name].authentication.arn[
          COST_MANAGEMENT_APP.name
        ].additionalSteps.find(({ stepKey }) => !stepKey);
        const fields = firstAdditionalStep.fields.map((field) => expect.objectContaining(field));

        expectedSchema = expect.objectContaining({
          fields: expect.arrayContaining(fields),
          title: firstAdditionalStep.title,
          name: expectedName,
          nextStep: firstAdditionalStep.nextStep,
        });

        expect(createAuthTypeSelection(AMAZON_TYPE, COST_MANAGEMENT_APP, APPEND_ENDPOINT_FIELDS)).toEqual(expectedSchema);
      });
    });
  });

  describe('schemaBuilder', () => {
    it('builds schema', () => {
      const schema = schemaBuilder(
        sourceTypes.filter(({ schema }) => schema),
        applicationTypes
      );

      expect(schema).toEqual(expect.arrayContaining([expect.any(Object)]));
      expect(schema).toHaveLength(65);

      expect(schema.map(({ name }) => name)).toEqual([
        'openshift-generic',
        'openshift-2',
        'openshift-3',
        'openshift-token-/insights/platform/cost-management-additional-step',
        'openshift-endpoint',
        'amazon-generic',
        'amazon-2',
        'amazon-3',
        'amazon-5',
        'amazon-access_key_secret_key-generic-additional-step',
        'amazon-arn-/insights/platform/cost-management-additional-step',
        'usage',
        'tags',
        'iam-policy',
        'iam-role',
        'arn',
        'amazon-cloud-meter-arn-/insights/platform/cloud-meter-additional-step',
        'subs-iam-role',
        'subs-arn',
        'ansible-tower-generic',
        'ansible-tower-1',
        'ansible-tower-3',
        'ansible-tower-username_password-generic-additional-step',
        'ansible-tower-credentials-no-app',
        'ansible-tower-username_password-/insights/platform/catalog-additional-step',
        'catalog-ansible-tower',
        'ansible-tower-endpoint',
        'azure-generic',
        'azure-2',
        'azure-3',
        'azure-5',
        'azure-lighthouse_subscription_id-/insights/platform/cloud-meter-additional-step',
        'cost-azure-playbook',
        'azure-tenant_id_client_id_client_secret-/insights/platform/cost-management-additional-step',
        'daily-export',
        'azure-rg-and-sa',
        'azure-sub-id',
        'configure-roles',
        'google-generic',
        'google-2',
        'google-5',
        'google-project_id_service_account_json-/insights/platform/cost-management-additional-step',
        'cost-gcp-cs',
        'cost-gcp-iam',
        'cost-gcp-access',
        'cost-gcp-dataset',
        'cost-gcp-billing-export',
        'google-empty-/insights/platform/cloud-meter-additional-step',
        'cost-google-playbook',
        'ibm-generic',
        'ibm-2',
        'ibm-api_token_account_id-/insights/platform/cost-management-additional-step',
        'ibm-cm-account-id',
        'ibm-cm-service-id',
        'ibm-cm-configure-access',
        'ibm-cm-api-key',
        'satellite-generic',
        'satellite-receptor_node-generic-additional-step',
        'satellite-endpoint',
        'oracle-cloud-infrastructure-generic',
        'oracle-cloud-infrastructure-2',
        'oracle-cloud-infrastructure-ocid-/insights/platform/cost-management-additional-step',
        'oci-cm-policy-compartment',
        'oci-cm-create-bucket',
        'oci-cm-populate-bucket',
      ]);
    });

    it('builds schema - HCS and lighthouse', () => {
      const schema = schemaBuilder(
        sourceTypes.filter(({ schema }) => schema),
        applicationTypes,
        undefined,
        true,
        true
      );

      expect(schema).toEqual(expect.arrayContaining([expect.any(Object)]));
      expect(schema).toHaveLength(67);

      expect(schema.map(({ name }) => name)).toEqual([
        'openshift-generic',
        'openshift-2',
        'openshift-3',
        'openshift-token-/insights/platform/cost-management-additional-step',
        'openshift-endpoint',
        'amazon-generic',
        'amazon-2',
        'amazon-3',
        'amazon-5',
        'amazon-access_key_secret_key-generic-additional-step',
        'amazon-arn-/insights/platform/cost-management-additional-step',
        'usage',
        'tags',
        'iam-policy',
        'iam-role',
        'arn',
        'amazon-cloud-meter-arn-/insights/platform/cloud-meter-additional-step',
        'subs-iam-role',
        'subs-arn',
        'ansible-tower-generic',
        'ansible-tower-1',
        'ansible-tower-3',
        'ansible-tower-username_password-generic-additional-step',
        'ansible-tower-credentials-no-app',
        'ansible-tower-username_password-/insights/platform/catalog-additional-step',
        'catalog-ansible-tower',
        'ansible-tower-endpoint',
        'azure-generic',
        'azure-2',
        'azure-3',
        'azure-5',
        'azure-lighthouse_subscription_id-/insights/platform/cloud-meter-additional-step',
        'subwatch-lighthouse-sub-id',
        'azure-tenant_id_client_id_client_secret-/insights/platform/cost-management-additional-step',
        'daily-export',
        'azure-rg-and-sa',
        'azure-sub-id',
        'configure-roles',
        'google-generic',
        'google-2',
        'google-5',
        'google-project_id_service_account_json-/insights/platform/cost-management-additional-step',
        'cost-gcp-cs',
        'cost-gcp-iam',
        'cost-gcp-access',
        'cost-gcp-dataset',
        'cost-gcp-billing-export',
        'google-empty-/insights/platform/cloud-meter-additional-step',
        'cost-google-playbook',
        'google-empty-/insights/platform/cloud-meter-additional-step',
        'cost-google-playbook',
        'ibm-generic',
        'ibm-2',
        'ibm-api_token_account_id-/insights/platform/cost-management-additional-step',
        'ibm-cm-account-id',
        'ibm-cm-service-id',
        'ibm-cm-configure-access',
        'ibm-cm-api-key',
        'satellite-generic',
        'satellite-receptor_node-generic-additional-step',
        'satellite-endpoint',
        'oracle-cloud-infrastructure-generic',
        'oracle-cloud-infrastructure-2',
        'oracle-cloud-infrastructure-ocid-/insights/platform/cost-management-additional-step',
        'oci-cm-policy-compartment',
        'oci-cm-create-bucket',
        'oci-cm-populate-bucket',
      ]);
    });

    it('builds ansible schema without recepotr', () => {
      const sourceType = [
        {
          ...ANSIBLE_TOWER_TYPE,
          schema: {
            ...ANSIBLE_TOWER_TYPE.schema,
            authentication: [ANSIBLE_TOWER_TYPE.schema.authentication[0]],
          },
        },
      ];

      const schema = schemaBuilder(sourceType, applicationTypes);

      expect(schema.map(({ name }) => name)).toEqual([
        'ansible-tower-generic',
        'ansible-tower-1',
        'ansible-tower-3',
        'ansible-tower-username_password-generic-additional-step',
        'ansible-tower-credentials-no-app',
        'ansible-tower-username_password-/insights/platform/catalog-additional-step',
        'catalog-ansible-tower',
        'ansible-tower-endpoint',
      ]);
    });
  });
});
