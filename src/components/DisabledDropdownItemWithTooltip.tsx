import { Button, ButtonProps, Tooltip, TooltipProps } from '@patternfly/react-core';
import React, { useRef } from 'react';

import './DisabledDropdownItemWithTooltip.scss';

export type DisabledDropdownItemWithTooltipProps = ButtonProps & {
  tooltipProps: TooltipProps;
};

/**
 * We are unable to use the `tooltipProps` on a disabled dropdown item in v6.
 * Need a custom component to handle this.
 * PF issue https://github.com/patternfly/patternfly-react/issues/11816
 */

const DisabledDropdownItemWithTooltip = (props: DisabledDropdownItemWithTooltipProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { tooltipProps, isDisabled, innerRef, component, ...rest } = props;

  if (!isDisabled) {
    return <Button {...rest} innerRef={innerRef} component={component} />;
  }

  return (
    // Ensure the sources CSS scope is applied
    // Dropdown append to body not the render root of the module
    // Need to use inline styles bc of possible missing CSS scope
    <div className="sources" style={{ width: '100%' }}>
      <Tooltip {...tooltipProps} triggerRef={triggerRef}>
        <span {...rest} tabIndex={0} ref={triggerRef}>
          <button {...rest} disabled className="pf-v6-c-menu__item pf-m-disabled sr-c-disabled-dropdown-item-with-tooltip" />
        </span>
      </Tooltip>
    </div>
  );
};

export default DisabledDropdownItemWithTooltip;
