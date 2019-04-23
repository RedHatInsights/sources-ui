import { SOURCES_API_BASE } from '../Utilities/Constants';
// import { getApiInstance } from './entities.js';

export function doLoadSourceTypes() {
    return fetch(SOURCES_API_BASE + '/source_types/')
    .then(r => r.json())
    .then(data => data.data);

    /*  FIXME: the API is broken now, data is returned as "Object object" so switching
     *  to fetch() for now.
     *
     *  let opts = {
     *      limit: 100,
     *      offset: 0
     *  };
     *
     *  return getApiInstance().listSourceTypes(opts).then((data) => {
     *      console.log('data: ', data.data);
     *      return data.data;
     *  }, (error) => {
     *      console.error(error);
     *      return [];
     *  });
    */
}

;
