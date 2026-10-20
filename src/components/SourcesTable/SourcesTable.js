import React, { useEffect, useMemo, useReducer } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { ActionsColumn, sortable, wrappable } from '@patternfly/react-table';
import { defineMessages, useIntl } from 'react-intl';

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

const messages = defineMessages({
  actionsAria: {
    id: 'sourcesTable.actions',
    defaultMessage: 'Actions',
  },
  listOfIntegrationsAria: {
    id: 'sourcesTable.listOfIntegrationsAria',
    defaultMessage: 'List of Integrations',
  },

  sourcesResume: {
    id: 'sources.resume',
    defaultMessage: 'Resume',
  },
  sourcesResumeDescription: {
    id: 'sources.resume.description',
    defaultMessage: 'Unpause data collection for this integration',
  },
  sourcesPause: {
    id: 'sources.pause',
    defaultMessage: 'Pause',
  },
  sourcesPauseDescription: {
    id: 'sources.pause.description',
    defaultMessage: 'Temporarily disable data collection',
  },
  sourcesRemove: {
    id: 'sources.remove',
    defaultMessage: 'Remove',
  },
  sourcesRemoveDescription: {
    id: 'sources.remove.description',
    defaultMessage: 'Permanently delete this integration and all collected data',
  },
  sourcesEdit: {
    id: 'sources.edit',
    defaultMessage: 'Edit',
  },
  sourcesViewdetails: {
    id: 'sources.viewDetails',
    defaultMessage: 'View details',
  },
});

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
      title: intl.formatMessage(messages.sourcesResume),
      description: intl.formatMessage(messages.sourcesResumeDescription),
      onClick: () => dispatch(resumeSource(rowData.id, rowData.originalName, intl)),
      'aria-label': intl.formatMessage(messages.sourcesResume),
      ...(!hasWritePermissions ? disabledProps : { component: 'button' }),
    });
  } else {
    actions.push({
      title: intl.formatMessage(messages.sourcesPause),
      description: intl.formatMessage(messages.sourcesPauseDescription),
      'aria-label': intl.formatMessage(messages.sourcesPause),
      onClick: () => dispatch(pauseSource(rowData.id, rowData.originalName, intl)),
      ...(!hasWritePermissions ? disabledProps : { component: 'button' }),
    });
  }

  actions.push({
    title: intl.formatMessage(messages.sourcesRemove),
    description: intl.formatMessage(messages.sourcesRemoveDescription),
    onClick: () => navigate(replaceRouteId(routes.sourcesRemove.path, rowData.id)),
    'aria-label': intl.formatMessage(messages.sourcesRemove),
    ...(!hasWritePermissions ? disabledProps : { component: 'button' }),
  });

  actions.push({
    title: !rowData.paused_at ? intl.formatMessage(messages.sourcesEdit) : intl.formatMessage(messages.sourcesViewdetails),
    onClick: () => navigate(replaceRouteId(routes.sourcesDetail.path, rowData.id)),
    'aria-label': !rowData.paused_at ? intl.formatMessage(messages.sourcesEdit) : intl.formatMessage(messages.sourcesViewdetails),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pre-existing pattern, see i18n cleanup ticket
  }, [loaded, sourceTypesLoaded, appTypesLoaded]);

  useEffect(() => {
    if (state.isLoaded) {
      refreshSources();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pre-existing pattern, see i18n cleanup ticket
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pre-existing pattern, see i18n cleanup ticket
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pre-existing pattern, see i18n cleanup ticket
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pre-existing pattern, see i18n cleanup ticket
  }, [loaded, numberOfEntities, pageNumber, maximumPageNumber]);

  return (
    <DataView activeState={activeState}>
      <DataViewTable
        aria-label={intl.formatMessage(messages.listOfIntegrationsAria)}
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
