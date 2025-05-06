import React from 'react';
import { useIntl } from 'react-intl';
import { HCCM_LATEST_DOCS_PREFIX } from '../../stringConstants';

import { Content, ContentVariants } from '@patternfly/react-core';

import { bold } from '../../../../utilities/intlShared';

const INSTALL_PREREQUISITE = `${HCCM_LATEST_DOCS_PREFIX}/html/adding_an_openshift_container_platform_source_to_cost_management/integrating_openshift_container_platform_data_into_cost_management/assembly-adding-openshift-container-platform-int#installing-cost-operator_adding-an-ocp-int`;

export const ConfigureCostOperator = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component="p">
        {intl.formatMessage(
          {
            id: 'cost.openshift.description',
            defaultMessage:
              'For Red Hat OpenShift Container Platform 4.6 and later, install the {operator} from the OpenShift Container Platform web console.',
          },
          {
            operator: <b key="bold">costmanagement-metrics-operator</b>,
          },
        )}
      </Content>
      <Content component="p">
        <Content key="link" component={ContentVariants.a} href={INSTALL_PREREQUISITE} target="_blank" rel="noopener noreferrer">
          {intl.formatMessage({
            id: 'wizard.learnMore',
            defaultMessage: 'Learn more',
          })}
        </Content>
      </Content>
      <Content component="p">
        {intl.formatMessage(
          {
            id: 'cost.openshift.operator_configured',
            defaultMessage:
              'If you configured the operator to create an integration (create_source: true), <b>STOP</b> here and <b>CANCEL</b> out of this flow.',
          },
          {
            b: bold,
          },
        )}
      </Content>
      <Content component="p">
        {intl.formatMessage({
          id: 'cost.openshift.operator_not_configured',
          defaultMessage:
            'Otherwise, enter the cluster identifier below. You can find the cluster identifier in the cluster’s Help > About screen.',
        })}
      </Content>
    </Content>
  );
};
