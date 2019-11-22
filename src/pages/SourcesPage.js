import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';
import { Link, useHistory, useRouteMatch, useLocation, Route } from 'react-router-dom';
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

import SourcesSimpleView from '../components/SourcesSimpleView/SourcesSimpleView';
import SourcesEmptyState from '../components/SourcesEmptyState';
import SourceEditModal from '../components/SourceEditForm/SourceEditModal';
import SourceRemoveModal from '../components/SourceRemoveModal';
import AddApplication from '../components/AddApplication/AddApplication';
import { pageAndSize, addMessage } from '../redux/actions/providers';
import { paths } from '../Routes';
import { prepareEntities } from '../Utilities/filteringSorting';
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

export const afterSuccessLoadParameters = { pageNumber: 1, sortBy: 'created_at', sortDirection: 'desc' };

export const afterSuccess = (dispatch) => {
    dispatch(clearAddSource());
    dispatch(loadEntities(afterSuccessLoadParameters));
};

const SourcesPage = () => {
    const history = useHistory();
    const match = useRouteMatch();
    const location = useLocation();
    const intl = useIntl();

    const {
        filterValue,
        loaded,
        numberOfEntities,
        appTypes,
        entities,
        pageSize,
        pageNumber,
        fetchingError,
        addSourceInitialValues,
        sortBy,
        sortDirection,
        filterColumn,
        sourceTypes
    } = useSelector(({ providers }) => providers, shallowEqual);

    const dispatch = useDispatch();

    useEffect(() => {
        Promise.all([dispatch(loadSourceTypes()), dispatch(loadAppTypes()), dispatch(loadEntities())]);
    }, []);

    const onSetPage = (number) => dispatch(pageAndSize(number, pageSize));

    const onPerPageSelect = (count) => dispatch(pageAndSize(1, count));

    const numberOfFilteredEntities = (
        filterValue && filterValue !== '' ?
            prepareEntities(
                entities,
                { sourceTypes, sortBy, sortDirection, filterColumn, filterValue, pageSize, pageNumber }
            ).length
            : numberOfEntities
    );

    const maximumPageNumber = Math.ceil(numberOfFilteredEntities / pageSize);

    if (loaded && pageNumber > maximumPageNumber) {
        onSetPage(maximumPageNumber);
    }

    const mainContent = () => (
        <React.Fragment>
            <PrimaryToolbar
                pagination={{
                    itemCount: numberOfFilteredEntities || 0,
                    page: pageNumber,
                    perPage: pageSize,
                    onSetPage: (_e, page) => onSetPage(page),
                    onPerPageSelect: (_e, perPage) => onPerPageSelect(perPage),
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
                            id: 'sources.filterBySourceName',
                            defaultMessage: 'name'
                        }),
                        value: filterValue,
                        filterValues: {
                            onChange: (_event, newSelection, _clickedGroup, _clickedItem) =>
                                dispatch(filterProviders(newSelection))
                        }
                    }]
                }}
            />
            <SourcesSimpleView />
            <PrimaryToolbar
                pagination={{
                    itemCount: numberOfFilteredEntities || 0,
                    page: pageNumber,
                    perPage: pageSize,
                    onSetPage: (_e, page) => onSetPage(page),
                    onPerPageSelect: (_e, perPage) => onPerPageSelect(perPage),
                    isCompact: false,
                    dropDirection: 'up',
                    variant: 'bottom'
                }}
            />
        </React.Fragment>
    );

    const noEntities = !numberOfFilteredEntities || numberOfFilteredEntities === 0;
    const displayEmptyState = loaded && !filterValue && noEntities;

    const editorNew = location.pathname === paths.sourcesNew;
    const editorEdit = match.path === paths.sourcesEdit;

    return (
        <React.Fragment>
            <Route exact path={paths.sourceManageApps} component={ AddApplication } />
            <Route exact path={paths.sourcesRemove} component={ SourceRemoveModal } />
            { editorNew && <AddSourceWizard
                sourceTypes={sourceTypes}
                applicationTypes={appTypes}
                isOpen={true}
                onClose={(values) => onCloseAddSourceWizard({ values, dispatch, history, intl })}
                afterSuccess={() => afterSuccess(dispatch)}
                hideSourcesButton={true}
                initialValues={addSourceInitialValues}
            />}
            { editorEdit && <SourceEditModal />}
            <PageHeader>
                <PageHeaderTitle title={intl.formatMessage({
                    id: 'sources.sources',
                    defaultMessage: 'Sources'
                })}/>
            </PageHeader>
            <Section type='content'>
                { (displayEmptyState || fetchingError) ?
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
