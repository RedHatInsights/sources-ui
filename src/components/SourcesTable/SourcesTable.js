import React, { useEffect, useMemo, useReducer } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { ActionsColumn, sortable, wrappable } from '@patternfly/react-table';
import { useIntl } from 'react-intl';

import { pageAndSize, pauseSource, resumeSource, sortEntities } from '../../redux/sources/actions';
import { DWPlaceHolderTable } from './loaders';
import { sourcesColumns } from '../../views/sourcesViewDefinition';
import { EmptyStateDataView } from './EmptyStateTable';
import { useIsLoaded } from '../../hooks/useIsLoaded';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import { replaceRouteId, routes } from '../../routes';
import disabledTooltipProps from '../../utilities/disabledTooltipProps';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import './sourcesTable.scss';
import { DataView, DataViewState, DataViewTable, DataViewToolbar } from '@patternfly/react-data-view';
import { Pagination } from '@patternfly/react-core';

export const itemToCells = (item, columns, sourceTypes, appTypes) =>
  columns
    .filter((column) => column.title || column.hidden)
    .map((col) => ({
      title: col.formatter
        ? col.formatter(item[col.value], item, {
            sourceTypes,
            appTypes,
          })
        : item[col.value] || '',
    }));

const renderSources = (entities, columns, sourceTypes, appTypes, removingSources) =>
  entities
    .filter(({ hidden }) => !hidden)
    .reduce((acc, item) => {
      const isDeleting = removingSources.includes(item.id);

      return [
        ...acc,
        {
          ...item,
          originalName: item.name,
          isOpen: !!item.expanded,
          cells: itemToCells(item, columns, sourceTypes, appTypes),
          disableActions: isDeleting,
          isDeleting,
        },
      ];
    }, []);

export const prepareColumnsCells = (columns) =>
  columns
    .filter((column) => column.title || column.hidden)
    .map((column) => ({
      title: column.title || '',
      value: column.value,
      hidden: column.hidden,
      transforms: [wrappable],
      ...(column.sortable && { transforms: [sortable, wrappable] }),
      props: column.title ? { 'aria-label': column.title } : { 'aria-label': 'Column without title' },
    }));

const reducer = (state, payload) => ({ ...state, ...payload, key: state.key + 1 });

const initialState = (columns) => ({
  rows: [],
  sortBy: {},
  isLoaded: false,
  cells: prepareColumnsCells(columns),
  key: 0,
});

export const actionResolver = (intl, navigate, hasWritePermissions, dispatch, isOrgAdmin) => (rowData) => {
  const disabledProps = disabledTooltipProps(intl, isOrgAdmin);
  const actions = [];

  if (rowData.paused_at) {
    actions.push({
      title: intl.formatMessage({
        id: 'sources.resume',
        defaultMessage: 'Resume',
      }),
      description: intl.formatMessage({
        id: 'sources.resume.description',
        defaultMessage: 'Unpause data collection for this integration',
      }),
      onClick: () => dispatch(resumeSource(rowData.id, rowData.originalName, intl)),
      ...(!hasWritePermissions ? disabledProps : { component: 'button' }),
    });
  } else {
    actions.push({
      title: intl.formatMessage({
        id: 'sources.pause',
        defaultMessage: 'Pause',
      }),
      description: intl.formatMessage({
        id: 'sources.pause.description',
        defaultMessage: 'Temporarily disable data collection',
      }),
      onClick: () => dispatch(pauseSource(rowData.id, rowData.originalName, intl)),
      ...(!hasWritePermissions ? disabledProps : { component: 'button' }),
    });
  }

  actions.push({
    title: intl.formatMessage({
      id: 'sources.remove',
      defaultMessage: 'Remove',
    }),
    description: intl.formatMessage({
      id: 'sources.remove.description',
      defaultMessage: 'Permanently delete this integration and all collected data',
    }),
    onClick: () => navigate(replaceRouteId(routes.sourcesRemove.path, rowData.id)),
    ...(!hasWritePermissions ? disabledProps : { component: 'button' }),
  });

  actions.push({
    title: !rowData.paused_at
      ? intl.formatMessage({
          id: 'sources.edit',
          defaultMessage: 'Edit',
        })
      : intl.formatMessage({
          id: 'sources.viewDetails',
          defaultMessage: 'View details',
        }),
    onClick: () => navigate(replaceRouteId(routes.sourcesDetail.path, rowData.id)),
    ...(!hasWritePermissions ? disabledProps : { component: 'button' }),
  });

  return actions;
};

