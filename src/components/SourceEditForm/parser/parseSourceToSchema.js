import { genericInfo } from './genericInfo';
import { authenticationFields } from './authentication';
import { endpointFields } from './endpoint';
import { applicationsFields } from './application';

export const parseSourceToSchema = (source, editing, setEdit, sourceType, appTypes) => ({
    fields: [
        ...genericInfo(editing, setEdit, source.source.id),
        ...authenticationFields(source.authentications, sourceType, editing, setEdit),
        ...applicationsFields(source.applications, sourceType, editing, setEdit, appTypes, source.authentications),
        endpointFields(sourceType, editing, setEdit)
    ].filter(Boolean)
});
