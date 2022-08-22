import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { Tile, Tooltip } from '@patternfly/react-core';
import { disabledMessage } from '../../utilities/disabledTooltipProps';

const DisabledTile = (props) => {
  const intl = useIntl();
  const isOrgAdmin = useSelector(({ user }) => user.isOrgAdmin);

  const tooltip = disabledMessage(intl, isOrgAdmin);

  return (
    <Tooltip content={tooltip}>
      <div className="disabled-tile-with-tooltip">
        <Tile {...props} isDisabled />
      </div>
    </Tooltip>
  );
};

export default DisabledTile;
