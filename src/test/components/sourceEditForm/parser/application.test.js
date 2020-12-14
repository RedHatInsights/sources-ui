import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import { applicationsFields, appendClusterIdentifier } from '../../../../components/SourceEditForm/parser/application';
import EditAlert from '../../../../components/SourceEditForm/parser/EditAlert';
import { applicationTypesData, COSTMANAGEMENT_APP, CATALOG_APP } from '../../../__mocks__/applicationTypesData';

jest.mock('@redhat-cloud-services/frontend-components-sources/cjs/hardcodedSchemas', () => ({
  __esModule: true,
  default: {
    aws: {
      authentication: {
        arn: {
          generic: {
            password: { name: 'superpassword' },
          },
          cm: {
            username: { name: 'ultrapassword' },
          },
        },
        secret: {
          generic: {
            password: { name: 'secretpassword' },
            remember: { name: 'remember' },
          },
        },
      },
    },
  },
}));

describe('application edit form parser', () => {
  const APP_TYPES = applicationTypesData.data;
  const BILLING_SOURCE_FIELDS = [{ name: 'billing_source.field1' }];
  const FIELDS = [...BILLING_SOURCE_FIELDS, { name: 'field2' }];

  let APPLICATIONS;
  let SOURCE_TYPE;

  beforeEach(() => {
    APPLICATIONS = [
      {
        id: 'app-id',
        application_type_id: COSTMANAGEMENT_APP.id,
        authentications: [{ id: '1234', authtype: 'arn' }],
      },
    ];
    SOURCE_TYPE = {
      name: 'aws',
      product_name: 'Amazon',
      schema: {
        authentication: [
          {
            name: 'ARN',
            type: 'arn',
            fields: FIELDS,
          },
          {
            name: 'unused-type',
            type: 'unused',
            fields: [],
          },
        ],
      },
    };
  });

  it('return cost management form group', () => {
    const EXPECTED_RESULT = [
      {
        component: componentTypes.TABS,
        name: 'app-tabs',
        isBox: true,
        fields: [
          {
            name: COSTMANAGEMENT_APP.id,
            title: COSTMANAGEMENT_APP.display_name,
            fields: [
              {
                name: 'messages.app-id',
                component: 'description',
                condition: {
                  isNotEmpty: true,
                  when: expect.any(Function),
                },
                Content: EditAlert,
              },
              [{ name: 'billing_source.field1' }, { name: 'field2' }],
            ],
          },
        ],
      },
    ];

    const result = applicationsFields(APPLICATIONS, SOURCE_TYPE, APP_TYPES);

    expect(result).toEqual(EXPECTED_RESULT);
  });

  it('return multiple tabs', () => {
    APPLICATIONS = [
      ...APPLICATIONS,
      {
        id: 'app-id-2',
        application_type_id: CATALOG_APP.id,
        authentications: [{ id: '2345', authtype: 'arn' }],
      },
    ];

    const EXPECTED_RESULT = [
      {
        component: componentTypes.TABS,
        name: 'app-tabs',
        isBox: true,
        fields: [
          {
            name: COSTMANAGEMENT_APP.id,
            title: COSTMANAGEMENT_APP.display_name,
            fields: [
              {
                name: 'messages.app-id',
                component: 'description',
                condition: {
                  isNotEmpty: true,
                  when: expect.any(Function),
                },
                Content: EditAlert,
              },
              [{ name: 'billing_source.field1' }, { name: 'field2' }],
            ],
          },
          {
            name: CATALOG_APP.id,
            title: CATALOG_APP.display_name,
            fields: [
              {
                name: 'messages.app-id-2',
                component: 'description',
                condition: {
                  isNotEmpty: true,
                  when: expect.any(Function),
                },
                Content: EditAlert,
              },
              [{ name: 'billing_source.field1' }, { name: 'field2' }],
            ],
          },
        ],
      },
    ];

    const result = applicationsFields(APPLICATIONS, SOURCE_TYPE, APP_TYPES);

    expect(result).toEqual(EXPECTED_RESULT);
  });
});

describe('helpers', () => {
  describe('appendClusterIdentifier', () => {
    const SOURCE_TYPE = { name: 'openshift' };

    it('returns cluster identifier field when type is openshift', () => {
      expect(appendClusterIdentifier(SOURCE_TYPE)).toEqual([
        {
          name: 'source.source_ref',
          label: expect.any(Object),
          isRequired: true,
          validate: [{ type: validatorTypes.REQUIRED }],
          component: componentTypes.TEXT_FIELD,
        },
      ]);
    });

    it('dont return cluster identifier field when type is not openshift', () => {
      const AWS_SOURCE_TYPE = { name: 'aws' };

      expect(appendClusterIdentifier(AWS_SOURCE_TYPE)).toEqual([]);
    });
  });
});
