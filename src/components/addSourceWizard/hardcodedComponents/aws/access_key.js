/* eslint-disable max-len */
import React from 'react';
import { useIntl } from 'react-intl';

import { Popover, Text, TextContent } from '@patternfly/react-core';

import QuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/question-circle-icon';

export const DescriptionSummary = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text>
        {intl.formatMessage({
          id: 'wizard.createAccesKeyPart1',
          defaultMessage: 'Create an access key in your AWS user account and enter the details below.',
        })}
      </Text>
      <Text>
        {intl.formatMessage({
          id: 'wizard.createAccesKeyPart2',
          defaultMessage:
            'For sufficient access and security, Red Hat recommends using the Power user identity and access management (IAM) policy for your AWS user account. ',
        })}
        <Popover
          aria-label="Help text"
          position="bottom"
          bodyContent={
            <React.Fragment>
              <Text>
                {intl.formatMessage({
                  id: 'wizard.createAccesKeyHelpText',
                  defaultMessage:
                    'The Power user policy allows the user full access to API functionality and AWS services for user administration. Create an access key in the Security Credentials area of your AWS user account. When adding your AWS account as an integration, the access key ID and secret access key act as your user ID and password.',
                })}
              </Text>
            </React.Fragment>
          }
        >
          <QuestionCircleIcon />
        </Popover>
      </Text>
    </TextContent>
  );
};