const SourcesTable = () => {
  const navigate = useAppNavigate();
  const intl = useIntl();

  const loaded = useIsLoaded();
  const writePermissions = useHasWritePermissions();
  const isOrgAdmin = useSelector(({ user }) => user.isOrgAdmin);

  const {
    appTypes,
    entities,
    sourceTypes,
    sourceTypesLoaded,
    appTypesLoaded,
    sortBy,
    sortDirection,
    numberOfEntities,
    removingSources,
    pageNumber,
    pageSize,
  } = useSelector(({ sources }) => sources, shallowEqual);
  const reduxDispatch = useDispatch();

  const onSetPage = (_e, page) => reduxDispatch(pageAndSize(page, pageSize));

  const onPerPageSelect = (_e, perPage) => reduxDispatch(pageAndSize(1, perPage));

  const notSortable = numberOfEntities === 0 || !loaded;

  const [state, dispatch] = useReducer(reducer, initialState(sourcesColumns(intl, notSortable)));

  const refreshColumns = () => {
    const columns = sourcesColumns(intl, notSortable);

    return dispatch({
      cells: prepareColumnsCells(columns),
    });
  };

  const refreshSources = () => {
    const columns = sourcesColumns(intl, notSortable);

    return dispatch({
      rows: renderSources(entities, columns, sourceTypes, appTypes, removingSources),
      cells: prepareColumnsCells(columns),
    });
  };

  useEffect(() => {
    if (loaded && sourceTypesLoaded && appTypesLoaded) {
      dispatch({ isLoaded: true });
      refreshSources();
    } else {
      dispatch({ isLoaded: false });
      refreshColumns();
    }
  }, [loaded, sourceTypesLoaded, appTypesLoaded]);

  useEffect(() => {
    if (state.isLoaded) {
      refreshSources();
    }
  }, [entities, removingSources]);

  const loading = !loaded || !appTypesLoaded || !sourceTypesLoaded;
  const empty = numberOfEntities === 0 && state.isLoaded;

  const dwColumns = useMemo(
    () =>
      sourcesColumns(intl, notSortable).map((column, index) => {
        if (column.sortable) {
          return {
            cell: column.title,
            ...(!loading && !empty
              ? {
                  props: {
                    'aria-label': column.value,
                    sort: {
                      columnIndex: index,
                      sortBy: {
                        index: state.cells.map((cell) => (cell.hidden ? 'hidden' : cell.value)).indexOf(sortBy),
                        direction: sortDirection,
                      },
                      onSort: (_event, _key, direction) => reduxDispatch(sortEntities(column.value, direction)),
                    },
                  },
                }
              : {
                  props: {
                    'aria-label': column.value,
                  },
                }),
          };
        }

        return column.title;
      }),
    [notSortable, sourcesColumns, sortEntities, loading, empty],
  );
  const dwRows = useMemo(
    () =>
      state.rows.map((row) =>
        row.cells
          .map(({ title }) => ({ cell: title }))
          .concat({
            cell: (
              <ActionsColumn
                items={actionResolver(intl, navigate, writePermissions, reduxDispatch, isOrgAdmin)(row)}
                isDisabled={row.disableActions}
              />
            ),
            props: {
              isActionCell: true,
            },
          }),
      ),
    [state.rows],
  );
  const activeState = useMemo(() => {
    if (loading) {
      return DataViewState.loading;
    }

    if (empty) {
      return DataViewState.empty;
    }

    return undefined;
  }, [loading, empty]);

  const maximumPageNumber = Math.ceil(numberOfEntities / pageSize);
  useEffect(() => {
    if (loaded && numberOfEntities > 0 && pageNumber > Math.max(maximumPageNumber, 1)) {
      onSetPage({}, maximumPageNumber);
    }
  }, [loaded, numberOfEntities, pageNumber, maximumPageNumber]);

  return (
    <DataView activeState={activeState}>
      <DataViewTable
        aria-label="List of Integrations"
        bodyStates={{
          [DataViewState.empty]: <EmptyStateDataView columns={dwColumns.length} />,
          [DataViewState.loading]: <DWPlaceHolderTable columns={dwColumns.length} />,
        }}
        columns={dwColumns}
        rows={dwRows}
      />
      <DataViewToolbar
        pagination={
          <Pagination
            isCompact
            perPageOptions={pageSize}
            itemCount={numberOfEntities}
            page={pageNumber}
            perPage={pageSize}
            onSetPage={onSetPage}
            onPerPageSelect={onPerPageSelect}
            variant="bottom"
            className="bottom-pagination"
            popp
          />
        }
      />
    </DataView>
  );
};

export default SourcesTable;
