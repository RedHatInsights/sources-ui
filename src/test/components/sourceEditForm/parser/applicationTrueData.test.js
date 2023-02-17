import { applicationsFields } from '../../../../components/SourceEditForm/parser/application';
import EditAlert from '../../../../components/SourceEditForm/parser/EditAlert';
import applicationTypes, { COST_MANAGEMENT_APP } from '../../../addSourceWizard/../__mocks__/applicationTypes';
import { OPENSHIFT_TYPE } from '../../../addSourceWizard/../__mocks__/sourceTypes';

describe('application parser - true data', () => {
  it('google + OCP', () => {
    const intl = { formatMessage: jest.fn() };
    const schema = applicationsFields(
      [{ id: '3789', application_type_id: COST_MANAGEMENT_APP.id, authentications: [{ id: '123', authtype: 'token' }] }],
      OPENSHIFT_TYPE,
      applicationTypes,
      intl
    );

    expect(schema).toEqual([
      {
        component: 'tabs',
        fields: [
          {
            fields: [
              {
                Content: EditAlert,
                component: 'description',
                condition: { isNotEmpty: true, when: expect.any(Function) },
                name: 'messages.3789',
              },
              [
                {
                  component: 'text-field',
                  hideField: true,
                  initialValue: 'token',
                  initializeOnMount: true,
                  name: 'authentications.a123.authtype',
                },
                {
                  component: 'text-field',
                  isRequired: true,
                  label: expect.anything(),
                  name: 'source.source_ref',
                  stepKey: 'usageCollector',
                  validate: [
                    { type: 'required' },
                    { message: expect.anything(), pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/, type: 'pattern' },
                  ],
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
    ]);
  });
});
