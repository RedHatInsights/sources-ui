import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { Dropdown, DropdownItem, DropdownList, MenuToggle } from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons';

import { replaceRouteId, routes } from '../../routes';
import { useSource } from '../../hooks/useSource';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import { pauseSource, resumeSource } from '../../redux/sources/actions';
import disabledTooltipProps from '../../utilities/disabledTooltipProps';
import AppLink from '../AppLink';

const SourceKebab = () => {
  const [isOpen, setOpen] = useState(false);
  const intl = useIntl();
  const source = useSource();
  const hasRightAccess = useHasWritePermissions();
  const dispatch = useDispatch();
  const isOrgAdmin = useSelector(({ user }) => user.isOrgAdmin);

  const wrappedFunction = (func) => () => {
    setOpen(false);
    func();
  };

  const pausedTooltip = intl.formatMessage({
    id: 'sources.pausedSourceAction',
    defaultMessage: 'You cannot perform this action on a paused integration.',
  });

  const disabledProps = disabledTooltipProps(intl, isOrgAdmin);

  const pausedProps = {
    ...disabledProps,
    tooltip: pausedTooltip,
    tooltipProps: {
      ...disabledProps.tooltipProps,
      content: pausedTooltip,
    },
  };

  const dropdownItems = [
    [
      source.paused_at ? (
        <DropdownItem
          {...(!hasRightAccess && disabledProps)}
          key="unpause"
          onClick={wrappedFunction(() => dispatch(resumeSource(source.id, source.name, intl)))}
          description={intl.formatMessage({
            id: 'detail.resume.description',
            defaultMessage: 'Unpause data collection for this integration',
          })}
        >
          {intl.formatMessage({
            id: 'detail.resume.button',
            defaultMessage: 'Resume',
          })}
        </DropdownItem>
      ) : (
        <DropdownItem
          {...(!hasRightAccess && disabledProps)}
          key="pause"
          onClick={wrappedFunction(() => dispatch(pauseSource(source.id, source.name, intl)))}
          description={intl.formatMessage({
            id: 'detail.pause.description',
            defaultMessage: 'Temporarily disable data collection',
          })}
        >
          {intl.formatMessage({
            id: 'detail.pause.button',
            defaultMessage: 'Pause',
          })}
        </DropdownItem>
      ),
      <DropdownItem
        {...(!hasRightAccess && disabledProps)}
        key="remove"
        to={replaceRouteId(routes.sourcesDetailRemove.path, source.id)}
        component={AppLink}
        description={intl.formatMessage({
          id: 'detail.remove.description',
          defaultMessage: 'Permanently delete this integration and all collected data',
        })}
      >
        {intl.formatMessage({
          id: 'detail.remove.button',
          defaultMessage: 'Remove',
        })}
      </DropdownItem>,
      <DropdownItem
        {...(!hasRightAccess && disabledProps)}
        {...(source.paused_at && pausedProps)}
        key="rename"
        to={replaceRouteId(routes.sourcesDetailRename.path, source.id)}
        component={AppLink}
      >
        {intl.formatMessage({
          id: 'detail.rename.button',
          defaultMessage: 'Rename',
        })}
      </DropdownItem>,
    ],
  ];

  return (
    <Dropdown
      onOpenChange={(isOpen) => setOpen(isOpen)}
      toggle={(toggleRef) => (
        <MenuToggle
          ref={toggleRef}
          aria-label="kebab dropdown toggle"
          variant="plain"
          onClick={() => setOpen((prev) => !prev)}
          isExpanded={isOpen}
          icon={<EllipsisVIcon />}
        />
      )}
      shouldFocusToggleOnSelect
      isOpen={isOpen}
      isPlain
      popperProps={{
        position: 'right',
      }}
    >
      <DropdownList>{dropdownItems}</DropdownList>
    </Dropdown>
  );
};

export default SourceKebab;
