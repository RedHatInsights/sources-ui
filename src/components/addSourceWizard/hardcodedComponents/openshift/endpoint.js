import React from 'react';
import { useIntl } from 'react-intl';

import { Text, TextContent, TextVariants } from '@patternfly/react-core';

export const EndpointDesc = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'openshift.endpoint.urlAndCA',
          defaultMessage: 'Provide the OpenShift Container Platform URL and SSL certificate.',
        })}
      </Text>
    </TextContent>
  );
};
