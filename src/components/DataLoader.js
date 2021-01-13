import { useEffect, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { loadAppTypes, loadEntities, loadSourceTypes } from '../redux/sources/actions';
import { parseQuery, updateQuery } from '../utilities/urlQuery';

const DataLoader = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const sources = useSelector(({ sources }) => sources, shallowEqual);
  const previousPathname = useRef(pathname);

  useEffect(() => {
    Promise.all([dispatch(loadSourceTypes()), dispatch(loadAppTypes()), dispatch(loadEntities(parseQuery()))]);
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
