import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useSource } from '../../hooks/useSource';

import { Alert, AlertActionLink, GridItem, Tooltip } from '@patternfly/react-core';
import PauseIcon from '@patternfly/react-icons/dist/esm/icons/pause-icon';

import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import { resumeSource } from '../../redux/sources/actions';
import { disabledMessage } from '../../utilities/disabledTooltipProps';

const PauseAlert = () => {
  const intl = useIntl();
  const writePermissions = useHasWritePermissions();
  const dispatch = useDispatch();
  const source = useSource();
  const isOrgAdmin = useSelector(({ user }) => user.isOrgAdmin);

  return (
    <GridItem md={12} className="pf-v6-u-m-lg pf-v6-u-mb-0">
      <Alert
        customIcon={<PauseIcon />}
        variant="default"
        isInline
        title={intl.formatMessage({
          id: 'source.detail.pausedTitle',
          defaultMessage: 'Integration paused',
        })}
        actionLinks={
          writePermissions ? (
            <AlertActionLink onClick={() => dispatch(resumeSource(source.id, source.name, intl))}>
              {intl.formatMessage({
                id: 'source.detail.resumeConnection',
                defaultMessage: 'Resume connection',
              })}
            </AlertActionLink>
          ) : (
            <Tooltip content={disabledMessage(intl, isOrgAdmin)}>
              <AlertActionLink isDisabled>
                {intl.formatMessage({
                  id: 'source.detail.resumeConnection',
                  defaultMessage: 'Resume connection',
                })}
              </AlertActionLink>
            </Tooltip>
          )
        }
      >
        {intl.formatMessage({
          id: 'source.detail.pausedDescription',
          defaultMessage:
            'No data is being collected for this integration. Turn the integration back on to reestablish connection and data collection. Previous credentials will be restored and application connections will continue as seen on this page.',
        })}
      </Alert>
    </GridItem>
  );
};

export default PauseAlert;
