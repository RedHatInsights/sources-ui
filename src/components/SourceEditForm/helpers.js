import get from 'lodash/get';
import set from 'lodash/set';

import { endpointToUrl } from '../SourcesSimpleView/formatters';

export const selectOnlyEditedValues = (values, editing) => {
    const filteredValues = {};

    Object.keys(editing)
    .filter((key) => editing[key])
    .forEach((key) => {
        set(filteredValues, key, get(values, key));
    });

    return filteredValues;
};

export const prepareInitialValues = ({ source, endpoints: [endpoint], authentications }, sourceTypeName) => {
    const auhenticationsFinal = {};

    if (authentications && authentications.length > 0) {
        authentications.forEach((auth) => {
            auhenticationsFinal[`a${auth.id}`] = auth;
        });
    }

    let url;

    if (endpoint) {
        url = (endpoint.scheme || endpoint.host || endpoint.path || endpoint.port) ? endpointToUrl(endpoint) : undefined;
    }

    return ({
        source,
        source_type: sourceTypeName,
        endpoint,
        authentications: auhenticationsFinal,
        url
    });
};
