import addApplicationSchema, { hasAlreadySupportedAuthType } from '../../../components/AddApplication/AddApplicationSchema';
import { OPENSHIFT_TYPE, AZURE_TYPE } from '../../__mocks__/sourceTypes';
import { COSTMANAGEMENT_APP, SUBWATCH_APP } from '../../__mocks__/applicationTypesData';

describe('AddApplicationSchema', () => {
  const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };
  const authenticationValues = [];
  const TITLE = 'someTitle';
  const DESCRIPTION = 'someDesc';

  it('openshift schema', () => {
    const source = {
      source_type_id: OPENSHIFT_TYPE.id,
    };

    const result = addApplicationSchema(
      intl,
      OPENSHIFT_TYPE,
      COSTMANAGEMENT_APP,
      authenticationValues,
      source,
      TITLE,
      DESCRIPTION
    );

    expect(result.fields[0].fields.map(({ name }) => name)).toEqual([
      'openshift-2-token',
      'summary',
      'openshift-token-/insights/platform/cost-management-additional-step',
      'openshift-endpoint',
    ]);
  });

  it('azure+rhel management schema (empty auth type)', () => {
    const source = {
      source_type_id: AZURE_TYPE.id,
    };

    const result = addApplicationSchema(intl, AZURE_TYPE, SUBWATCH_APP, authenticationValues, source, TITLE, DESCRIPTION);

    expect(result.fields[0].fields.map(({ name }) => name)).toEqual([
      'azure-5-empty',
      'summary',
      'azure-empty-/insights/platform/cloud-meter-additional-step',
      'cost-azure-playbook',
    ]);
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

    const source = {
      source_type_id: CUSTOM_TYPE.id,
    };

    const result = addApplicationSchema(intl, CUSTOM_TYPE, CUSTOM_APP_TYPE, authenticationValues, source, TITLE, DESCRIPTION);

    expect(result.fields[0].fields.map(({ name }) => name)).toEqual([
      'selectAuthType-24I98',
      'summary',
      'custom-24I98-arn',
      'custom-24I98-password',
      'custom-endpoint',
    ]);
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
