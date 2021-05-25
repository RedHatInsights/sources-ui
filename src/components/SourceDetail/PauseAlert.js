import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useSource } from '../../hooks/useSource';

import { Alert, AlertActionLink, GridItem, Tooltip } from '@patternfly/react-core';
import PauseIcon from '@patternfly/react-icons/dist/esm/icons/pause-icon';

import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import { resumeSource } from '../../redux/sources/actions';

const PauseAlert = () => {
  const intl = useIntl();
  const writePermissions = useHasWritePermissions();
  const dispatch = useDispatch();
  const source = useSource();

  return (
    <GridItem md={12} className="pf-u-m-lg pf-u-mb-0">
      <Alert
        customIcon={<PauseIcon />}
        variant="default"
        isInline
        title={intl.formatMessage({
          id: 'source.detail.pausedTitle',
          defaultMessage: 'Source paused',
        })}
        actionLinks={
          writePermissions ? (
            <AlertActionLink onClick={() => dispatch(resumeSource(source.id))}>
              {intl.formatMessage({
                id: 'source.detail.resumeConnection',
                defaultMessage: 'Resume connection',
              })}
            </AlertActionLink>
          ) : (
            <Tooltip
              content={intl.formatMessage({
                id: 'sources.notAdminButton',
                defaultMessage:
                  'To perform this action, you must be granted write permissions from your Organization Administrator.',
              })}
            >
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
            'No data is being collected for this source. Turn the source back on to reestablish connection and data collection. Previous credentials will be restored and application connections will continue as seen on this page.',
        })}
      </Alert>
    </GridItem>
  );
};

export default PauseAlert;
