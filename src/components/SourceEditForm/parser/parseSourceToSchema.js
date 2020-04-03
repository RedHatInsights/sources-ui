import { genericInfo } from './genericInfo';
import { authenticationFields } from './authentication';
import { endpointFields } from './endpoint';
import { applicationsFields } from './application';

export const parseSourceToSchema = (source, editing, setEdit, sourceType, appTypes) => ({
    fields: [
        ...genericInfo(editing, setEdit, source.source.id),
        ...authenticationFields(source.authentications, sourceType, editing, setEdit, appTypes),
        ...applicationsFields(source.applications, sourceType, editing, setEdit, appTypes, source),
        source.endpoints && source.endpoints.length > 0 ? endpointFields(sourceType, editing, setEdit) : false
    ].filter(Boolean)
});
