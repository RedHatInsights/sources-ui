import addApplicationSchema, { hasAlreadySupportedAuthType } from '../../../components/AddApplication/AddApplicationSchema';
import { sourceTypesData, OPENSHIFT_ID, OPENSHIFT } from '../../__mocks__/sourceTypesData';
import { applicationTypesData, COSTMANAGEMENT_APP } from '../../__mocks__/applicationTypesData';

describe('AddApplicationSchema', () => {
  const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };
  const sourceTypes = sourceTypesData.data;
  const applicationTypes = applicationTypesData.data;
  const authenticationValues = [];

  it('imported schema - creates only selection, review', () => {
    const applications = [];
    const source = {
      imported: true,
      source_type_id: OPENSHIFT.id,
    };

    const result = addApplicationSchema(applications, intl, sourceTypes, applicationTypes, authenticationValues, source);

    const selectionStep = expect.objectContaining({
      title: 'Add / remove applications',
    });

    const summaryStep = expect.objectContaining({
      title: 'Review details',
    });

    expect(result.fields[0].fields).toEqual([selectionStep, summaryStep]);
  });

  it('openshift schema', () => {
    const applications = [
      {
        COSTMANAGEMENT_APP,
      },
    ];
    const source = {
      source_type_id: OPENSHIFT_ID,
    };

    const result = addApplicationSchema(applications, intl, sourceTypes, applicationTypes, authenticationValues, source);

    expect(result.fields[0].fields).toHaveLength(7);

    expect(result.fields[0].fields.map(({ name }) => name)).toEqual([
      'selectAppStep',
      'summary',
      'selectAuthentication',
      'openshift-2-token',
      'openshift-3-token',
      'openshift-token-/insights/platform/cost-management-additional-step',
      'openshift-endpoint',
    ]);
  });

  it('no available apps', () => {
    const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };
    const source = {
      source_type_id: OPENSHIFT.id,
    };

    const result = addApplicationSchema(undefined, intl, sourceTypes, applicationTypes, authenticationValues, source);

    const selectionStep = expect.objectContaining({
      title: 'Add / remove applications',
      nextStep: undefined,
    });

    const summaryStep = expect.objectContaining({
      title: 'Review details',
    });

    expect(result.fields[0].fields).toEqual([selectionStep, summaryStep]);
  });

  it('multiple authentication types', () => {
    const CUSTOM_TYPE = {
      name: 'custom',
      id: '1234',
      product_name: 'Custom source type',
      schema: {
        authentication: [
          { name: 'arn', type: 'arn', fields: [] },
          { name: 'password', type: 'password', fields: [] },
        ],
        endpoint: { hidden: true, fields: [] },
      },
    };
    const CUSTOM_APP_TYPE = {
      name: 'custom_app',
      id: '24I98',
      supported_authentication_types: {
        [CUSTOM_TYPE.name]: ['arn', 'password'],
      },
      supported_source_types: [CUSTOM_TYPE.name],
    };

    const applications = [COSTMANAGEMENT_APP];
    const source = {
      source_type_id: CUSTOM_TYPE.id,
    };

    const result = addApplicationSchema(applications, intl, [CUSTOM_TYPE], [CUSTOM_APP_TYPE], authenticationValues, source);

    expect(result.fields[0].fields.map(({ name }) => name)).toEqual([
      'selectAppStep',
      'summary',
      'selectAuthType-24I98', // this indicates multiple authentication types
      'selectAuthentication',
      'custom-24I98-arn',
      'custom-24I98-password',
      'custom-endpoint',
    ]);

    expect(
      result.fields[0].fields[0].nextStep({
        values: { application: { application_type_id: CUSTOM_APP_TYPE.id } },
      })
    ).toEqual('selectAuthType-24I98');
  });

  describe('hasAlreadySupportedAuthType', () => {
    const sourceTypeName = 'openshift';
    const appType = {
      supported_authentication_types: {
        [sourceTypeName]: ['token'],
      },
    };

    it('has already auth type', () => {
      const authValues = [
        {
          authtype: 'token',
        },
      ];

      expect(hasAlreadySupportedAuthType(authValues, appType, sourceTypeName)).toEqual(authValues[0]);
    });

    it('doesnot have already auth type', () => {
      const authValues = [];

      expect(hasAlreadySupportedAuthType(authValues, appType, sourceTypeName)).toEqual(undefined);
    });

    it('undefined authValues', () => {
      const authValues = undefined;

      expect(hasAlreadySupportedAuthType(authValues, appType, sourceTypeName)).toEqual(undefined);
    });
  });
});
