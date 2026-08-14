import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import { routes } from '../../routes';
import { disabledMessage } from '../../utilities/disabledTooltipProps';
import AppNavigate from '../AppNavigate';
import notificationsStore from '../../utilities/notificationsStore';

const RedirectNoWriteAccess = () => {
  const intl = useIntl();

  const writePermissions = useHasWritePermissions();
  const isOrgAdmin = useSelector(({ user }) => user.isOrgAdmin);

  useEffect(() => {
    if (writePermissions === false) {
      const title = intl.formatMessage({
        id: 'sources.insufficietnPerms',
        defaultMessage: 'Insufficient permissions',
      });
      const description = disabledMessage(intl, isOrgAdmin);

      notificationsStore.addNotification({ title, variant: 'danger', description });
    }
  }, [writePermissions]);

  if (writePermissions === false) {
    return <AppNavigate to={routes.sources.path} />;
  }

  return null;
};

export default RedirectNoWriteAccess;
