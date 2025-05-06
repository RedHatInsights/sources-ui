import React from 'react';
import { useIntl } from 'react-intl';

import { Content, ContentVariants } from '@patternfly/react-core';

export const EndpointDesc = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component={ContentVariants.p}>
        {intl.formatMessage({
          id: 'openshift.endpoint.urlAndCA',
          defaultMessage: 'Provide the OpenShift Container Platform URL and SSL certificate.',
        })}
      </Content>
    </Content>
  );
};
