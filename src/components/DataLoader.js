import { useEffect, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { loadAppTypes, loadEntities, loadHcsEnrollment, loadSourceTypes } from '../redux/sources/actions';
import { loadEnhancedAttributes, parseQuery, updateQuery } from '../utilities/urlQuery';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const DataLoader = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const sources = useSelector(({ sources }) => sources, shallowEqual);
  const previousPathname = useRef(pathname);
  const {
    auth: { getToken },
    isProd,
  } = useChrome();

  const loadData = async () => {
    const { applications, types } = loadEnhancedAttributes();
    const token = await getToken();

    if (applications || types) {
      Promise.all([dispatch(loadSourceTypes()), dispatch(loadAppTypes()), dispatch(loadHcsEnrollment(token, isProd()))]).then(
        () => dispatch(loadEntities(parseQuery)),
      );
    } else {
      Promise.all([
        dispatch(loadSourceTypes()),
        dispatch(loadAppTypes()),
        dispatch(loadEntities(parseQuery)),
        dispatch(loadHcsEnrollment(token, isProd())),
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
