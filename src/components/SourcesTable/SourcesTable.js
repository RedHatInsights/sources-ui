import React, { useEffect, useReducer } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { sortable, wrappable } from '@patternfly/react-table';
import { Table, TableBody, TableHeader } from '@patternfly/react-table/deprecated';
import { useIntl } from 'react-intl';

import { sortEntities } from '../../redux/sources/actions';
import { PlaceHolderTable, RowWrapperLoader } from './loaders';
import { COLUMN_COUNT, sourcesColumns } from '../../views/sourcesViewDefinition';
import EmptyStateTable from './EmptyStateTable';
import { useIsLoaded } from '../../hooks/useIsLoaded';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import './sourcesTable.scss';
import { actionResolver } from '../../utilities/utils';

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
        defaultMessage: 'List of Integrations',
      })}
      onSort={(_event, key, direction) => reduxDispatch(sortEntities(state.cells[key].value, direction))}
      sortBy={{
        index: state.cells.map((cell) => (cell.hidden ? 'hidden' : cell.value)).indexOf(sortBy),
        direction: sortDirection,
      }}
      key={state.key}
      rows={shownRows}
      cells={state.cells}
      actionResolver={
        loaded && numberOfEntities > 0 ? actionResolver(intl, navigate, writePermissions, reduxDispatch, isOrgAdmin) : undefined
      }
      rowWrapper={RowWrapperLoader}
      className={numberOfEntities === 0 && state.isLoaded ? 'ins-c-table-empty-state' : ''}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

export default SourcesTable;
