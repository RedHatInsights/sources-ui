import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { ClipboardCopy, Content, ContentVariants } from '@patternfly/react-core';

const messages = defineMessages({
  openshiftTokenDescription: {
    id: 'openshift.token.description',
    defaultMessage: 'An OpenShift Container Platform login token is required to communicate with the application.',
  },
  openshiftTokenCollectdata: {
    id: 'openshift.token.collectData',
    defaultMessage: 'To collect data from a Red Hat OpenShift Container Platform source:',
  },
  openshiftTokenLogin: {
    id: 'openshift.token.logIn',
    defaultMessage: 'Log in to the Red Hat OpenShift Container Platform cluster with an account that has access to the namespace',
  },
  openshiftTokenRuncommand: {
    id: 'openshift.token.runCommand',
    defaultMessage: 'Run the following command to obtain your login token:',
  },
  openshiftTokenComman: {
    id: 'openshift.token.comman',
    defaultMessage: '# oc sa get-token -n management-infra management-admin',
  },
  openshiftTokenCopytoken: {
    id: 'openshift.token.copyToken',
    defaultMessage: 'Copy the token and paste it in the Token field',
  },
});

export const DescriptionSummary = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.openshiftTokenDescription)}</Content>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.openshiftTokenCollectdata)}</Content>
      <Content component="ol">
        <Content component="li">{intl.formatMessage(messages.openshiftTokenLogin)}</Content>
        <Content component="li">{intl.formatMessage(messages.openshiftTokenRuncommand)}</Content>
        <ClipboardCopy className="pf-v6-u-mb-md" isReadOnly>
          {intl.formatMessage(messages.openshiftTokenComman)}
        </ClipboardCopy>
        <Content component="li">{intl.formatMessage(messages.openshiftTokenCopytoken)}</Content>
      </Content>
    </Content>
  );
};
