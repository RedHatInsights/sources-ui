import React from 'react';
import { useIntl } from 'react-intl';

import { Tile, Tooltip } from '@patternfly/react-core';
import { disabledMessage } from '../../utilities/disabledTooltipProps';

const DisabledTile = (props) => {
  const intl = useIntl();

  const tooltip = disabledMessage(intl);

  return (
    <Tooltip content={tooltip}>
      <div className="disabled-tile-with-tooltip">
        <Tile {...props} isDisabled />
      </div>
    </Tooltip>
  );
};

export default DisabledTile;
