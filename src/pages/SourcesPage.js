import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';
import { Link, useHistory, Route } from 'react-router-dom';
import {
    loadAppTypes,
    loadEntities,
    loadSourceTypes,
    clearAddSource,
    filterProviders
} from '../redux/actions/providers';
import { Button } from '@patternfly/react-core';
import { FormattedMessage, useIntl } from 'react-intl';
import { AddSourceWizard } from '@redhat-cloud-services/frontend-components-sources';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import awesomeDebounce from 'awesome-debounce-promise';

import SourcesSimpleView from '../components/SourcesSimpleView/SourcesSimpleView';
import SourcesEmptyState from '../components/SourcesEmptyState';
import SourceEditModal from '../components/SourceEditForm/SourceEditModal';
import SourceRemoveModal from '../components/SourceRemoveModal';
import AddApplication from '../components/AddApplication/AddApplication';
import { pageAndSize, addMessage } from '../redux/actions/providers';
import { paths } from '../Routes';
import UndoButtonAdd from '../components/UndoButton/UndoButtonAdd';
import isEmpty from 'lodash/isEmpty';

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
    history.push('/');
};

export const debouncedFiltering = awesomeDebounce((refresh) => refresh(), 500);

export const afterSuccessLoadParameters = { pageNumber: 1, sortBy: 'created_at', sortDirection: 'desc' };

export const afterSuccess = (dispatch) => {
    dispatch(clearAddSource());
    dispatch(loadEntities(afterSuccessLoadParameters));
};

export const prepareSourceTypeSelection = (sourceTypes) =>
    sourceTypes.map(({ id, product_name }) => ({ label: product_name, value: id }));

export const setFilter = (column, value, dispatch) => dispatch(filterProviders({
    [column]: value
}));

const SourcesPage = () => {
    const [showEmptyState, setShowEmptyState] = useState(false);
    const [checkEmptyState, setCheckEmptyState] = useState(false);
    const history = useHistory();
    const intl = useIntl();

    const {
        filterValue,
        loaded,
        numberOfEntities,
        appTypes,
        pageSize,
        pageNumber,
        fetchingError,
        addSourceInitialValues,
        sourceTypes,
        entities
    } = useSelector(({ providers }) => providers, shallowEqual);

    const dispatch = useDispatch();

    useEffect(() => {
        Promise.all([dispatch(loadSourceTypes()), dispatch(loadAppTypes()), dispatch(loadEntities())])
        .then(() => setCheckEmptyState(true));
    }, []);

    useEffect(() => {
        if (checkEmptyState) {
            setShowEmptyState(entities.length === 0);
        }
    }, [checkEmptyState]);

    const onSetPage = (_e, page) => dispatch(pageAndSize(page, pageSize));

    const onPerPageSelect = (_e, perPage) => dispatch(pageAndSize(1, perPage));

    const maximumPageNumber = Math.ceil(numberOfEntities / pageSize);

    if (entities.length > 0 && loaded && pageNumber > Math.max(maximumPageNumber, 1)) {
        onSetPage(maximumPageNumber > 0 ? maximumPageNumber : 1);
    }

    const mainContent = () => (
        <React.Fragment>
            <PrimaryToolbar
                pagination={{
                    itemCount: numberOfEntities || 0,
                    page: pageNumber,
                    perPage: pageSize,
                    onSetPage,
                    onPerPageSelect,
                    isCompact: false
                }}
                actionsConfig={{
                    actions: [
                        <Link to={paths.sourcesNew} key="addSourceButton">
                            <Button variant='primary'>
                                <FormattedMessage
                                    id="sources.addSource"
                                    defaultMessage="Add a source"
                                />
                            </Button>
                        </Link>
                    ]
                } }
                filterConfig={{
                    items: [{
                        label: intl.formatMessage({
                            id: 'sources.name',
                            defaultMessage: 'Name'
                        }),
                        filterValues: {
                            onChange: (_event, value) => {
                                setFilter('name', value, dispatch);
                                debouncedFiltering(() => dispatch(loadEntities()));
                            },
                            value: filterValue.name
                        }
                    }, {
                        label: intl.formatMessage({
                            id: 'sources.type',
                            defaultMessage: 'Type'
                        }),
                        type: 'checkbox',
                        filterValues: {
                            onChange: (_event, value) => {
                                setFilter('source_type_id', value, dispatch);
                                dispatch(loadEntities());
                            },
                            items: prepareSourceTypeSelection(sourceTypes || []),
                            value: filterValue.source_type_id
                        }
                    }]
                }}
                activeFiltersConfig={{
                    filters: [],
                    onDelete: console.log
                }}
            />
            <SourcesSimpleView />
            <PrimaryToolbar
                pagination={{
                    itemCount: numberOfEntities || 0,
                    page: pageNumber,
                    perPage: pageSize,
                    onSetPage,
                    onPerPageSelect,
                    isCompact: false,
                    dropDirection: 'up',
                    variant: 'bottom'
                }}
            />
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <Route exact path={paths.sourceManageApps} component={ AddApplication } />
            <Route exact path={paths.sourcesRemove} component={ SourceRemoveModal } />
            <Route exact path={paths.sourcesNew} render={ () => (<AddSourceWizard
                sourceTypes={sourceTypes}
                applicationTypes={appTypes}
                isOpen={true}
                onClose={(values) => onCloseAddSourceWizard({ values, dispatch, history, intl })}
                afterSuccess={() => afterSuccess(dispatch)}
                hideSourcesButton={true}
                initialValues={addSourceInitialValues}
            />) } />
            <Route exact path={paths.sourcesEdit} component={ SourceEditModal } />
            <PageHeader>
                <PageHeaderTitle title={intl.formatMessage({
                    id: 'sources.sources',
                    defaultMessage: 'Sources'
                })}/>
            </PageHeader>
            <Section type='content'>
                { (showEmptyState || fetchingError) ?
                    <SourcesEmptyState
                        title={fetchingError ? fetchingError.title : undefined}
                        body={fetchingError ? fetchingError.detail : undefined}
                    />
                    :
                    mainContent()}
            </Section>
        </React.Fragment>
    );
};

export default SourcesPage;
