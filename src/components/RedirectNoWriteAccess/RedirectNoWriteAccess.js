import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { addMessage } from '../../redux/sources/actions';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import { routes } from '../../Routes';

const RedirectNoWriteAccess = () => {
  const intl = useIntl();

  const writePermissions = useHasWritePermissions();

  const dispatch = useDispatch();

  useEffect(() => {
    if (writePermissions === false) {
      const title = intl.formatMessage({
        id: 'sources.insufficietnPerms',
        defaultMessage: 'Insufficient permissions',
      });
      const description = intl.formatMessage({
        id: 'sources.notAdminButton',
        defaultMessage: 'To perform this action, you must be granted write permissions from your Organization Administrator.',
      });

      dispatch(addMessage(title, 'danger', description));
    }
  }, [writePermissions]);

  if (writePermissions === false) {
    return <Redirect to={routes.sources.path} />;
  }

  return null;
};

export default RedirectNoWriteAccess;
