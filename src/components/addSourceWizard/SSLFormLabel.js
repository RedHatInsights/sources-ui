import React from 'react';
import { useIntl } from 'react-intl';

import { Content, ContentVariants, Popover } from '@patternfly/react-core';

import QuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/question-circle-icon';

const SSLFormLabel = () => {
  const intl = useIntl();

  return (
    <React.Fragment>
      {intl.formatMessage({
        id: 'wizard.sslCertificate',
        defaultMessage: 'SSL Certificate',
      })}
      <Popover
        aria-label="Help text"
        maxWidth="50%"
        bodyContent={
          <Content>
            <Content component={ContentVariants.p}>
              {intl.formatMessage(
                {
                  id: 'wizard.openshiftCADescription1',
                  // eslint-disable-next-line max-len
                  defaultMessage:
                    'You can obtain your OpenShift Container Platform provider’s CA certificate for all endpoints (default, metrics, alerts) from {cmd}.',
                },
                { cmd: <b key="b">/etc/origin/master/ca.crt</b> },
              )}
            </Content>
            <Content component={ContentVariants.p}>
              {intl.formatMessage({
                id: 'wizard.openshiftCADescription2',
                defaultMessage:
                  'Paste the output (a block of text starting with --BEGIN CERTIFICATE--) into the Trusted CA Certificates field.',
              })}
            </Content>
          </Content>
        }
      >
        <QuestionCircleIcon className="pf-v6-u-ml-sm" />
      </Popover>
    </React.Fragment>
  );
};

export default SSLFormLabel;
