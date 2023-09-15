import React from 'react';

import { Divider } from '@patternfly/react-core';
import { useFlag } from '@unleash/proxy-client-react';

const PFDivider = () => {
  const rhelAws = useFlag('platform.sources.metered-rhel');

  if (!rhelAws) {
    return null;
  }

  return <Divider />;
};

export default PFDivider;
