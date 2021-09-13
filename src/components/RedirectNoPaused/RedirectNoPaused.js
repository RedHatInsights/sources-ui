import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { addMessage } from '../../redux/sources/actions';
import { replaceRouteId, routes } from '../../Routes';
import { useSource } from '../../hooks/useSource';

const RedirectNoPaused = () => {
  const intl = useIntl();
  const source = useSource();
  const dispatch = useDispatch();

  useEffect(() => {
    if (source.paused_at) {
      dispatch(
        addMessage({
          title: intl.formatMessage({
            id: 'sources.sourcePausedRedirect',
            defaultMessage: 'Source is paused',
          }),
          variant: 'danger',
          description: intl.formatMessage({
            id: 'sources.sourcePausedRedirectDescription',
            defaultMessage: 'You cannot perform this action on a paused source.',
          }),
        })
      );
    }
  }, [source.paused_at]);

  if (source.paused_at) {
    return <Redirect to={replaceRouteId(routes.sourcesDetail.path, source.id)} />;
  }

  return null;
};

export default RedirectNoPaused;
