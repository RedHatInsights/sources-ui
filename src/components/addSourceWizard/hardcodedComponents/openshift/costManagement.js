import React from 'react';
import { useIntl } from 'react-intl';
import { HCCM_DOCS_PREFIX } from '../../stringConstants';

import { Text, TextVariants, TextContent } from '@patternfly/react-core';

import { bold } from '../../../../utilities/intlShared';

const INSTALL_PREREQUISITE = `${HCCM_DOCS_PREFIX}/html-single/getting_started_with_cost_management/index?lb_target=production#assembly-adding-openshift-container-platform-source`;

export const ConfigureCostOperator = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text>
        {intl.formatMessage(
          {
            id: 'cost.openshift.description',
            defaultMessage:
              'For Red Hat OpenShift Container Platform 4.6 and later, install the {operator} from the OpenShift Container Platform web console.',
          },
          {
            operator: <b key="bold">costmanagement-metrics-operator</b>,
          }
        )}
      </Text>
      <Text>
        <Text key="link" component={TextVariants.a} href={INSTALL_PREREQUISITE} target="_blank" rel="noopener noreferrer">
          {intl.formatMessage({
            id: 'wizard.learnMore',
            defaultMessage: 'Learn more',
          })}
        </Text>
      </Text>
      <Text>
        {intl.formatMessage(
          {
            id: 'cost.openshift.operator_configured',
            defaultMessage:
              'If you configured the operator to create a source (create_source: true), <b>STOP</b> here and <b>CANCEL</b> out of this flow.',
          },
          {
            b: bold,
          }
        )}
      </Text>
      <Text>
        {intl.formatMessage({
          id: 'cost.openshift.operator_not_configured',
          defaultMessage:
            'Otherwise, enter the cluster identifier below. You can find the cluster identifier in the cluster’s Help > About screen.',
        })}
      </Text>
    </TextContent>
  );
};
