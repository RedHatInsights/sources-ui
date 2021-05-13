import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core';

import { replaceRouteId, routes } from '../../Routes';
import { useSource } from '../../hooks/useSource';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';

const SourceKebab = () => {
  const [isOpen, setOpen] = useState(false);
  const intl = useIntl();
  const { push } = useHistory();
  const source = useSource();
  const hasRightAccess = useHasWritePermissions();

  const tooltip = intl.formatMessage({
    id: 'sources.notAdminButton',
    defaultMessage: 'To perform this action, you must be granted write permissions from your Organization Administrator.',
  });

  const disabledProps = {
    tooltip,
    isDisabled: true,
    className: 'ins-c-sources__disabled-drodpown-item',
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
            //onClick={() => push(replaceRouteId(routes.sourcesDetailRemove.path, source.id))}
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
            //onClick={() => push(replaceRouteId(routes.sourcesDetailRemove.path, source.id))}
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
          onClick={() => push(replaceRouteId(routes.sourcesDetailRemove.path, source.id))}
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
          key="rename"
          onClick={() => push(replaceRouteId(routes.sourcesDetailRename.path, source.id))}
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
