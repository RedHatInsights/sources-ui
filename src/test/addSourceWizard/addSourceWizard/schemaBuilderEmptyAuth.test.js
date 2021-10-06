import emptyAuthType from '../../../components/addSourceWizard/emptyAuthType';
import { schemaBuilder, selectAuthTypeField } from '../../../components/addSourceWizard/schemaBuilder';

jest.mock('../../../components/addSourceWizard/hardcodedSchemas', () => ({
  source_type_name: {
    authentication: {
      empty: {
        '/insights/platform/app': {
          skipSelection: true,
          useApplicationAuth: true,
          customSteps: true,
          additionalSteps: [
            {
              title: 'Step 1',
              nextStep: 'eaa',
              fields: [
                {
                  component: 'description',
                  name: 'just-empty-description',
                },
              ],
            },
          ],
        },
      },
    },
  },
}));

describe('schemaBuilder - empty auth configuration', () => {
  const SOURCE_TYPE = {
    created_at: '2019-08-19T14:53:02Z',
    icon_url: 'img.svg',
    id: '8',
    name: 'source_type_name',
    product_name: 'Custom Source Type',
    schema: {
      endpoint: {
        fields: [],
        hidden: true,
      },
      authentication: [{ type: 'type', name: 'name', fields: [] }],
    },
    updated_at: '2021-01-26T10:57:16Z',
    vendor: 'type_vendor',
  };

  const APP_TYPE = {
    created_at: '2020-02-05T21:08:50Z',
    dependent_applications: [],
    display_name: 'App name',
    id: '5',
    name: '/insights/platform/app',
    supported_authentication_types: {
      source_type_name: [],
    },
    supported_source_types: ['source_type_name'],
    updated_at: '2021-04-13T14:48:59Z',
  };

  it('empty type is empty', () => {
    expect(emptyAuthType.type).toEqual('empty');
  });

  it('correctly generates empty auth type', () => {
    const result = schemaBuilder([SOURCE_TYPE], [APP_TYPE]);

    expect(result.map(({ name }) => name)).toEqual([
      'source_type_name',
      'source_type_name-5',
      'source_type_name-empty-/insights/platform/app-additional-step',
      'source_type_name-endpoint',
    ]);
    expect(result[2]).toEqual({
      fields: [{ component: 'description', name: 'just-empty-description' }, selectAuthTypeField('empty')],
      name: 'source_type_name-empty-/insights/platform/app-additional-step',
      nextStep: 'eaa',
      title: 'Step 1',
    });
  });
});
