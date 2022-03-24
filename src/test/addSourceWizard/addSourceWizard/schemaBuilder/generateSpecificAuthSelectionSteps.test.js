import { FormattedMessage } from 'react-intl';
import { createSpecificAuthTypeSelection } from '../../../../components/addSourceWizard/schemaBuilder';

jest.mock('../../../../components/addSourceWizard/hardcodedSchemas', () => ({
  openshift: {
    authentication: {
      token: {
        cost: {
          useApplicationAuth: true,
        },
      },
      arn: {
        cost: {
          skipEndpoint: true,
        },
      },
      tokenEndpoint: {
        cost: {
          useApplicationAuth: true,
          skipSelection: true,
          additionalSteps: [{ fields: [{ customField: true }] }],
        },
      },
    },
  },
}));

describe('generate auth specific selection pages', () => {
  let expectedSchema;
  const HAS_ENDPOINT_STEP = true;
  const APPEND_ENDPOINT_FIELDS = [{ component: 'text-field', name: 'endpoit-field' }];
  const NOT_EDITING = false;

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

  const APP_TYPE = {
    name: 'cost',
    supported_authentication_types: {
      openshift: ['arn', 'token'],
    },
    supported_source_types: ['openshift'],
  };

  it('single with custom step - nextstep is endpoint', () => {
    const SINGLE_SELECTION_STEP = {
      id: '1',
      name: 'openshift',
      product_name: 'OpenShift Container Platform',
      schema: {
        authentication: [
          {
            type: 'tokenEndpoint',
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
        endpoint: {},
      },
    };

    const APP_TYPE = {
      name: 'cost',
      supported_authentication_types: {
        openshift: ['tokenEndpoint'],
      },
      supported_source_types: ['openshift'],
    };

    expectedSchema = {
      fields: [{ customField: true }],
      name: 'openshift-undefined',
      nextStep: 'openshift-endpoint',
      title: <FormattedMessage defaultMessage="Credentials" id="wizard.credentials" />,
    };

    expect(createSpecificAuthTypeSelection(SINGLE_SELECTION_STEP, APP_TYPE, [], NOT_EDITING, HAS_ENDPOINT_STEP)).toEqual(
      expectedSchema
    );
  });

  it('do not contain endpoint fields when useApplicationAuth set on multi', () => {
    expectedSchema = {
      fields: [
        {
          authName: 'token',
          component: 'auth-select',
          disableAuthType: false,
          label: 'Token',
          name: 'auth_select',
          supportedAuthTypes: ['arn', 'token'],
          validate: [{ type: 'required' }],
        },
        {
          className: 'pf-u-pl-md',
          component: 'sub-form',
          condition: { is: 'token', when: 'auth_select' },
          fields: [{ component: 'authentication', label: 'Token', name: 'authentication.password' }],
          hideField: false,
          name: 'token-subform',
        },
        {
          authName: 'arn',
          component: 'auth-select',
          disableAuthType: false,
          label: 'ARN',
          name: 'auth_select',
          supportedAuthTypes: ['arn', 'token'],
          validate: [{ type: 'required' }],
        },
        {
          className: 'pf-u-pl-md',
          component: 'sub-form',
          condition: { is: 'arn', when: 'auth_select' },
          fields: [
            { component: 'text-field', name: 'endpoit-field' },
            { component: 'authentication', label: 'ARN', name: 'authentication.password' },
          ],
          hideField: false,
          name: 'arn-subform',
        },
      ],
      name: 'openshift-undefined',
      nextStep: { stepMapper: { arn: 'summary', token: 'summary' }, when: 'auth_select' },
      title: <FormattedMessage defaultMessage="Choose authentication type" id="wizard.chooseAuthType" />,
    };

    expect(
      createSpecificAuthTypeSelection(MULTIPLE_SELECTION_TYPE, APP_TYPE, APPEND_ENDPOINT_FIELDS, NOT_EDITING, HAS_ENDPOINT_STEP)
    ).toEqual(expectedSchema);
  });

  it('should lead to endpoint', () => {
    expectedSchema = {
      fields: [
        {
          authName: 'token',
          component: 'auth-select',
          disableAuthType: false,
          label: 'Token',
          name: 'auth_select',
          supportedAuthTypes: ['arn', 'token'],
          validate: [{ type: 'required' }],
        },
        {
          className: 'pf-u-pl-md',
          component: 'sub-form',
          condition: { is: 'token', when: 'auth_select' },
          fields: [{ component: 'authentication', label: 'Token', name: 'authentication.password' }],
          hideField: false,
          name: 'token-subform',
        },
        {
          authName: 'arn',
          component: 'auth-select',
          disableAuthType: false,
          label: 'ARN',
          name: 'auth_select',
          supportedAuthTypes: ['arn', 'token'],
          validate: [{ type: 'required' }],
        },
        {
          className: 'pf-u-pl-md',
          component: 'sub-form',
          condition: { is: 'arn', when: 'auth_select' },
          fields: [{ component: 'authentication', label: 'ARN', name: 'authentication.password' }],
          hideField: false,
          name: 'arn-subform',
        },
      ],
      name: 'openshift-undefined',
      nextStep: { stepMapper: { arn: 'summary', token: 'openshift-endpoint' }, when: 'auth_select' },
      title: <FormattedMessage defaultMessage="Choose authentication type" id="wizard.chooseAuthType" />,
    };

    expect(createSpecificAuthTypeSelection(MULTIPLE_SELECTION_TYPE, APP_TYPE, [], NOT_EDITING, HAS_ENDPOINT_STEP)).toEqual(
      expectedSchema
    );
  });
});
