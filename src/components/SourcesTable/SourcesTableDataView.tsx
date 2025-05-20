import React, { Fragment, useMemo } from 'react';
import { Pagination, TextContent, TextVariants, Text, OnPerPageSelect, OnSetPage, EmptyState, EmptyStateHeader, EmptyStateIcon, EmptyStateBody, Button, Skeleton } from '@patternfly/react-core';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDataViewFilters, useDataViewPagination, useDataViewSort } from '@patternfly/react-data-view/dist/dynamic/Hooks';
import { DataView, DataViewState } from '@patternfly/react-data-view/dist/dynamic/DataView';
import { DataViewTable, DataViewTh, DataViewTr } from '@patternfly/react-data-view/dist/dynamic/DataViewTable';
import { DataViewToolbar } from '@patternfly/react-data-view/dist/dynamic/DataViewToolbar';
import { DataViewFilterOption, DataViewFilters } from '@patternfly/react-data-view/dist/dynamic/DataViewFilters';
import { DataViewTextFilter, DataViewTextFilterProps } from '@patternfly/react-data-view/dist/dynamic/DataViewTextFilter';
import { DataViewCheckboxFilter, DataViewCheckboxFilterProps } from '@patternfly/react-data-view/dist/dynamic/DataViewCheckboxFilter';
import { ActionsColumn, IAction, Td, ThProps, Tr } from '@patternfly/react-table';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import { useIsLoaded } from '../../hooks/useIsLoaded';
import { FormattedMessage, useIntl } from 'react-intl';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { applicationFormatter, ApplicationLabel, availabilityFormatter, nameFormatter, sourceTypeFormatter } from '../../views/formatters';
import { ResponsiveAction, ResponsiveActions, SkeletonTableBody } from '@patternfly/react-component-groups';
import { SearchIcon } from '@patternfly/react-icons';
import EmptyStateTable from './EmptyStateTable';
import SkeletonTableHead from '@patternfly/react-component-groups/dist/esm/SkeletonTableHead';
import { sortEntities } from '../../redux/sources/actions';
import { sourcesColumns } from '../../views/sourcesViewDefinition';
import { actionResolver, mergeToBasename, linkBasename } from '../../utilities/utils';
import ExportIcon from '@patternfly/react-icons/dist/dynamic/icons/export-icon';
import { routes } from '../../Routing';
import ExportDropDown from '../ExportDropdown';
import { Loader } from './loaders';

const AvailableFiler: React.FC<{ type: 'text' | 'checkbox' } & DataViewTextFilterProps & DataViewCheckboxFilterProps> = ({ type, ...props }) => {
  const Cmp = type === 'text' ? DataViewTextFilter : DataViewCheckboxFilter;
  return <Cmp {...props} />
}

const perPageOptions = [
  { title: '10', value: 10 },
  { title: '20', value: 20 },
  { title: '50', value: 50 },
  { title: '100', value: 100 }
];

interface Source {
  id: string;
  name: string;
  applications: {
    application_type_id: string;
    availability_status: string;
  }[];
  availability_status: string;
  created_at: string;
  source_type_id: string;
}

const ouiaId = 'SourcesTableDw';

