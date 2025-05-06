import React from 'react';
import { Label } from '@patternfly/react-core';

import { ACCOUNT_AUTHORIZATION, MANUAL_CONFIGURATION } from '../../../../components/constants';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import sourceTypes, { AMAZON_TYPE, AZURE_TYPE, OPENSHIFT_TYPE } from '../../../__mocks__/sourceTypes';
import configurationStep from '../../../../components/addSourceWizard/superKey/configurationStep';
import SuperKeyCredentials from '../../../../components/addSourceWizard/superKey/SuperKeyCredentials';

describe('configurationSteps', () => {
  it('generates configuration step', () => {
    const INTL = { formatMessage: ({ defaultMessage }, values) => defaultMessage.replace('{type}', values?.type) };

    const result = configurationStep(INTL, sourceTypes);

    expect(result.name).toEqual('configuration_step');
    expect(result.title).toEqual('Select configuration');

    expect(result.nextStep({ values: {} })).toEqual(undefined);
    expect(result.nextStep({ values: { source: { app_creation_workflow: ACCOUNT_AUTHORIZATION } } })).toEqual(
      'select_applications',
    );
    expect(result.nextStep({ values: { source: { app_creation_workflow: MANUAL_CONFIGURATION } } })).toEqual('application_step');

    expect(result.fields).toHaveLength(4);

    expect(result.fields[0].component).toEqual(componentTypes.PLAIN_TEXT);
    expect(result.fields[0].label).toEqual(
      'Configure your integration manually or let us manage all necessary credentials by selecting <b>account authorization</b> configuration.',
    );

    expect(result.fields[1].component).toEqual(componentTypes.RADIO);
    expect(result.fields[1].label).toEqual('Select a configuration mode');

    expect(
      result.fields[1].resolveProps(undefined, undefined, { getState: () => ({ values: { source_type: AMAZON_TYPE.name } }) }),
    ).toEqual({
      options: [
        {
          description:
            'A new automated integration configuration method. Provide your AWS account credentials and let Red Hat configure and manage your integration for you.',
          label: (
            <span className="src-c-wizard__rhel-mag-label">
              Account authorization
              <Label className="pf-v6-u-ml-sm" color="purple">
                Recommended
              </Label>
            </span>
          ),
          value: ACCOUNT_AUTHORIZATION,
        },
      ],
    });
    expect(
      result.fields[1].resolveProps(undefined, undefined, { getState: () => ({ values: { source_type: AZURE_TYPE.name } }) }),
    ).toEqual({
      options: [
        {
          description:
            'A new automated integration configuration method. Provide your Azure account credentials and let Red Hat configure and manage your integration for you.',
          label: (
            <span className="src-c-wizard__rhel-mag-label">
              Account authorization
              <Label className="pf-v6-u-ml-sm" color="purple">
                Recommended
              </Label>
            </span>
          ),
          value: ACCOUNT_AUTHORIZATION,
        },
      ],
    });
    expect(
      result.fields[1].resolveProps(undefined, undefined, { getState: () => ({ values: { source_type: OPENSHIFT_TYPE.name } }) }),
    ).toEqual({
      options: [
        {
          description:
            'A new automated integration configuration method. Provide your openshift account credentials and let Red Hat configure and manage your integration for you.',
          label: (
            <span className="src-c-wizard__rhel-mag-label">
              Account authorization
              <Label className="pf-v6-u-ml-sm" color="purple">
                Recommended
              </Label>
            </span>
          ),
          value: ACCOUNT_AUTHORIZATION,
        },
      ],
    });

    expect(result.fields[2].component).toEqual(componentTypes.SUB_FORM);
    expect(result.fields[2].condition).toEqual({ is: ACCOUNT_AUTHORIZATION, when: 'source.app_creation_workflow' });

    expect(result.fields[2].fields[0].Content).toEqual(SuperKeyCredentials);
    expect(result.fields[2].fields[0].component).toEqual('description');
    expect(result.fields[2].fields[0].sourceTypes).toEqual(sourceTypes);

    expect(result.fields[3].component).toEqual(componentTypes.RADIO);
    expect(result.fields[3].label).toEqual(undefined);
    expect(result.fields[3].options).toEqual([
      {
        description:
          'Configure and manage your integration manually if you do not wish to provide account authorization credentials. You will set up integrations the same way you do today.',
        label: 'Manual configuration',
        value: MANUAL_CONFIGURATION,
      },
    ]);
  });
});
