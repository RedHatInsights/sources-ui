import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core/deprecated';

import { replaceRouteId, routes } from '../../Routing';
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
    defaultMessage: 'You cannot perform this action on a paused source.',
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

  return (
    <Dropdown
      toggle={<KebabToggle onToggle={() => setOpen(!isOpen)} id="toggle-id-6" />}
      isOpen={isOpen}
      isPlain
      position="right"
      dropdownItems={[
        source.paused_at ? (
          <DropdownItem
            {...(!hasRightAccess && disabledProps)}
            key="unpause"
            onClick={wrappedFunction(() => dispatch(resumeSource(source.id, source.name, intl)))}
            description={intl.formatMessage({
              id: 'detail.resume.description',
              defaultMessage: 'Unpause data collection for this source',
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
            defaultMessage: 'Permanently delete this source and all collected data',
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
      ]}
    />
  );
};

export default SourceKebab;
