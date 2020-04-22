import React from 'react';
import { FormattedMessage } from 'react-intl';
import awesomeDebounce from 'awesome-debounce-promise';
import isEmpty from 'lodash/isEmpty';

import {
    loadEntities,
    clearAddSource,
    filterSources,
    addMessage
} from '../../redux/sources/actions';
import UndoButtonAdd from '../../components/UndoButton/UndoButtonAdd';
import { routes } from '../../Routes';
import { checkSourceStatus } from '../../api/checkSourceStatus';

export const onCloseAddSourceWizard = ({ values, dispatch, history, intl }) => {
    if (values && !isEmpty(values)) {
        const messageId = Date.now();
        dispatch(addMessage(
            intl.formatMessage({
                id: 'sources.addWizardCanceled',
                defaultMessage: 'Adding a source was cancelled'
            }),
            'success',
            <FormattedMessage
                id="sources.undoMistake"
                defaultMessage={ `{undo} if this was a mistake.` }
                values={ { undo: <UndoButtonAdd messageId={messageId} values={values} /> } }
            />,
            messageId
        ));
    }

    dispatch(clearAddSource());
    history.push(routes.sources.path);
};

export const debouncedFiltering = awesomeDebounce((refresh) => refresh(), 500);

export const afterSuccessLoadParameters = { pageNumber: 1, sortBy: 'created_at', sortDirection: 'desc' };

export const afterSuccess = (dispatch, source) => {
    checkSourceStatus(source.id);
    dispatch(clearAddSource());
    dispatch(loadEntities(afterSuccessLoadParameters));
};

export const prepareSourceTypeSelection = (sourceTypes) =>
    sourceTypes.map(({ id, product_name }) => ({ label: product_name, value: id }))
    .sort((a, b) => a.label.localeCompare(b.label));

export const prepareApplicationTypeSelection = (appTypes) =>
    appTypes.map(({ id, display_name }) => ({ label: display_name, value: id }))
    .sort((a, b) => a.label.localeCompare(b.label));

export const setFilter = (column, value, dispatch) => dispatch(filterSources({
    [column]: value
}));

export const chipsFormatters = (key, filterValue, sourceTypes, appTypes) => ({
    name: () => ({ name: filterValue[key], key }),
    source_type_id: () => ({
        category: 'Source Type',
        key,
        chips: filterValue[key].map(id => {
            const sourceType = sourceTypes.find((type) => type.id === id);

            return ({ name: sourceType ? sourceType.product_name : id, value: id });
        })
    }),
    applications: () => ({
        category: 'Application',
        key,
        chips: filterValue[key].map(id => {
            const appType = appTypes.find((type) => type.id === id);

            return ({ name: appType ? appType.display_name : id, value: id });
        })
    })
}[key] || (() => ({ name: key })));

export const prepareChips = (filterValue, sourceTypes, appTypes) =>
    Object.keys(filterValue)
    .map((key) =>
        filterValue[key] && filterValue[key].length > 0 ? chipsFormatters(key, filterValue, sourceTypes, appTypes)() : undefined
    )
    .filter(Boolean);

export const removeChips = (chips, filterValue, deleteAll) => {
    if (deleteAll) {
        return (
            Object.keys(filterValue).reduce((acc, curr) => ({
                ...acc,
                [curr]: undefined
            }), {})
        );
    }

    const chip = chips[0];

    return ({
        ...filterValue,
        [chip.key]: chip.chips ? filterValue[chip.key].filter((value) => value !== chip.chips[0].value) : undefined
    });
};

export const loadedTypes = (types, loaded) => loaded && types.length > 0 ? types : undefined;
