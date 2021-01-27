import React from 'react';
import { useIntl } from 'react-intl';

import { Tile } from '@patternfly/react-core/dist/js/components/Tile/Tile';
import { Tooltip } from '@patternfly/react-core/dist/js/components/Tooltip/Tooltip';

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
