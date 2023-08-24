import React from 'react';
import { useIntl } from 'react-intl';

import { Text, TextContent, TextVariants } from '@patternfly/react-core';

export const AllFieldAreRequired = () => {
  const intl = useIntl();

  return (
    <Text component={TextVariants.p} className="src-wizard--all-required-text">
      {intl.formatMessage({
        id: 'catalog.auth.allFieldsRequired',
        defaultMessage: 'All fields are required.',
      })}
    </Text>
  );
};

export const AuthDescription = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text component={TextVariants.p} className="pf-v5-u-mb-l">
        {intl.formatMessage({
          id: 'catalog.auth.provideTowerCredentials',
          defaultMessage:
            'Provide Ansible Tower service account user credentials to ensure optimized availability of resources to Catalog Administrators.',
        })}
      </Text>
      <AllFieldAreRequired />
    </TextContent>
  );
};

export const EndpointDescription = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text component={TextVariants.p} className="pf-v5-u-mb-l">
        {intl.formatMessage({
          id: 'catalog.endpoint.enterHostname',
          defaultMessage: 'Enter the hostname of the Ansible Tower instance you want to connect to.',
        })}
      </Text>
    </TextContent>
  );
};
