import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import { replaceRouteId, routes } from '../../routes';
import { useSource } from '../../hooks/useSource';
import AppNavigate from '../AppNavigate';
import notificationsStore from '../../utilities/notificationsStore';

const RedirectNoPaused = () => {
  const intl = useIntl();
  const source = useSource();

  useEffect(() => {
    if (source.paused_at) {
      notificationsStore.addNotification({
        title: intl.formatMessage({
          id: 'sources.sourcePausedRedirect',
          defaultMessage: 'Integration is paused',
        }),
        variant: 'danger',
        description: intl.formatMessage({
          id: 'sources.sourcePausedRedirectDescription',
          defaultMessage: 'You cannot perform this action on a paused integration.',
        }),
      });
    }
  }, [source.paused_at]);

  if (source.paused_at) {
    return <AppNavigate to={replaceRouteId(routes.sourcesDetail.path, source.id)} />;
  }

  return null;
};

export default RedirectNoPaused;
