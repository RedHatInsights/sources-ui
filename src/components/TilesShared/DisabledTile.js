import React from 'react';
import { useIntl } from 'react-intl';

import { Tile, Tooltip } from '@patternfly/react-core';

const DisabledTile = (props) => {
  const intl = useIntl();

  const tooltip = intl.formatMessage({
    id: 'sources.notAdminButton',
    defaultMessage: 'To perform this action, you must be granted write permissions from your Organization Administrator.',
  });

  return (
    <Tooltip content={tooltip}>
      <div className="disabled-tile-with-tooltip">
        <Tile {...props} isDisabled />
      </div>
    </Tooltip>
  );
};

export default DisabledTile;
