import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Content, ContentVariants, Popover } from '@patternfly/react-core';

import QuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/question-circle-icon';

const CA_CERT_PATH = <b key="b">/etc/origin/master/ca.crt</b>;

const messages = defineMessages({
  helpTextAria: {
    id: 'wizard.helpTextAria',
    defaultMessage: 'Help text',
  },
  wizardOpenshiftcadescription1: {
    id: 'wizard.openshiftCADescription1',
    defaultMessage:
      'You can obtain your OpenShift Container Platform provider\u2019s CA certificate for all endpoints (default, metrics, alerts) from {cmd}.',
  },

  wizardSslcertificate: {
    id: 'wizard.sslCertificate',
    defaultMessage: 'TLS Certificate',
  },
  wizardOpenshiftcadescription2: {
    id: 'wizard.openshiftCADescription2',
    defaultMessage:
      'Paste the output (a block of text starting with --BEGIN CERTIFICATE--) into the Trusted CA Certificates field.',
  },
});

const SSLFormLabel = () => {
  const intl = useIntl();

  return (
    <React.Fragment>
      {intl.formatMessage(messages.wizardSslcertificate)}
      <Popover
        aria-label={intl.formatMessage(messages.helpTextAria)}
        maxWidth="50%"
        bodyContent={
          <Content>
            <Content component={ContentVariants.p}>
              {intl.formatMessage(messages.wizardOpenshiftcadescription1, { cmd: CA_CERT_PATH })}
            </Content>
            <Content component={ContentVariants.p}>{intl.formatMessage(messages.wizardOpenshiftcadescription2)}</Content>
          </Content>
        }
      >
        <QuestionCircleIcon className="pf-v6-u-ml-sm" />
      </Popover>
    </React.Fragment>
  );
};

export default SSLFormLabel;
