export const sourcesViewDefinition = {
    columns: (intl) => ([{
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
        hidden: true,
        value: 'imported',
        formatter: 'importedFormatter'
    }, {
        title: intl.formatMessage({
            id: 'sources.status',
            defaultMessage: 'Status'
        }),
        value: 'availability_status',
        searchable: true,
        formatter: 'availabilityFormatter',
        sortable: true
    }])
};

const KEBAB_COLUMN = 1;
const COUNT_OF_COLUMNS = sourcesViewDefinition.columns({ formatMessage: () => '' }).length;

export const COLUMN_COUNT = COUNT_OF_COLUMNS + KEBAB_COLUMN;
