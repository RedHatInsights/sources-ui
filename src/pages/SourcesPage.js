import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, withRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TableToolbar, PageHeader, PageHeaderTitle, Pagination, Section } from '@redhat-cloud-services/frontend-components';
import {
    loadAppTypes,
    loadEntities,
    loadSourceTypes,
    clearAddSource
} from '../redux/actions/providers';
import { Button } from '@patternfly/react-core';
import { SplitItem, Split } from '@patternfly/react-core';
import { FormattedMessage, useIntl } from 'react-intl';
import { AddSourceWizard } from '@redhat-cloud-services/frontend-components-sources';

import SourcesSimpleView from '../components/SourcesSimpleView/SourcesSimpleView';
import SourcesFilter from '../components/SourcesFilter';
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

const SourcesPage = ({
    history,
    match,
    location
}) => {
    const intl = useIntl();

    const filterValue = useSelector(({ providers }) => providers.filterValue);
    const loaded = useSelector(({ providers }) => providers.loaded);
    const numberOfEntities = useSelector(({ providers }) => providers.numberOfEntities);
    const appTypes = useSelector(({ providers }) => providers.appTypes);
    const entities = useSelector(({ providers }) => providers.entities);
    const pageSize = useSelector(({ providers }) => providers.pageSize);
    const pageNumber = useSelector(({ providers }) => providers.pageNumber);
    const fetchingError = useSelector(({ providers }) => providers.fetchingError);
    const addSourceInitialValues = useSelector(({ providers }) => providers.addSourceInitialValues);
    const sortBy = useSelector(({ providers }) => providers.sortBy);
    const sortDirection = useSelector(({ providers }) => providers.sortDirection);
    const filterColumn = useSelector(({ providers }) => providers.filterColumn);
    const sourceTypes = useSelector(({ providers }) => providers.sourceTypes);

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

    const maximumPageNumber = (numberOfFilteredEntities / pageSize) + 1;
    const currentPage = pageNumber > maximumPageNumber ? maximumPageNumber : pageNumber;

    const mainContent = () => (
        <React.Fragment>
            <TableToolbar xresults={numberOfFilteredEntities}>
                <Split gutter="md" style={{ flexGrow: 1 }}>
                    <SplitItem>
                        <SourcesFilter />
                    </SplitItem>
                    <SplitItem>
                        <Link to={paths.sourcesNew}>
                            <Button variant='primary'>
                                <FormattedMessage
                                    id="sources.addSource"
                                    defaultMessage="Add a source"
                                />
                            </Button>
                        </Link>
                    </SplitItem>
                    <SplitItem style={{ flexGrow: 1 }}>
                        <Pagination
                            itemsPerPage={pageSize}
                            page={currentPage}
                            direction='down'
                            onSetPage={onSetPage}
                            onPerPageSelect={onPerPageSelect}
                            numberOfItems={numberOfFilteredEntities || 0}
                        />
                    </SplitItem>
                </Split>
            </TableToolbar>
            <SourcesSimpleView />
            <TableToolbar>
                <Pagination
                    itemsPerPage={pageSize}
                    page={currentPage}
                    direction='up'
                    onSetPage={onSetPage}
                    onPerPageSelect={onPerPageSelect}
                    numberOfItems={numberOfFilteredEntities || 0}
                />
            </TableToolbar>
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

SourcesPage.propTypes = {
    location: PropTypes.any.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.any.isRequired
};

export default withRouter(SourcesPage);
