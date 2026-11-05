import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Content, ContentVariants } from '@patternfly/react-core';

const messages = defineMessages({
  openshiftEndpointUrlandca: {
    id: 'openshift.endpoint.urlAndCA',
    defaultMessage: 'Provide the OpenShift Container Platform URL and TLS certificate.',
  },
});

export const EndpointDesc = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.openshiftEndpointUrlandca)}</Content>
    </Content>
  );
};
