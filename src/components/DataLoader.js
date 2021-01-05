import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { loadAppTypes, loadEntities, loadSourceTypes } from '../redux/sources/actions';
import { parseQuery, updateQuery } from '../utilities/urlQuery';

const DataLoader = () => {
  const [initialLoad, setLoaded] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const sources = useSelector(({ sources }) => sources, shallowEqual);

  useEffect(() => {
    Promise.all([dispatch(loadSourceTypes()), dispatch(loadAppTypes()), dispatch(loadEntities(parseQuery()))]).then(() =>
      setLoaded(true)
    );
  }, []);

  useEffect(() => {
    if (initialLoad) {
      updateQuery(sources);
    }
  }, [location, initialLoad]);

  return null;
};

export default DataLoader;
