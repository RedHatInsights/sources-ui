import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { addMessage } from '../../redux/sources/actions';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import { routes } from '../../Routes';
import { disabledMessage } from '../../utilities/disabledTooltipProps';

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
      const description = disabledMessage(intl);

      dispatch(addMessage({ title, variant: 'danger', description }));
    }
  }, [writePermissions]);

  if (writePermissions === false) {
    return <Redirect to={routes.sources.path} />;
  }

  return null;
};

export default RedirectNoWriteAccess;
