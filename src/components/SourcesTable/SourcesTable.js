import React, { useEffect, useReducer } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Table, TableHeader, TableBody, sortable } from '@patternfly/react-table';
import { useIntl } from 'react-intl';

import { sortEntities } from '../../redux/sources/actions';
import { formatters } from './formatters';
import { PlaceHolderTable, RowWrapperLoader } from './loaders';
import { sourcesColumns, COLUMN_COUNT } from '../../views/sourcesViewDefinition';
import EmptyStateTable from './EmptyStateTable';
import { useIsLoaded } from '../../hooks/useIsLoaded';
import { useIsOrgAdmin } from '../../hooks/useIsOrgAdmin';
import { replaceRouteId, routes } from '../../Routes';

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
    hidden: column.hidden,
    ...(column.sortable && { transforms: [sortable] })
}));

const reducer = (state, payload) => ({ ...state, ...payload });

const initialState = (columns) => ({
    rows: [],
    sortBy: {},
    isLoaded: false,
    cells: prepareColumnsCells(columns)
});

export const insertEditAction = (actions, intl, push, isOrgAdmin, tooltip) => actions.splice(1, 0, {
    title: intl.formatMessage({
        id: 'sources.edit',
        defaultMessage: 'Edit'
    }),
    onClick: (_ev, _i, { id }) => push(replaceRouteId(routes.sourcesEdit.path, id)),
    component: 'button',
    ...(!isOrgAdmin && { tooltip, isDisabled: true }),
});

export const actionResolver = (intl, push, isOrgAdmin) => (rowData) => {
    const tooltip = intl.formatMessage({
        id: 'sources.notAdminButton',
        defaultMessage: 'You do not have permission to perform this action.'
    });

    const actions = [{
        title: intl.formatMessage({
            id: 'sources.manageApps',
            defaultMessage: 'Manage applications'
        }),
        onClick: (_ev, _i, { id }) => push(replaceRouteId(routes.sourceManageApps.path, id)),
        component: 'button',
        ...(!isOrgAdmin && { tooltip, isDisabled: true }),
    },
    {
        title: intl.formatMessage({
            id: 'sources.delete',
            defaultMessage: 'Delete'
        }),
        onClick: (_ev, _i, { id }) => push(replaceRouteId(routes.sourcesRemove.path, id)),
        component: 'button',
        ...(!isOrgAdmin && { tooltip, isDisabled: true }),
    }];

    const isSourceEditable = !rowData.imported;

    if (isSourceEditable) {
        insertEditAction(actions, intl, push, isOrgAdmin, tooltip);
    }

    return actions;
};

const SourcesTable = () => {
    const { push } = useHistory();
    const intl = useIntl();

    const loaded = useIsLoaded();
    const isOrgAdmin = useIsOrgAdmin();

    const {
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

    const notSortable = numberOfEntities === 0 || !loaded;

    const [state, dispatch] = useReducer(reducer, initialState(sourcesColumns(intl, notSortable)));

    const refreshColumns = () => {
        const columns = sourcesColumns(intl, notSortable);

        return dispatch({
            cells: prepareColumnsCells(columns)
        });
    };

    const refreshSources = () => {
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
            refreshColumns();
        }
    }, [loaded, sourceTypesLoaded, appTypesLoaded]);

    useEffect(() => {
        if (state.isLoaded) {
            refreshSources();
        }
    }, [entities]);

    let shownRows = state.rows;
    if (numberOfEntities === 0 && state.isLoaded) {
        shownRows = [{
            heightAuto: true,
            cells: [{
                props: { colSpan: COLUMN_COUNT },
                title: <EmptyStateTable />
            }]
        }];
    } else if (!loaded || !appTypesLoaded || !sourceTypesLoaded) {
        shownRows = [{
            heightAuto: true,
            cells: [{
                props: { colSpan: COLUMN_COUNT, className: 'sources-placeholder-row' },
                title: <PlaceHolderTable />
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
                index: state.cells.map(cell => cell.hidden ? 'hidden' : cell.value).indexOf(sortBy),
                direction: sortDirection
            }}
            rows={shownRows}
            cells={state.cells}
            actionResolver={loaded && numberOfEntities > 0 ? actionResolver(intl, push, isOrgAdmin) : undefined}
            rowWrapper={RowWrapperLoader}
        >
            <TableHeader />
            <TableBody />
        </Table>
    );
};

export default SourcesTable;
