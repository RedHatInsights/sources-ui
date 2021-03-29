import React from 'react';
import { useIntl } from 'react-intl';

import { Text, TextVariants } from '@patternfly/react-core/dist/esm/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/esm/components/Text/TextContent';

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
