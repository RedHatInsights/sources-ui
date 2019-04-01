export const sourcesViewDefinition = {
    displayName: 'Sources',
    url: '/sources/',
    /* [{"id":"1","name":"OCP","uid":"29e1facc-c769-48d2-914f-c6682314cf54","created_at":"2018-10-25T14:19:27.252Z",
        "updated_at":"2018-10-25T14:19:27.252Z","tenant_id":1}, {"id":"2","name":"foo","uid":null,
        "created_at":"2018-11-01T11:24:24.767Z","updated_at":"2018-11-01T11:24:24.767Z","tenant_id":1}] */
    columns: [
        { title: null, value: 'id' },
        //{ title: null, value: 'source_id', },
        //{ title: null, value: 'source_ref', },
        //{ title: 'Resource version', value: 'resource_version', },
        { title: 'UID', value: 'uid' },
        { title: 'Name', value: 'name' },
        { title: 'Source Type', value: 'source_type_id', formatter: 'sourceTypeFormatter' },
        // this column does not actually exist in the API, but is required by the design
        { title: 'Applications', value: 'applications' },
        //{ title: 'Tags', value: 'tags', },
        //{ title: null, value: 'display_name', },
        //{ title: 'Created at', value: 'created_at', },
        { title: 'Updated at', value: 'updated_at' },
        //{ title: null, value: 'source_deleted_at', },
        { title: null, value: 'tenant_id' }
        //{ title: null, value: 'source_created_at', },
        //{ title: 'Archived on', value: 'archived_on', },
    ]
};
