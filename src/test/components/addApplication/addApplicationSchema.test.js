import addApplicationSchema, { hasAlreadySupportedAuthType } from '../../../components/AddApplication/AddApplicationSchema';
import { AZURE_TYPE, GOOGLE_TYPE, OPENSHIFT_TYPE } from '../../__mocks__/sourceTypes';
import { COST_MANAGEMENT_APP, SUB_WATCH_APP } from '../../__mocks__/applicationTypes';
import * as UnleashClient from '@unleash/proxy-client-react';

jest.mock('@unleash/proxy-client-react', () => ({
  useUnleashContext: () => jest.fn(),
  useFlag: jest.fn(() => true),
}));

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
      COST_MANAGEMENT_APP,
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

  it('azure+rhel management schema - lighthouse', () => {
    jest.spyOn(UnleashClient, 'useFlag').mockReturnValueOnce(true);
    const source = {
      source_type_id: AZURE_TYPE.id,
    };
    const enableLighthouse = true;

    const result = addApplicationSchema(
      intl,
      AZURE_TYPE,
      SUB_WATCH_APP,
      authenticationValues,
      source,
      undefined,
      TITLE,
      DESCRIPTION,
      undefined,
      enableLighthouse
    );

    expect(result.fields[0].fields.map(({ name }) => name)).toEqual([
      'azure-5-lighthouse_subscription_id',
      'summary',
      'azure-lighthouse_subscription_id-/insights/platform/cloud-meter-additional-step',
      'subwatch-lighthouse-sub-id',
    ]);
  });

  it('azure+rhel management schema - no lighthouse', () => {
    const source = {
      source_type_id: AZURE_TYPE.id,
    };
    const enableLighthouse = false;

    const result = addApplicationSchema(
      intl,
      AZURE_TYPE,
      SUB_WATCH_APP,
      authenticationValues,
      source,
      undefined,
      TITLE,
      DESCRIPTION,
      undefined,
      enableLighthouse
    );

    expect(result.fields[0].fields.map(({ name }) => name)).toEqual([
      'azure-5-lighthouse_subscription_id',
      'summary',
      'azure-lighthouse_subscription_id-/insights/platform/cloud-meter-additional-step',
      'cost-azure-playbook',
    ]);
  });

  it('google+rhel management schema (empty auth type)', () => {
    const source = {
      source_type_id: GOOGLE_TYPE.id,
    };

    const result = addApplicationSchema(intl, GOOGLE_TYPE, SUB_WATCH_APP, authenticationValues, source, TITLE, DESCRIPTION);

    expect(result.fields[0].fields.map(({ name }) => name)).toEqual([
      'google-5-empty',
      'summary',
      'google-empty-/insights/platform/cloud-meter-additional-step',
      'cost-google-playbook',
    ]);
  });

  it('google+rhel management schema (empty auth type)', () => {
    const source = {
      source_type_id: GOOGLE_TYPE.id,
    };

    const result = addApplicationSchema(intl, GOOGLE_TYPE, SUB_WATCH_APP, authenticationValues, source, TITLE, DESCRIPTION);

    expect(result.fields[0].fields.map(({ name }) => name)).toEqual([
      'google-5-empty',
      'summary',
      'google-empty-/insights/platform/cloud-meter-additional-step',
      'cost-google-playbook',
    ]);
  });

  it('google+rhel management schema (empty auth type)', () => {
    const source = {
      source_type_id: GOOGLE_TYPE.id,
    };

    const result = addApplicationSchema(intl, GOOGLE_TYPE, SUB_WATCH_APP, authenticationValues, source, TITLE, DESCRIPTION);

    expect(result.fields[0].fields.map(({ name }) => name)).toEqual([
      'google-5-empty',
      'summary',
      'google-empty-/insights/platform/cloud-meter-additional-step',
      'cost-google-playbook',
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