const SourcesTableDW: React.FunctionComponent<{ paginationConfig: {
    onSetPage: OnSetPage;
    onPerPageSelect: OnPerPageSelect;
  };
  filterConfig: {
    type: 'text' | 'checkbox';
    label: string;
    name: string;
    filterValues: { 
      onChange: (event: unknown | undefined, value: unknown, selectedValue?: unknown) => void;
      items: {
        label: string;
        value: string;
      }[]
    }
  }[];
  activeFiltersConfig: {
    name?: string;
    key: string
    chips?: {
      value: string
    }[]
  }[];
  onDeleteAll: () => void;
  onExport: (type: 'csv' | 'json') => void;
}> = ({ 
  paginationConfig: {
    onSetPage,
    onPerPageSelect
  },
  filterConfig,
  activeFiltersConfig,
  onDeleteAll,
  onExport
}) => {
  const intl = useIntl();
  const loaded = useIsLoaded();
  const writePermissions = useHasWritePermissions();
  const isOrgAdmin = useSelector(({ user }) => user.isOrgAdmin);
  const navigate = useAppNavigate();

  console.log(filterConfig, 'this is FC');
  console.log(activeFiltersConfig, 'this is active FC');

  const {
    appTypes,
    entities,
    sourceTypes,
    sourceTypesLoaded,
    appTypesLoaded,
    numberOfEntities,
    pageSize,
    pageNumber,
    sortBy,
    sortDirection,
    removingSources,
  } = useSelector(({ sources }) => sources, shallowEqual);
  const reduxDispatch = useDispatch();
  const COLUMNS = useMemo(() => sourcesColumns(intl).filter(({ hidden }) => !hidden), [])
  const sortByIndex = useMemo(() => COLUMNS.findIndex(item => item.value === sortBy), [ sortBy ]);

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: sortByIndex,
      direction: sortDirection,
      defaultDirection: 'asc'
    },
    onSort: (_event: any, index: number, direction: 'asc' | 'desc' | undefined) => {
      sortEntities(COLUMNS[index].value, direction)(reduxDispatch);
    },
    columnIndex
  });

  const columns: any[] = COLUMNS.map((column, index) => ({
    cell: column.title,
    ...column.sortable && {props: { sort: getSortParams(index) }}
  }));


  const rows: DataViewTr[] = useMemo(() => entities.map((source: Source, index: number) => {
    const actions = actionResolver(intl, navigate, writePermissions, reduxDispatch, isOrgAdmin)(source);
    const isDeleting = removingSources.includes(source.id);
    return isDeleting ? [
      {cell: <Skeleton />, props: { colSpan: columns.length } }
    ] : [
      nameFormatter(source.name, source, { sourceTypes }),
      sourceTypesLoaded ? sourceTypeFormatter(source.source_type_id, source, { sourceTypes }) : '',
      appTypesLoaded ? applicationFormatter(source.applications, source, { appTypes }) : '',
      <DateFormat date={source.created_at}/>,
      availabilityFormatter(source.availability_status, source, { appTypes }),
      { cell: <ActionsColumn items={actions as unknown as IAction[]} className="rbac-c-actions_column" rowData={source} extraData={{ rowIndex: index }}/> },
    ]
}), [ sortBy, sortDirection, sourceTypesLoaded, appTypesLoaded, loaded, pageNumber, pageSize, writePermissions, entities, removingSources]);

  return (
    <DataView activeState={loaded ? numberOfEntities > 0 ? undefined : DataViewState.empty : DataViewState.loading}>
      <DataViewToolbar
        ouiaId={`${ouiaId}Header`}
        clearAllFilters = {() => onDeleteAll()}
        pagination={
          <Pagination
            isCompact
            perPageOptions={perPageOptions}
            itemCount={numberOfEntities}
            perPage={pageSize}
            page={pageNumber}
            onPerPageSelect={onPerPageSelect}
            onSetPage={onSetPage}
          />
        }
        actions={
          <Fragment>
            <ResponsiveActions breakpoint="lg" ouiaId="example-actions">
              <ResponsiveAction
                isPinned
                variant="primary"
                data-hcc-index="true"
                data-hcc-title={
                  intl.formatMessage({
                    id: 'sources.addSource',
                    defaultMessage: 'Add integration',
                  })
                }
                data-hcc-alt="create source;add cloud provider"
                id="addSourceButton"
                component="a"
                href={mergeToBasename(routes.sourcesNew.path, linkBasename)}
                isDisabled={!writePermissions}
                onClick={(ev) => {
                  ev.preventDefault();
                  if (writePermissions) {
                    navigate(routes.sourcesNew.path);
                  }
                }}
              >{
                intl.formatMessage({
                  id: 'sources.addSource',
                  defaultMessage: 'Add integration',
                })
              }</ResponsiveAction>
            </ResponsiveActions>
            <ExportDropDown onExport={onExport} />
          </Fragment>
          
        }
        filters={ 
          <DataViewFilters
            values={activeFiltersConfig.reduce((acc, item) => ({
              ...acc,
              [item.key]: item.name || item.chips?.map(({ value }) => value)
            }), {})}
          >
            {filterConfig.map(({ type, label, name, filterValues: { items, onChange } }) => (
              <AvailableFiler type={type} filterId={name} title={label} options={items} onChange={(ev, value) => {
                if (Array.isArray(value)) {
                  onChange(ev, value, value[0]);
                } else {
                  onChange(ev, value);
                }
              }}/>
            ))}
          </DataViewFilters>
        }
      />
      <DataViewTable
        aria-label='Repositories table'
        ouiaId={ouiaId}
        columns={columns}
        rows={rows}
        headStates={{ loading: <SkeletonTableHead columns={columns.map(({ cell }) => cell)} /> }}
        bodyStates={{
          loading: <SkeletonTableBody rowsCount={pageSize || 50} columnsCount={columns.length} />,
          empty: <Tr><Td colSpan={columns.length}><EmptyStateTable /></Td></Tr>
        }}
      />
      <DataViewToolbar
        ouiaId={`${ouiaId}Footer`}
        pagination={
          <Pagination
            perPageOptions={perPageOptions} 
            itemCount={numberOfEntities}
            perPage={pageSize}
            page={pageNumber}
            onPerPageSelect={onPerPageSelect}
            onSetPage={onSetPage}
          />
        } 
      />
    </DataView>
  );
}

export default SourcesTableDW;
