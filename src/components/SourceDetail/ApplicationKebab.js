/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { Dropdown, DropdownItem, DropdownList, MenuToggle } from '@patternfly/react-core';
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';

import { replaceRouteId, routes } from '../../routes';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import { useSource } from '../../hooks/useSource';
import disabledTooltipProps from '../../utilities/disabledTooltipProps';
import AppLink from '../AppLink';
import DisabledDropdownItemWithTooltip from '../DisabledDropdownItemWithTooltip';

const messages = defineMessages({
  actionsAria: {
    id: 'applicationKebab.actionsAria',
    defaultMessage: 'Actions',
  },
  listOfIntegrationsAria: {
    id: 'sourcesTable.listOfIntegrationsAria',
    defaultMessage: 'List of Integrations',
  },

  sourcesPausedsourceaction: {
    id: 'sources.pausedSourceAction',
    defaultMessage: 'You cannot perform this action on a paused integration.',
  },
  appKebabResumeTitle: {
    id: 'app.kebab.resume.title',
    defaultMessage: 'Resume data collection for this application.',
  },
  appKebabResumeButton: {
    id: 'app.kebab.resume.button',
    defaultMessage: 'Resume',
  },
  appKebabPauseTitle: {
    id: 'app.kebab.pause.title',
    defaultMessage: 'Temporarily stop this application from collecting data.',
  },
  appKebabPauseButton: {
    id: 'app.kebab.pause.button',
    defaultMessage: 'Pause',
  },
  appKebabRemoveTitle: {
    id: 'app.kebab.remove.title',
    defaultMessage: 'Permanently stop data collection for this application.',
  },
  appKebabPauseButton_1: {
    id: 'app.kebab.remove.button',
    defaultMessage: 'Remove',
  },
});

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

  const pausedTooltip = intl.formatMessage(messages.sourcesPausedsourceaction);

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
      description={intl.formatMessage(messages.appKebabResumeTitle)}
      onClick={wrappedFunction(addApp)}
    >
      {intl.formatMessage(messages.appKebabResumeButton)}
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
      description={intl.formatMessage(messages.appKebabPauseTitle)}
      onClick={wrappedFunction(removeApp)}
    >
      {intl.formatMessage(messages.appKebabPauseButton)}
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
          aria-label={intl.formatMessage(messages.actionsAria)}
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
          description={intl.formatMessage(messages.appKebabRemoveTitle)}
        >
          {intl.formatMessage(messages.appKebabPauseButton_1)}
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
