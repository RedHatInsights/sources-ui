import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import { Label } from '@patternfly/react-core';

import { ACCOUNT_AUTHORIZATION, MANUAL_CONFIGURATION } from '../../constants';
import SuperKeyCredentials from './SuperKeyCredentials';
import { bold } from '../../../utilities/intlShared';

const configurationStep = (intl, sourceTypes) => ({
  name: 'configuration_step',
  title: intl.formatMessage({
    id: 'wizard.configurationStep',
    defaultMessage: 'Select configuration',
  }),
  nextStep: ({ values }) => {
    if (!values.source?.app_creation_workflow) {
      return;
    }

    return values.source?.app_creation_workflow === ACCOUNT_AUTHORIZATION ? 'select_applications' : 'application_step';
  },
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'conf-desc',
      label: intl.formatMessage(
        {
          id: 'wizard.accountAuthDescription',
          defaultMessage:
            'Configure your source manually or let us manage all necessary credentials by selecting <b>account authorization</b> configuration.',
        },
        {
          b: bold,
        }
      ),
    },
    {
      component: componentTypes.RADIO,
      name: 'source.app_creation_workflow',
      label: intl.formatMessage({
        id: 'wizard.configurationMode',
        defaultMessage: 'Select a configuration mode',
      }),
      isRequired: true,
      resolveProps: (_p, _f, formOptions) => ({
        options: [
          {
            label: (
              <span className="src-c-wizard__rhel-mag-label">
                {intl.formatMessage({
                  id: 'wizard.accountAuth',
                  defaultMessage: 'Account authorization',
                })}
                <Label className="pf-v5-u-ml-sm" color="purple">
                  {intl.formatMessage({ id: 'wizard.confMode.reccomended', defaultMessage: 'Recommended' })}
                </Label>
              </span>
            ),
            description: intl.formatMessage(
              {
                id: 'wizard.accountAuth.desc',
                defaultMessage:
                  'A new automated source configuration method. Provide your {type} account credentials and let Red Hat configure and manage your source for you.',
              },
              {
                type:
                  { amazon: 'AWS', azure: 'Azure' }[formOptions.getState().values.source_type] ||
                  formOptions.getState().values.source_type,
              }
            ),
            value: ACCOUNT_AUTHORIZATION,
          },
        ],
      }),
      validate: [{ type: validatorTypes.REQUIRED }],
    },
    {
      component: componentTypes.SUB_FORM,
      name: 'sub-form',
      fields: [
        {
          component: 'description',
          name: 'super-key-credentials',
          Content: SuperKeyCredentials,
          sourceTypes,
        },
      ],
      condition: { when: 'source.app_creation_workflow', is: ACCOUNT_AUTHORIZATION },
      className: 'pf-v5-u-ml-md',
    },
    {
      component: componentTypes.RADIO,
      name: 'source.app_creation_workflow',
      options: [
        {
          label: intl.formatMessage({
            id: 'wizard.manualAuth',
            defaultMessage: 'Manual configuration',
          }),
          description: intl.formatMessage({
            id: 'wizard.manualAuth.desc',
            defaultMessage:
              'Configure and manage your source manually if you do not wish to provide account authorization credentials. You will set up sources the same way you do today.',
          }),
          value: MANUAL_CONFIGURATION,
        },
      ],
    },
  ],
});

export default configurationStep;
