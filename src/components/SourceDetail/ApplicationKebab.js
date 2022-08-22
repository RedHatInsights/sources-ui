import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core';

import { replaceRouteId, routes } from '../../Routes';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import { useSource } from '../../hooks/useSource';
import disabledTooltipProps from '../../utilities/disabledTooltipProps';

const ApplicationKebab = ({ app, removeApp, addApp }) => {
  const [isOpen, setOpen] = useState(false);
  const intl = useIntl();
  const source = useSource();
  const { push } = useHistory();
  const hasRightAccess = useHasWritePermissions();
  const isOrgAdmin = useSelector(({ user }) => user.isOrgAdmin);

  const wrappedFunction = (func) => () => {
    setOpen(false);
    func();
  };

  const disabledProps = disabledTooltipProps(intl, isOrgAdmin);

  const pausedTooltip = intl.formatMessage({
    id: 'sources.pausedSourceAction',
    defaultMessage: 'You cannot perform this action on a paused source.',
  });

  const pausedProps = {
    ...disabledProps,
    tooltip: pausedTooltip,
  };

  const pausedButton = app.paused_at ? (
    <DropdownItem
      {...(source.paused_at && pausedProps)}
      {...(!hasRightAccess && disabledProps)}
      key="resume"
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
      {...(source.paused_at && pausedProps)}
      {...(!hasRightAccess && disabledProps)}
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
  const removedButton = (
    <DropdownItem
      {...(source.paused_at && pausedProps)}
      {...(!hasRightAccess && disabledProps)}
      key="remove"
      description={intl.formatMessage({
        id: 'app.kebab.remove.title',
        defaultMessage: 'Permanently stop data collection for this application.',
      })}
      onClick={wrappedFunction(() =>
        push(replaceRouteId(routes.sourcesDetailRemoveApp.path, source.id).replace(':app_id', app.id))
      )}
    >
      {intl.formatMessage({
        id: 'app.kebab.pause.button',
        defaultMessage: 'Remove',
      })}
    </DropdownItem>
  );

  return (
    <Dropdown
      isPlain
      isOpen={isOpen}
      position="right"
      dropdownItems={[pausedButton, removedButton]}
      className="src-c-dropdown__application_kebab"
      toggle={<KebabToggle onToggle={() => setOpen((open) => !open)} />}
    />
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
