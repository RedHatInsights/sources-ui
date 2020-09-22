import get from 'lodash/get';
import set from 'lodash/set';

import { endpointToUrl } from '../SourcesTable/formatters';

export const selectOnlyEditedValues = (values, editing) => {
    const filteredValues = {};

    Object.keys(editing)
    .filter((key) => editing[key])
    .forEach((key) => {
        set(filteredValues, key, get(values, key));
    });

    return filteredValues;
};

export const prepareInitialValues = ({ endpoints, authentications, applications, ...rest }, sourceTypeName) => {
    const auhenticationsFinal = {};

    const mergeAuths = [
        ...(authentications || []),
        ...(applications?.reduce((acc, curr) => [...acc, ...curr.authentications], []) || [])
    ];

    if (mergeAuths.length > 0) {
        mergeAuths.forEach((auth) => {
            auhenticationsFinal[`a${auth.id}`] = auth;
        });
    }

    let endpoint;
    let url;

    if (endpoints && endpoints.length > 0) {
        endpoint = endpoints[0];
    }

    if (endpoint) {
        url = (endpoint.scheme || endpoint.host || endpoint.path || endpoint.port) ? endpointToUrl(endpoint) : undefined;
    }

    return ({
        source_type: sourceTypeName,
        endpoint,
        authentications: auhenticationsFinal,
        url,
        ...rest
    });
};
