import { genericInfo } from './genericInfo';
import { authenticationFields } from './authentication';
import { endpointFields } from './endpoint';
import { applicationsFields } from './application';
import titleField from './titleField';

export const parseSourceToSchema = (source, sourceType, appTypes, intl) => ({
    fields: [
        ...genericInfo(source.source.id, intl, sourceType, source.applications),
        titleField(source.applications, sourceType, appTypes, intl),
        ...applicationsFields(source.applications, sourceType, appTypes, source),
        ...(source.applications.length === 0 ? authenticationFields(source.authentications, sourceType) : []),
        source.endpoints && source.endpoints.length > 0 ? endpointFields(sourceType) : false
    ].filter(Boolean)
});
