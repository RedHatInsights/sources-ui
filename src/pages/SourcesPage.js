import React, { useEffect } from 'react';
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

export const afterSuccessLoadParameters = { pageNumber: 1, sortBy: 'created_at', sortDirection: 'desc' };

export const afterSuccess = (dispatch) => {
    dispatch(clearAddSource());
    dispatch(loadEntities(afterSuccessLoadParameters));
};

const SourcesPage = () => {
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
        Promise.all([dispatch(loadSourceTypes()), dispatch(loadAppTypes()), dispatch(loadEntities())]);
    }, []);

    const onSetPage = (number) => dispatch(pageAndSize(number, pageSize));

    const onPerPageSelect = (count) => dispatch(pageAndSize(1, count));

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
                            id: 'sources.name',
                            defaultMessage: 'name'
                        }),
                        filterValues: {
                            onChange: (_event, newSelection, _clickedGroup, _clickedItem) =>
                                dispatch(filterProviders(newSelection)),
                            value: filterValue
                        }
                    }]
                }}
            />
            <SourcesSimpleView />
            <PrimaryToolbar
                pagination={{
                    itemCount: numberOfEntities || 0,
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

    const noEntities = !numberOfEntities || numberOfEntities === 0;
    const displayEmptyState = loaded && !filterValue && noEntities;

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
