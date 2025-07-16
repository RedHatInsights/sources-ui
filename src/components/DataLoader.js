import { useEffect, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useFlag } from '@unleash/proxy-client-react';

import { loadAppTypes, loadEntities, loadHcsEnrollment, loadSourceTypes } from '../redux/sources/actions';
import { loadEnhancedAttributes, parseQuery, updateQuery } from '../utilities/urlQuery';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { OVERVIEW } from '../utilities/constants';
import { ACTION_TYPES } from '../redux/sources/actionTypes';

const DataLoader = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const sources = useSelector(({ sources }) => sources, shallowEqual);
  const previousPathname = useRef(pathname);
  const hcsDisabled = useFlag('platform.integrations.hcs-disable');
  const {
    auth: { getToken },
    isProd,
  } = useChrome();

  const loadHcsData = async (token) => {
    if (hcsDisabled) {
      return dispatch({
        type: ACTION_TYPES.LOAD_HCS_ENROLLMENT_FULFILLED,
        payload: false,
      });
    }

    return dispatch(loadHcsEnrollment(token, isProd()));
  };

  const loadData = async () => {
    const { applications, types } = loadEnhancedAttributes();
    const token = await getToken();
    const noEntities = [OVERVIEW, null].includes(sources.activeCategory);

    if (applications || types) {
      Promise.all([dispatch(loadSourceTypes()), dispatch(loadAppTypes()), loadHcsData(token)]).then(
        () => noEntities || dispatch(loadEntities(parseQuery)),
      );
    } else {
      Promise.all([
        dispatch(loadSourceTypes()),
        dispatch(loadAppTypes()),
        noEntities || dispatch(loadEntities(parseQuery)),
        loadHcsData(token),
      ]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      updateQuery(sources);
      previousPathname.current = pathname;
    }
  }, [pathname]);

  return null;
};

export default DataLoader;
