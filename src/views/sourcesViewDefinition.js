export const sourcesViewDefinition = {
    displayName: 'Sources',
    url: '/sources/',
    columns: (intl) => ([{
        title: null,
        value: 'id'
    }, {
        title: null,
        value: 'uid'
    }, {
        title: intl.formatMessage({
            id: 'sources.name',
            defaultMessage: 'Name'
        }),
        value: 'name',
        searchable: true,
        formatter: 'nameFormatter',
        sortable: true
    }, {
        title: intl.formatMessage({
            id: 'sources.type',
            defaultMessage: 'Type'
        }),
        value: 'source_type_id',
        searchable: false,
        formatter: 'sourceTypeFormatter',
        sortable: false
    }, {
        title: intl.formatMessage({
            id: 'sources.application',
            defaultMessage: 'Application'
        }),
        value: 'applications',
        searchable: false,
        formatter: 'applicationFormatter',
        sortable: false
    }, {
        title: intl.formatMessage({
            id: 'sources.addedDate',
            defaultMessage: 'Date added'
        }),
        value: 'created_at',
        formatter: 'dateFormatter',
        sortable: true
    }, {
        title: null,
        value: 'tenant_id'
    }, {
        hidden: true,
        value: 'imported',
        formatter: 'importedFormatter'
    }])
};
