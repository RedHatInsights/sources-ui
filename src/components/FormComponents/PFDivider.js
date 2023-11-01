import React from 'react';

import { Divider } from '@patternfly/react-core';
import { usePreviewFlag } from '../../utilities/usePreviewFlag';

const PFDivider = () => {
  const rhelAws = usePreviewFlag('platform.sources.metered-rhel');

  if (!rhelAws) {
    return null;
  }

  return <Divider />;
};

export default PFDivider;
