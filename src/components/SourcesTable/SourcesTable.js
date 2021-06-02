import React, { useEffect, useReducer } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Table, TableHeader, TableBody, sortable, wrappable } from '@patternfly/react-table';
import { useIntl } from 'react-intl';

import { pauseSource, resumeSource, sortEntities } from '../../redux/sources/actions';
import { PlaceHolderTable, RowWrapperLoader } from './loaders';
import { sourcesColumns, COLUMN_COUNT } from '../../views/sourcesViewDefinition';
import EmptyStateTable from './EmptyStateTable';
import { useIsLoaded } from '../../hooks/useIsLoaded';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import { replaceRouteId, routes } from '../../Routes';

const itemToCells = (item, columns, sourceTypes, appTypes) =>
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
    }));

const reducer = (state, payload) => ({ ...state, ...payload });

const initialState = (columns) => ({
  rows: [],
  sortBy: {},
  isLoaded: false,
  cells: prepareColumnsCells(columns),
});

export const actionResolver = (intl, push, isOrgAdmin, dispatch) => (rowData) => {
  const tooltip = intl.formatMessage({
    id: 'sources.notAdminButton',
    defaultMessage: 'To perform this action, you must be granted write permissions from your Organization Administrator.',
  });

  const disabledProps = {
    tooltip,
    isDisabled: true,
    className: 'ins-c-sources__disabled-drodpown-item',
  };

  const actions = [];

  if (rowData.paused_at) {
    actions.push({
      title: intl.formatMessage({
        id: 'sources.resume',
        defaultMessage: 'Resume',
      }),
      description: intl.formatMessage({
        id: 'sources.resume.description',
        defaultMessage: 'Unpause data collection for this source',
      }),
      onClick: (_ev, _i, { id }) => dispatch(resumeSource(id, rowData.originalName, intl)),
      ...(!isOrgAdmin ? disabledProps : { component: 'button' }),
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
      onClick: (_ev, _i, { id }) => dispatch(pauseSource(id, rowData.originalName, intl)),
      ...(!isOrgAdmin ? disabledProps : { component: 'button' }),
    });
  }

  actions.push({
    title: intl.formatMessage({
      id: 'sources.remove',
      defaultMessage: 'Remove',
    }),
    description: intl.formatMessage({
      id: 'sources.remove.description',
      defaultMessage: 'Permanently delete this source and all collected data',
    }),
    onClick: (_ev, _i, { id }) => push(replaceRouteId(routes.sourcesRemove.path, id)),
    ...(!isOrgAdmin ? disabledProps : { component: 'button' }),
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
    onClick: (_ev, _i, { id }) => push(replaceRouteId(routes.sourcesDetail.path, id)),
    ...(!isOrgAdmin ? disabledProps : { component: 'button' }),
  });

  return actions;
};

const SourcesTable = () => {
  const { push } = useHistory();
  const intl = useIntl();

  const loaded = useIsLoaded();
  const writePermissions = useHasWritePermissions();

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
  } = useSelector(({ sources }) => sources, shallowEqual);
  const reduxDispatch = useDispatch();

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

  let shownRows = state.rows;
  if (numberOfEntities === 0 && state.isLoaded) {
    shownRows = [
      {
        heightAuto: true,
        cells: [
          {
            props: { colSpan: COLUMN_COUNT },
            title: <EmptyStateTable />,
          },
        ],
      },
    ];
  } else if (!loaded || !appTypesLoaded || !sourceTypesLoaded) {
    shownRows = [
      {
        heightAuto: true,
        cells: [
          {
            props: {
              colSpan: COLUMN_COUNT,
              className: 'sources-placeholder-row',
            },
            title: <PlaceHolderTable />,
          },
        ],
      },
    ];
  }

  return (
    <Table
      gridBreakPoint="grid-lg"
      aria-label={intl.formatMessage({
        id: 'sources.list',
        defaultMessage: 'List of Sources',
      })}
      onSort={(_event, key, direction) => reduxDispatch(sortEntities(state.cells[key].value, direction))}
      sortBy={{
        index: state.cells.map((cell) => (cell.hidden ? 'hidden' : cell.value)).indexOf(sortBy),
        direction: sortDirection,
      }}
      rows={shownRows}
      cells={state.cells}
      actionResolver={loaded && numberOfEntities > 0 ? actionResolver(intl, push, writePermissions, reduxDispatch) : undefined}
      rowWrapper={RowWrapperLoader}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

export default SourcesTable;
