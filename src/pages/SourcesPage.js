import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';
import { Link, useHistory } from 'react-router-dom';
import {
    loadAppTypes,
    loadEntities,
    loadSourceTypes,
    filterSources
} from '../redux/sources/actions';
import { Button } from '@patternfly/react-core';
import { FormattedMessage, useIntl } from 'react-intl';
import { AddSourceWizard } from '@redhat-cloud-services/frontend-components-sources';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';

import SourcesSimpleView from '../components/SourcesSimpleView/SourcesSimpleView';
import SourcesEmptyState from '../components/SourcesEmptyState';
import SourceEditModal from '../components/SourceEditForm/SourceEditModal';
import SourceRemoveModal from '../components/SourceRemoveModal';
import AddApplication from '../components/AddApplication/AddApplication';
import { pageAndSize } from '../redux/sources/actions';
import { routes } from '../Routes';

import {
    prepareChips,
    removeChips,
    setFilter,
    debouncedFiltering,
    prepareSourceTypeSelection,
    afterSuccess,
    onCloseAddSourceWizard,
    loadedTypes
} from './SourcesPage/helpers';
import PaginationLoader from './SourcesPage/PaginationLoader';
import { useIsLoaded } from '../hooks/useIsLoaded';
import { useIsOrgAdmin } from '../hooks/useIsOrgAdmin';
import CustomRoute from '../components/CustomRoute/CustomRoute';

const SourcesPage = () => {
    const [showEmptyState, setShowEmptyState] = useState(false);
    const [checkEmptyState, setCheckEmptyState] = useState(false);
    const [filter, setFilterValue] = useState();

    const loaded = useIsLoaded();
    const isOrgAdmin = useIsOrgAdmin();

    const history = useHistory();
    const intl = useIntl();

    const {
        filterValue,
        numberOfEntities,
        appTypes,
        pageSize,
        pageNumber,
        fetchingError,
        addSourceInitialValues,
        sourceTypes,
        entities,
        paginationClicked,
        appTypesLoaded,
        sourceTypesLoaded
    } = useSelector(({ sources }) => sources, shallowEqual);

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

    useEffect(() => {
        if (filter !== filterValue.name) {
            setFilterValue(filterValue.name);
        }
    }, [filterValue.name]);

    const onSetPage = (_e, page) => dispatch(pageAndSize(page, pageSize));

    const onPerPageSelect = (_e, perPage) => dispatch(pageAndSize(1, perPage));

    const maximumPageNumber = Math.ceil(numberOfEntities / pageSize);

    if (entities.length > 0 && loaded && pageNumber > Math.max(maximumPageNumber, 1)) {
        onSetPage(maximumPageNumber);
    }

    const paginationConfig = {
        itemCount: numberOfEntities,
        page: pageNumber,
        perPage: pageSize,
        onSetPage,
        onPerPageSelect,
        isCompact: false
    };

    const paginationConfigBottom = {
        ...paginationConfig,
        dropDirection: 'up',
        variant: 'bottom'
    };

    const showPaginationLoader = (!loaded || !appTypesLoaded || !sourceTypesLoaded) && !paginationClicked;

    const mainContent = () => (
        <React.Fragment>
            <PrimaryToolbar
                pagination={showPaginationLoader ? <PaginationLoader /> : numberOfEntities > 0 ? paginationConfig : undefined}
                actionsConfig={isOrgAdmin ? {
                    actions: [
                        <Link to={routes.sourcesNew.path} key="addSourceButton">
                            <Button variant='primary'>
                                <FormattedMessage
                                    id="sources.addSource"
                                    defaultMessage="Add a source"
                                />
                            </Button>
                        </Link>
                    ]
                } : undefined}
                filterConfig={{
                    items: [{
                        label: intl.formatMessage({
                            id: 'sources.name',
                            defaultMessage: 'Name'
                        }),
                        filterValues: {
                            'aria-label': intl.formatMessage({
                                id: 'sources.filterByName',
                                defaultMessage: 'Filter by name'
                            }),
                            onChange: (_event, value) => {
                                setFilterValue(value);
                                debouncedFiltering(() => setFilter('name', value, dispatch));
                            },
                            value: filter
                        }
                    }, {
                        label: intl.formatMessage({
                            id: 'sources.type',
                            defaultMessage: 'Type'
                        }),
                        type: 'checkbox',
                        filterValues: {
                            onChange: (_event, value) =>
                                setFilter('source_type_id', value, dispatch),
                            items: prepareSourceTypeSelection(sourceTypes || []),
                            value: filterValue.source_type_id
                        }
                    }]
                }}
                activeFiltersConfig={{
                    filters: prepareChips(filterValue, sourceTypes),
                    onDelete: (_event, chips, deleteAll) =>
                        dispatch(filterSources(removeChips(chips, filterValue, deleteAll)))
                }}
            />
            <SourcesSimpleView />
            <PrimaryToolbar
                pagination={
                    showPaginationLoader ? <PaginationLoader />
                        : numberOfEntities > 0 ? paginationConfigBottom : undefined
                }
            />
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <CustomRoute exact route={routes.sourceManageApps} Component={AddApplication}/>
            <CustomRoute exact route={routes.sourcesRemove} Component={SourceRemoveModal}/>
            <CustomRoute
                exact
                route={routes.sourcesNew}
                Component={AddSourceWizard}
                componentProps={{
                    sourceTypes: loadedTypes(sourceTypes, sourceTypesLoaded),
                    applicationTypes: loadedTypes(appTypes, appTypesLoaded),
                    isOpen: true,
                    onClose: (values) => onCloseAddSourceWizard({ values, dispatch, history, intl }),
                    afterSuccess: () => afterSuccess(dispatch),
                    hideSourcesButton: true,
                    initialValues: addSourceInitialValues
                }}
            />
            <CustomRoute exact route={routes.sourcesEdit} Component={SourceEditModal}/>
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
