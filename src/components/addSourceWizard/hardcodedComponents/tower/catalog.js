import React from 'react';
import { useIntl } from 'react-intl';

import { Content, ContentVariants } from '@patternfly/react-core';

export const AllFieldAreRequired = () => {
  const intl = useIntl();

  return (
    <Content component={ContentVariants.p} className="src-wizard--all-required-text">
      {intl.formatMessage({
        id: 'catalog.auth.allFieldsRequired',
        defaultMessage: 'All fields are required.',
      })}
    </Content>
  );
};

export const AuthDescription = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component={ContentVariants.p} className="pf-v6-u-mb-l">
        {intl.formatMessage({
          id: 'catalog.auth.provideTowerCredentials',
          defaultMessage:
            'Provide Ansible Tower service account user credentials to ensure optimized availability of resources to Catalog Administrators.',
        })}
      </Content>
      <AllFieldAreRequired />
    </Content>
  );
};

export const EndpointDescription = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component={ContentVariants.p} className="pf-v6-u-mb-l">
        {intl.formatMessage({
          id: 'catalog.endpoint.enterHostname',
          defaultMessage: 'Enter the hostname of the Ansible Tower instance you want to connect to.',
        })}
      </Content>
    </Content>
  );
};
