import React from 'react';
import { useIntl } from 'react-intl';

import { Text } from '@patternfly/react-core/dist/js/components/Text/Text';

const CCSP_HREF = 'https://www.redhat.com/en/certified-cloud-and-service-providers';

const ProvidersLink = () => {
  const intl = useIntl();

  return (
    <Text className="ccsp-link" component="a" href={CCSP_HREF} target="_blank" rel="noopener noreferrer">
      {intl.formatMessage({
        id: 'cloud.emptystate.cccspLink',
        defaultMessage: 'See all Red Hat Certified Cloud & Service Providers',
      })}
    </Text>
  );
};

export default ProvidersLink;
