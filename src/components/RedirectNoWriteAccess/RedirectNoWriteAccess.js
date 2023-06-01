import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

import { addMessage } from '../../redux/sources/actions';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import { routes } from '../../Routing';
import { disabledMessage } from '../../utilities/disabledTooltipProps';
import AppNavigate from '../AppNavigate';

const RedirectNoWriteAccess = () => {
  const intl = useIntl();

  const writePermissions = useHasWritePermissions();
  const isOrgAdmin = useSelector(({ user }) => user.isOrgAdmin);

  const dispatch = useDispatch();

  useEffect(() => {
    if (writePermissions === false) {
      const title = intl.formatMessage({
        id: 'sources.insufficietnPerms',
        defaultMessage: 'Insufficient permissions',
      });
      const description = disabledMessage(intl, isOrgAdmin);

      dispatch(addMessage({ title, variant: 'danger', description }));
    }
  }, [writePermissions]);

  if (writePermissions === false) {
    return <AppNavigate to={routes.sources.path} />;
  }

  return null;
};

export default RedirectNoWriteAccess;
