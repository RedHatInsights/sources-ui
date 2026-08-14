/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { Dropdown, DropdownItem, DropdownList, MenuToggle } from '@patternfly/react-core';
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';

import { replaceRouteId, routes } from '../../routes';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import { useSource } from '../../hooks/useSource';
import disabledTooltipProps from '../../utilities/disabledTooltipProps';
import AppLink from '../AppLink';
import DisabledDropdownItemWithTooltip from '../DisabledDropdownItemWithTooltip';

const ApplicationKebab = ({ app, removeApp, addApp }) => {
  const [isOpen, setOpen] = useState(false);
  const intl = useIntl();
  const source = useSource();
  const hasRightAccess = useHasWritePermissions();
  const isOrgAdmin = useSelector(({ user }) => user.isOrgAdmin);

  const wrappedFunction = (func) => () => {
    setOpen(false);
    func();
  };

  const disabledProps = disabledTooltipProps(intl, isOrgAdmin);

  const pausedTooltip = intl.formatMessage({
    id: 'sources.pausedSourceAction',
    defaultMessage: 'You cannot perform this action on a paused integration.',
  });

  const pausedProps = {
    ...disabledProps,
    tooltip: pausedTooltip,
    tooltipProps: {
      ...disabledProps,
      content: pausedTooltip,
    },
  };

  let tooltipProps = undefined;
  if (source.paused_at) {
    tooltipProps = pausedProps.tooltipProps;
  }

  if (!hasRightAccess) {
    tooltipProps = disabledProps.tooltipProps;
  }

  const isTooltipDisabled = source.paused_at || !hasRightAccess;

  const pausedButton = app.paused_at ? (
    <DropdownItem
      key="resume"
      component={forwardRef(({ isDisabled, ...props }, ref) => {
        return (
          <DisabledDropdownItemWithTooltip
            innerRef={ref}
            {...props}
            tooltipProps={tooltipProps}
            isDisabled={isTooltipDisabled}
            to={replaceRouteId(routes.sourcesDetailRename.path, source.id)}
            component={AppLink}
          />
        );
      })}
      description={intl.formatMessage({
        id: 'app.kebab.resume.title',
        defaultMessage: 'Resume data collection for this application.',
      })}
      onClick={wrappedFunction(addApp)}
    >
      {intl.formatMessage({
        id: 'app.kebab.resume.button',
        defaultMessage: 'Resume',
      })}
    </DropdownItem>
  ) : (
    <DropdownItem
      component={forwardRef(({ isDisabled, ...props }, ref) => {
        return (
          <DisabledDropdownItemWithTooltip
            innerRef={ref}
            {...props}
            tooltipProps={tooltipProps}
            isDisabled={isTooltipDisabled}
            to={replaceRouteId(routes.sourcesDetailRename.path, source.id)}
            component={AppLink}
          />
        );
      })}
      key="pause"
      description={intl.formatMessage({
        id: 'app.kebab.pause.title',
        defaultMessage: 'Temporarily stop this application from collecting data.',
      })}
      onClick={wrappedFunction(removeApp)}
    >
      {intl.formatMessage({
        id: 'app.kebab.pause.button',
        defaultMessage: 'Pause',
      })}
    </DropdownItem>
  );

  return (
    <Dropdown
      isPlain
      isOpen={isOpen}
      popperProps={{
        position: 'right',
      }}
      onOpenChange={(isOpen) => setOpen(isOpen)}
      className="src-c-dropdown__application_kebab"
      toggle={(toggleRef) => (
        <MenuToggle
          ref={toggleRef}
          aria-label="Actions"
          variant="plain"
          onClick={() => setOpen((prev) => !prev)}
          isExpanded={isOpen}
          icon={<EllipsisVIcon />}
        />
      )}
      shouldFocusToggleOnSelect
    >
      <DropdownList>
        {pausedButton}

        <DropdownItem
          key="remove"
          component={forwardRef(({ isDisabled, ...props }, ref) => {
            return (
              <DisabledDropdownItemWithTooltip
                innerRef={ref}
                {...props}
                tooltipProps={tooltipProps}
                isDisabled={isTooltipDisabled}
                to={replaceRouteId(routes.sourcesDetailRemoveApp.path, source.id).replace(':app_id', app.id)}
                component={AppLink}
              />
            );
          })}
          description={intl.formatMessage({
            id: 'app.kebab.remove.title',
            defaultMessage: 'Permanently stop data collection for this application.',
          })}
        >
          {intl.formatMessage({
            id: 'app.kebab.pause.button',
            defaultMessage: 'Remove',
          })}
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};

ApplicationKebab.propTypes = {
  app: PropTypes.shape({
    id: PropTypes.string,
    paused_at: PropTypes.string,
  }).isRequired,
  removeApp: PropTypes.func,
  addApp: PropTypes.func,
};

export default ApplicationKebab;
