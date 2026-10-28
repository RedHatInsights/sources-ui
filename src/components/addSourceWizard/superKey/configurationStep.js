import { defineMessages } from 'react-intl';
import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import { Label } from '@patternfly/react-core';

import { ACCOUNT_AUTHORIZATION, MANUAL_CONFIGURATION } from '../../constants';
import SuperKeyCredentials from './SuperKeyCredentials';
import { bold } from '../../../utilities/intlShared';

const messages = defineMessages({
  wizardConfigurationstep: {
    id: 'wizard.configurationStep',
    defaultMessage: 'Select configuration',
  },
  wizardAccountauthdescription: {
    id: 'wizard.accountAuthDescription',
    defaultMessage:
      'Configure your integration manually or let us manage all necessary credentials by selecting <b>account authorization</b> configuration.',
  },
  wizardConfigurationmode: {
    id: 'wizard.selectConfigurationMode',
    defaultMessage: 'Select a configuration mode',
  },
  wizardAccountauth: {
    id: 'wizard.accountAuth',
    defaultMessage: 'Account authorization',
  },
  wizardConfmodeReccomended: {
    id: 'wizard.confMode.reccomended',
    defaultMessage: 'Recommended',
  },
  wizardAccountauthDesc: {
    id: 'wizard.accountAuth.desc',
    defaultMessage:
      'A new automated integration configuration method. Provide your {type} account credentials and let Red Hat configure and manage your integration for you.',
  },
  wizardManualauth: {
    id: 'wizard.manualAuth',
    defaultMessage: 'Manual configuration',
  },
  wizardManualauthDesc: {
    id: 'wizard.manualAuth.desc',
    defaultMessage:
      'Configure and manage your integration manually if you do not wish to provide account authorization credentials. You will set up integrations the same way you do today.',
  },
});

const configurationStep = (intl, sourceTypes) => ({
  name: 'configuration_step',
  title: intl.formatMessage(messages.wizardConfigurationstep),
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
      label: intl.formatMessage(messages.wizardAccountauthdescription, {
        b: bold,
      }),
    },
    {
      component: componentTypes.RADIO,
      name: 'source.app_creation_workflow',
      label: intl.formatMessage(messages.wizardConfigurationmode),
      isRequired: true,
      resolveProps: (_p, _f, formOptions) => ({
        options: [
          {
            label: (
              <span className="src-c-wizard__rhel-mag-label">
                {intl.formatMessage(messages.wizardAccountauth)}
                <Label className="pf-v6-u-ml-sm" color="purple">
                  {intl.formatMessage(messages.wizardConfmodeReccomended)}
                </Label>
              </span>
            ),
            description: intl.formatMessage(messages.wizardAccountauthDesc, {
              type:
                { amazon: 'AWS', azure: 'Azure' }[formOptions.getState().values.source_type] ||
                formOptions.getState().values.source_type,
            }),
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
      className: 'pf-v6-u-ml-md',
    },
    {
      component: componentTypes.RADIO,
      name: 'source.app_creation_workflow',
      options: [
        {
          label: intl.formatMessage(messages.wizardManualauth),
          description: intl.formatMessage(messages.wizardManualauthDesc),
          value: MANUAL_CONFIGURATION,
        },
      ],
    },
  ],
});

export default configurationStep;
