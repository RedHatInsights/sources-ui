export const sourcesColumns = (intl, notSortable = false) => [
  {
    title: intl.formatMessage({
      id: 'sources.name',
      defaultMessage: 'Name',
    }),
    value: 'name',
    formatter: 'nameFormatter',
    sortable: !notSortable,
  },
  {
    title: intl.formatMessage({
      id: 'sources.type',
      defaultMessage: 'Type',
    }),
    value: 'source_type_id',
    formatter: 'sourceTypeFormatter',
    sortable: !notSortable,
  },
  {
    title: intl.formatMessage({
      id: 'sources.application',
      defaultMessage: 'Applications',
    }),
    value: 'applications',
    formatter: 'applicationFormatter',
    sortable: !notSortable,
  },
  {
    title: intl.formatMessage({
      id: 'sources.addedDate',
      defaultMessage: 'Date added',
    }),
    value: 'created_at',
    formatter: 'dateFormatter',
    sortable: !notSortable,
  },
  {
    hidden: true,
    value: 'imported',
    formatter: 'importedFormatter',
  },
  {
    title: intl.formatMessage({
      id: 'sources.status',
      defaultMessage: 'Status',
    }),
    value: 'availability_status',
    formatter: 'availabilityFormatter',
  },
];

const KEBAB_COLUMN = 1;
const COUNT_OF_COLUMNS = sourcesColumns({ formatMessage: () => '' }).length;

export const COLUMN_COUNT = COUNT_OF_COLUMNS + KEBAB_COLUMN;
