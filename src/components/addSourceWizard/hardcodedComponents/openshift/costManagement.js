const COST_OPERATOR_LABEL = <b key="bold">costmanagement-metrics-operator</b>;

import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { HCCM_LATEST_DOCS_PREFIX } from '../../stringConstants';

import { Content, ContentVariants } from '@patternfly/react-core';

import { bold } from '../../../../utilities/intlShared';

const messages = defineMessages({
  costOpenshiftDescription: {
    id: 'cost.openshift.description',
    defaultMessage:
      'For Red Hat OpenShift Container Platform 4.6 and later, install the {operator} from the OpenShift Container Platform web console.',
  },
  wizardLearnmore: {
    id: 'wizard.learnMore',
    defaultMessage: 'Learn more',
  },
  costOpenshiftOperatorConfigured: {
    id: 'cost.openshift.operator_configured',
    defaultMessage:
      'If you configured the operator to create an integration (create_source: true), <b>STOP</b> here and <b>CANCEL</b> out of this flow.',
  },
  costOpenshiftOperatorNotConfigured: {
    id: 'cost.openshift.operator_not_configured',
    defaultMessage:
      'Otherwise, enter the cluster identifier below. You can find the cluster identifier in the cluster’s Help > About screen.',
  },
});

const INSTALL_PREREQUISITE = `${HCCM_LATEST_DOCS_PREFIX}/integrate-install_cost_operator`;

export const ConfigureCostOperator = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component="p">
        {intl.formatMessage(messages.costOpenshiftDescription, {
          operator: COST_OPERATOR_LABEL,
        })}
      </Content>
      <Content component="p">
        <Content key="link" component={ContentVariants.a} href={INSTALL_PREREQUISITE} target="_blank" rel="noopener noreferrer">
          {intl.formatMessage(messages.wizardLearnmore)}
        </Content>
      </Content>
      <Content component="p">
        {intl.formatMessage(messages.costOpenshiftOperatorConfigured, {
          b: bold,
        })}
      </Content>
      <Content component="p">{intl.formatMessage(messages.costOpenshiftOperatorNotConfigured)}</Content>
    </Content>
  );
};
