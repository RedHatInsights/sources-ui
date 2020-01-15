import React, { useEffect, useReducer } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Table, TableHeader, TableBody, sortable } from '@patternfly/react-table';
import { useIntl } from 'react-intl';

import { sortEntities } from '../../redux/actions/sources';
import { formatters } from './formatters';
import { PlaceHolderTable, RowWrapperLoader } from './loaders';
import { sourcesColumns, COLUMN_COUNT } from '../../views/sourcesViewDefinition';
import EmptyStateTable from './EmptyStateTable';

const itemToCells = (item, columns, sourceTypes, appTypes) => columns.filter(column => column.title || column.hidden)
.map(col => ({
    title: col.formatter ? formatters(col.formatter)(item[col.value], item, { sourceTypes, appTypes }) : item[col.value] || ''
}));

const renderSources = (entities, columns, sourceTypes, appTypes) =>
    entities.filter(({ hidden }) => !hidden).reduce((acc, item) => ([
        ...acc,
        {
            ...item,
            isOpen: !!item.expanded,
            cells: itemToCells(item, columns, sourceTypes, appTypes),
            disableActions: !!item.isDeleting
        }
    ]), []);

export const prepareColumnsCells = columns => columns.filter(column => column.title || column.hidden).map(column => ({
    title: column.title || '',
    value: column.value,
    ...(column.sortable && { transforms: [sortable] })
}));

const reducer = (state, payload) => ({ ...state, ...payload });

const initialState = (columns) => ({
    rows: [],
    sortBy: {},
    isLoaded: false,
    cells: prepareColumnsCells(columns)
});

export const insertEditAction = (actions, intl, push) => actions.splice(1, 0, {
    title: intl.formatMessage({
        id: 'sources.edit',
        defaultMessage: 'Edit'
    }),
    onClick: (_ev, _i, { id }) => push(`/edit/${id}`)
});

export const actionResolver = (intl, push) => (rowData) => {
    const actions = [{
        title: intl.formatMessage({
            id: 'sources.manageApps',
            defaultMessage: 'Manage applications'
        }),
        onClick: (_ev, _i, { id }) => push(`/manage_apps/${id}`)
    },
    {
        style: { color: 'var(--pf-global--danger-color--100)' },
        title: intl.formatMessage({
            id: 'sources.delete',
            defaultMessage: 'Delete'
        }),
        onClick: (_ev, _i, { id }) => push(`/remove/${id}`)
    }];

    const isSourceEditable = !rowData.imported;

    if (isSourceEditable) {
        insertEditAction(actions, intl, push);
    }

    return actions;
};

const SourcesSimpleView = () => {
    const { push } = useHistory();
    const intl = useIntl();

    const {
        loaded,
        appTypes,
        entities,
        sourceTypes,
        sourceTypesLoaded,
        appTypesLoaded,
        sortBy,
        sortDirection,
        numberOfEntities
    } = useSelector(({ sources }) => sources, shallowEqual);

    const reduxDispatch = useDispatch();

    const [state, dispatch] = useReducer(reducer, initialState(sourcesColumns(intl)));

    const refreshSources = () => {
        const notSortable = numberOfEntities === 0;
        const columns = sourcesColumns(intl, notSortable);

        return dispatch({
            rows: renderSources(entities, columns, sourceTypes, appTypes),
            cells: prepareColumnsCells(columns)
        });
    };

    useEffect(() => {
        if (loaded && sourceTypesLoaded && appTypesLoaded) {
            dispatch({ isLoaded: true });
            refreshSources();
        } else {
            dispatch({ isLoaded: false });
        }
    }, [loaded, sourceTypesLoaded, appTypesLoaded]);

    useEffect(() => {
        if (state.isLoaded) {
            refreshSources();
        }
    }, [entities]);

    if (!state.isLoaded) {
        return <PlaceHolderTable />;
    }

    let shownRows = state.rows;
    if (numberOfEntities === 0) {
        shownRows = [{
            heightAuto: true,
            cells: [{
                props: { colSpan: COLUMN_COUNT },
                title: <EmptyStateTable />
            }]
        }];
    }

    return (
        <Table
            gridBreakPoint='grid-lg'
            aria-label={intl.formatMessage({
                id: 'sources.list',
                defaultMessage: 'List of Sources'
            })}
            onSort={(_event, key, direction) => reduxDispatch(sortEntities(state.cells[key].value, direction))}
            sortBy={{
                index: state.cells.map(cell => cell.value).indexOf(sortBy),
                direction: sortDirection
            }}
            rows={shownRows}
            cells={state.cells}
            actionResolver={numberOfEntities > 0 ? actionResolver(intl, push) : undefined}
            rowWrapper={RowWrapperLoader}
        >
            <TableHeader />
            <TableBody />
        </Table>
    );
};

export default SourcesSimpleView;
