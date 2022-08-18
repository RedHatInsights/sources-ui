import { render, screen } from '@testing-library/react';

import selectAuthenticationStep, {
  SelectAuthenticationDescription,
} from '../../../../components/AddApplication/schema/selectAuthenticationStep';

import applicationTypes, { COST_MANAGEMENT_APP, TOPOLOGY_INV_APP } from '../../../__mocks__/applicationTypes';
import { AMAZON_TYPE } from '../../../__mocks__/sourceTypes';
import { AuthTypeSetter } from '../../../../components/AddApplication/AuthTypeSetter';
import { IntlProvider } from 'react-intl';

describe('selectAuthenticationStep', () => {
  const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };
  const app = COST_MANAGEMENT_APP;

  it('selectAuthenticationStep generates selection step', () => {
    const source = {
      applications: [
        {
          application_type_id: TOPOLOGY_INV_APP.id,
          authentications: [{ id: '1' }],
        },
      ],
    };
    const sourceType = AMAZON_TYPE;

    const authenticationValues = [
      { id: '1', username: 'user-123', authtype: 'arn' },
      { id: '23324', authtype: 'arn' },
    ];

    const authSelection = selectAuthenticationStep({
      intl,
      source,
      authenticationValues,
      sourceType,
      applicationTypes,
      app,
    });

    expect(authSelection).toEqual(
      expect.objectContaining({
        name: 'selectAuthentication',
        nextStep: expect.any(Function),
        fields: [
          expect.objectContaining({
            name: 'authtypesetter',
            component: 'description',
            Content: AuthTypeSetter,
            authenticationValues,
            hideField: true,
          }),
          expect.objectContaining({
            name: `${COST_MANAGEMENT_APP.name}-subform`,
            fields: [
              expect.objectContaining({
                name: `${COST_MANAGEMENT_APP.name}-select-authentication-summary`,
              }),
              expect.objectContaining({
                name: 'selectedAuthentication',
                component: 'radio',
                isRequired: true,
                options: [
                  expect.objectContaining({ value: 'new-arn' }),
                  {
                    label: `ARN-${authenticationValues[0].username}-${TOPOLOGY_INV_APP.display_name}`,
                    value: authenticationValues[0].id,
                  },
                  {
                    label: `ARN-unused-${authenticationValues[1].id}`,
                    value: authenticationValues[1].id,
                  },
                ],
              }),
            ],
          }),
        ],
      })
    );

    expect(authSelection.nextStep({ values: {} })).toEqual('amazon-2-undefined');
    expect(
      authSelection.nextStep({
        values: {
          application: { application_type_id: COST_MANAGEMENT_APP.id },
          authtype: 'arn',
        },
      })
    ).toEqual('amazon-2-arn');
    expect(
      authSelection.nextStep({
        values: {
          application: { application_type_id: COST_MANAGEMENT_APP.id },
          authentication: { authtype: 'arn' },
        },
      })
    ).toEqual('amazon-2-arn');
  });

  it('selectAuthenticationStep generates selection step - when no auth available', () => {
    const source = {};
    const sourceType = AMAZON_TYPE;
    const authenticationValues = [];

    const authSelection = selectAuthenticationStep({
      intl,
      source,
      authenticationValues,
      sourceType,
      applicationTypes,
      app,
    });

    expect(authSelection).toEqual(
      expect.objectContaining({
        name: 'selectAuthentication',
        nextStep: expect.any(Function),
        fields: [
          expect.objectContaining({
            name: 'authtypesetter',
            component: 'description',
            Content: AuthTypeSetter,
            authenticationValues,
            hideField: true,
          }),
        ],
      })
    );
  });

  describe('SelectAuthenticationDescription', () => {
    it('renders correctly', () => {
      render(
        <IntlProvider locale="en">
          <SelectAuthenticationDescription applicationTypeName="Catalog" authenticationTypeName="ARN" />
        </IntlProvider>
      );

      expect(
        screen.getByText(
          'Selected application Catalog supports ARN authentication type. You can use already defined authentication values or define new.'
        )
      ).toBeInTheDocument();
    });
  });
});
