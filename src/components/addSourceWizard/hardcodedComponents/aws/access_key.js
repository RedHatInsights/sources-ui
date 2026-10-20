/* eslint-disable max-len */
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Content, Popover } from '@patternfly/react-core';

import QuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/question-circle-icon';

const messages = defineMessages({
  helpTextAria: {
    id: 'wizard.helpTextAria',
    defaultMessage: 'Help text',
  },
  wizardCreateacceskeypart1: {
    id: 'wizard.createAccesKeyPart1',
    defaultMessage: 'Create an access key in your AWS user account and enter the details below.',
  },
  wizardCreateacceskeypart2: {
    id: 'wizard.createAccesKeyPart2',
    defaultMessage:
      'For sufficient access and security, Red Hat recommends using the Power user identity and access management (IAM) policy for your AWS user account. ',
  },
  wizardCreateacceskeyhelptext: {
    id: 'wizard.createAccesKeyHelpText',
    defaultMessage:
      'The Power user policy allows the user full access to API functionality and AWS services for user administration. Create an access key in the Security Credentials area of your AWS user account. When adding your AWS account as an integration, the access key ID and secret access key act as your user ID and password.',
  },
});

export const DescriptionSummary = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component="p">{intl.formatMessage(messages.wizardCreateacceskeypart1)}</Content>
      <Content component="p">
        {intl.formatMessage(messages.wizardCreateacceskeypart2)}
        <Popover
          aria-label={intl.formatMessage(messages.helpTextAria)}
          position="bottom"
          bodyContent={
            <React.Fragment>
              <Content component="p">{intl.formatMessage(messages.wizardCreateacceskeyhelptext)}</Content>
            </React.Fragment>
          }
        >
          <QuestionCircleIcon />
        </Popover>
      </Content>
    </Content>
  );
};
