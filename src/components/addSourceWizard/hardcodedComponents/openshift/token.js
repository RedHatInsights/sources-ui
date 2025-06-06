import React from 'react';
import { useIntl } from 'react-intl';

import { ClipboardCopy, Content, ContentVariants } from '@patternfly/react-core';

export const DescriptionSummary = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component={ContentVariants.p}>
        {intl.formatMessage({
          id: 'openshift.token.description',
          defaultMessage: 'An OpenShift Container Platform login token is required to communicate with the application.',
        })}
      </Content>
      <Content component={ContentVariants.p}>
        {intl.formatMessage({
          id: 'openshift.token.collectData',
          defaultMessage: 'To collect data from a Red Hat OpenShift Container Platform source:',
        })}
      </Content>
      <Content component="ol">
        <Content component="li">
          {intl.formatMessage({
            id: 'openshift.token.logIn',
            defaultMessage:
              'Log in to the Red Hat OpenShift Container Platform cluster with an account that has access to the namespace',
          })}
        </Content>
        <Content component="li">
          {intl.formatMessage({
            id: 'openshift.token.runCommand',
            defaultMessage: 'Run the following command to obtain your login token:',
          })}
        </Content>
        <ClipboardCopy className="pf-v6-u-mb-md" isReadOnly>
          {intl.formatMessage({
            id: 'openshift.token.comman',
            defaultMessage: '# oc sa get-token -n management-infra management-admin',
          })}
        </ClipboardCopy>
        <Content component="li">
          {intl.formatMessage({
            id: 'openshift.token.copyToken',
            defaultMessage: 'Copy the token and paste it in the Token field',
          })}
        </Content>
      </Content>
    </Content>
  );
};
