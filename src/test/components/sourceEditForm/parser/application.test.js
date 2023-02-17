import { componentTypes } from '@data-driven-forms/react-form-renderer';
import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';

import ResourcesEmptyState from '../../../../components/SourceDetail/ResourcesEmptyState';
import { applicationsFields } from '../../../../components/SourceEditForm/parser/application';
import EditAlert from '../../../../components/SourceEditForm/parser/EditAlert';
import applicationTypes, { CATALOG_APP, COST_MANAGEMENT_APP } from '../../../__mocks__/applicationTypes';
import { GOOGLE_TYPE } from '../../../__mocks__/sourceTypes';

jest.mock('../../../../components/addSourceWizard/hardcodedSchemas', () => ({
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
  const BILLING_SOURCE_FIELDS = [{ name: 'billing_source.field1' }];
  const FIELDS = [...BILLING_SOURCE_FIELDS, { name: 'field2' }];

  let APPLICATIONS;
  let SOURCE_TYPE;
  let INTL;

  beforeEach(() => {
    APPLICATIONS = [
      {
        id: 'app-id',
        application_type_id: COST_MANAGEMENT_APP.id,
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
    INTL = { formatMessage: jest.fn() };
  });

  it('return cost management form group', () => {
    const EXPECTED_RESULT = [
      {
        component: componentTypes.TABS,
        name: 'app-tabs',
        isBox: true,
        fields: [
          {
            name: COST_MANAGEMENT_APP.id,
            title: COST_MANAGEMENT_APP.display_name,
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

    const result = applicationsFields(APPLICATIONS, SOURCE_TYPE, applicationTypes, INTL);

    expect(result).toEqual(EXPECTED_RESULT);
  });

  it('disable all inputs when app is paused', () => {
    APPLICATIONS = [
      {
        ...APPLICATIONS[0],
        paused_at: 'today',
      },
    ];

    const EXPECTED_RESULT = [
      {
        component: componentTypes.TABS,
        name: 'app-tabs',
        isBox: true,
        fields: [
          {
            name: COST_MANAGEMENT_APP.id,
            title: COST_MANAGEMENT_APP.display_name,
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
              [
                { name: 'billing_source.field1', isDisabled: true },
                { name: 'field2', isDisabled: true },
              ],
            ],
          },
        ],
      },
    ];

    const result = applicationsFields(APPLICATIONS, SOURCE_TYPE, applicationTypes, INTL);

    expect(result).toEqual(EXPECTED_RESULT);
  });

  it('appends empty state when no resources', () => {
    APPLICATIONS = [
      {
        id: 'app-id',
        application_type_id: COST_MANAGEMENT_APP.id,
        authentications: [],
      },
    ];

    const EXPECTED_RESULT = [
      {
        component: componentTypes.TABS,
        name: 'app-tabs',
        isBox: true,
        fields: [
          {
            name: COST_MANAGEMENT_APP.id,
            title: COST_MANAGEMENT_APP.display_name,
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
              {
                component: 'description',
                name: 'no-credentials',
                Content: ResourcesEmptyState,
                message: {
                  id: 'resourceTable.emptyStateDescription',
                  defaultMessage: '{applicationName} resources will be added here when created.',
                },
                applicationName: COST_MANAGEMENT_APP.display_name,
                Icon: PlusCircleIcon,
              },
            ],
          },
        ],
      },
    ];

    const result = applicationsFields(APPLICATIONS, SOURCE_TYPE, applicationTypes, INTL);

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
            name: COST_MANAGEMENT_APP.id,
            title: COST_MANAGEMENT_APP.display_name,
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

    const result = applicationsFields(APPLICATIONS, SOURCE_TYPE, applicationTypes, INTL);

    expect(result).toEqual(EXPECTED_RESULT);
  });

  it('returns endpoint fields', () => {
    APPLICATIONS = [
      {
        id: 'app-id',
        application_type_id: COST_MANAGEMENT_APP.id,
        authentications: [{ id: '1234', authtype: 'arn', resource_type: 'Endpoint' }],
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
        endpoint: {
          title: 'Configure endpoint',
          fields: [
            {
              component: 'text-field',
              name: 'endpoint.role',
              hideField: true,
              initialValue: 'kubernetes',
            },
            {
              component: 'text-field',
              name: 'url',
              label: 'URL',
              validate: [
                {
                  type: 'url-validator',
                },
              ],
            },
          ],
        },
      },
    };

    const EXPECTED_RESULT = [
      {
        component: 'tabs',
        fields: [
          {
            fields: [
              {
                Content: EditAlert,
                component: 'description',
                condition: { isNotEmpty: true, when: expect.any(Function) },
                name: 'messages.app-id',
              },
              [
                { name: 'billing_source.field1' },
                { name: 'field2' },
                {
                  component: 'sub-form',
                  fields: [
                    { component: 'text-field', hideField: true, initialValue: 'kubernetes', name: 'endpoint.role' },
                    {
                      component: 'text-field',
                      label: 'URL',
                      name: 'url',
                      validate: [
                        {
                          type: 'url-validator',
                        },
                      ],
                    },
                  ],
                  name: 'endpoint',
                },
              ],
            ],
            name: '2',
            title: 'Cost Management',
          },
        ],
        isBox: true,
        name: 'app-tabs',
      },
    ];

    const result = applicationsFields(APPLICATIONS, SOURCE_TYPE, applicationTypes, INTL);

    expect(result).toEqual(EXPECTED_RESULT);
  });

  it('returns endpoint fields for google', () => {
    APPLICATIONS = [
      {
        application_type_id: COST_MANAGEMENT_APP.id,
        id: '130550',
        authentications: [
          {
            id: '131851',
          },
          {
            authtype: 'project_id_service_account_json',
            id: '131851',
            resource_id: '24003',
            resource_type: 'Endpoint',
            source_id: '141615',
            username: 'USERNAME',
            tenant: '6089719',
          },
        ],
        extra: {
          dataset: 'DATASET',
        },
      },
    ];

    const EXPECTED_RESULT_GOOGLE = [
      {
        component: 'tabs',
        fields: [
          {
            fields: [
              {
                Content: EditAlert,
                component: 'description',
                condition: { isNotEmpty: true, when: expect.any(Function) },
                name: 'messages.130550',
              },
              [
                {
                  component: 'text-field',
                  hideField: true,
                  initialValue: 'project_id_service_account_json',
                  initializeOnMount: true,
                  name: 'authentications.a131851.authtype',
                },
                { component: 'text-field', label: 'Project ID', name: 'authentications.a131851.username' },
                { component: 'authentication', label: 'Service Account JSON', name: 'authentications.a131851.password' },
              ],
            ],
            name: '2',
            title: 'Cost Management',
          },
        ],
        isBox: true,
        name: 'app-tabs',
      },
    ];

    const result = applicationsFields(APPLICATIONS, GOOGLE_TYPE, [COST_MANAGEMENT_APP], INTL);

    expect(result).toEqual(EXPECTED_RESULT_GOOGLE);
  });
});
