import { genericInfo } from './genericInfo';
import { authenticationFields } from './authentication';
import { endpointFields } from './endpoint';
import { applicationsFields } from './application';

export const parseSourceToSchema = (source, sourceType, appTypes, intl) => ({
    fields: [
        ...genericInfo(source.source.id, intl),
        ...authenticationFields(source.authentications, sourceType, appTypes),
        ...applicationsFields(source.applications, sourceType, appTypes, source),
        source.endpoints && source.endpoints.length > 0 ? endpointFields(sourceType) : false
    ].filter(Boolean)
});
