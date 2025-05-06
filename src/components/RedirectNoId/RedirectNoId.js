import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { addHiddenSource, addMessage } from '../../redux/sources/actions';
import { doLoadSource } from '../../api/entities';
import { useIsLoaded } from '../../hooks/useIsLoaded';
import { routes } from '../../routes';
import { useSource } from '../../hooks/useSource';
import AppNavigate from '../AppNavigate';

const RedirectNoId = () => {
  const { id } = useParams();
  const intl = useIntl();
  const source = useSource();

  const loaded = useIsLoaded();

  const { appTypesLoaded, sourceTypesLoaded } = useSelector(({ sources }) => sources, shallowEqual);
  const dispatch = useDispatch();

  const [applicationIsLoaded, setIsApplicationLoaded] = useState(false);

  useEffect(() => {
    if (loaded && appTypesLoaded && sourceTypesLoaded) {
      doLoadSource(id)
        .then(({ sources: [source] }) => {
          dispatch(addHiddenSource(source));
          return source;
        })
        .then((source) => {
          if (!source) {
            dispatch(
              addMessage({
                title: intl.formatMessage({
                  id: 'sources.sourceNotFoundTitle',
                  defaultMessage: 'Requested source was not found',
                }),
                variant: 'danger',
                description: intl.formatMessage(
                  {
                    id: 'sources.sourceNotFoundTitleDescription',
                    defaultMessage: 'Source with { id } was not found. Try it again later.',
                  },
                  { id },
                ),
              }),
            );
          }

          setIsApplicationLoaded(true);
        });
    }
  }, [loaded, appTypesLoaded, sourceTypesLoaded]);

  if (applicationIsLoaded && !source) {
    return <AppNavigate to={routes.sources.path} />;
  }

  return null;
};

export default RedirectNoId;
