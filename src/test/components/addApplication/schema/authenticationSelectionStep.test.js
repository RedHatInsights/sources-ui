import authenticationSelectionStep from '../../../../components/AddApplication/schema/authenticationSelectionStep';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

describe('authenticationSelectionStep', () => {
  const SOURCE_TYPE = {
    name: 'amazon',
    schema: {
      authentication: [{ type: 'arn', name: 'ARN' }, { type: 'password', name: 'ACCOUNT' }, { type: 'withoutname' }],
    },
  };
  const APP_TYPE = {
    id: '1232',
    supported_authentication_types: {
      [SOURCE_TYPE.name]: ['arn', 'password', 'withoutname'],
    },
  };
  const INTL = { formatMessage: ({ defaultMessage }) => defaultMessage };
  const AUTH_VALUES = [{ authtype: 'password' }];

  const selectionStep = authenticationSelectionStep(SOURCE_TYPE, APP_TYPE, INTL, AUTH_VALUES);

  it('generates authentication type selection step', () => {
    expect(selectionStep).toEqual({
      name: `selectAuthType-${APP_TYPE.id}`,
      title: 'Select authentication type',
      fields: [
        {
          component: componentTypes.RADIO,
          name: 'authtype',
          options: [
            { label: 'ARN', value: 'arn' },
            { label: 'ACCOUNT', value: 'password' },
            { label: 'Unknown type', value: 'withoutname' },
          ],
          isRequired: true,
          validate: [{ type: validatorTypes.REQUIRED }],
        },
      ],
      nextStep: expect.any(Function),
    });
  });

  it('nextstep is first step of the authentication', () => {
    expect(
      selectionStep.nextStep({
        values: {
          application: { application_type_id: '456' },
          authtype: 'arn',
        },
      }),
    ).toEqual('amazon-456-arn');
  });

  it('nextstep is authentication selection when there are auths available', () => {
    expect(
      selectionStep.nextStep({
        values: {
          application: { application_type_id: '456' },
          authtype: 'password',
        },
      }),
    ).toEqual('selectAuthentication');
  });

  it('nextstep is undefined when no authtype', () => {
    expect(
      selectionStep.nextStep({
        values: { application: { application_type_id: '456' } },
      }),
    ).toEqual(undefined);
  });
});
