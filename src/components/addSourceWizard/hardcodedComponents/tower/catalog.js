import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Content, ContentVariants } from '@patternfly/react-core';

const messages = defineMessages({
  catalogAuthAllfieldsrequired: {
    id: 'catalog.auth.allFieldsRequired',
    defaultMessage: 'All fields are required.',
  },
  catalogAuthProvidetowercredentials: {
    id: 'catalog.auth.provideTowerCredentials',
    defaultMessage:
      'Provide Ansible Tower service account user credentials to ensure optimized availability of resources to Catalog Administrators.',
  },
  catalogEndpointEnterhostname: {
    id: 'catalog.endpoint.enterHostname',
    defaultMessage: 'Enter the hostname of the Ansible Tower instance you want to connect to.',
  },
});

export const AllFieldAreRequired = () => {
  const intl = useIntl();

  return (
    <Content component={ContentVariants.p} className="src-wizard--all-required-text">
      {intl.formatMessage(messages.catalogAuthAllfieldsrequired)}
    </Content>
  );
};

export const AuthDescription = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component={ContentVariants.p} className="pf-v6-u-mb-l">
        {intl.formatMessage(messages.catalogAuthProvidetowercredentials)}
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
        {intl.formatMessage(messages.catalogEndpointEnterhostname)}
      </Content>
    </Content>
  );
};
