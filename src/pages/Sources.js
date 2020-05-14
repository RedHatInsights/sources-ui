import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
    loadAppTypes,
    loadEntities,
    loadSourceTypes,
    filterSources
} from '../redux/sources/actions';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { FormattedMessage, useIntl } from 'react-intl';

import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/components/PrimaryToolbar';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/components/PageHeader';
import { Section } from '@redhat-cloud-services/frontend-components/components/Section';

import SourcesTable from '../components/SourcesTable/SourcesTable';
import SourcesEmptyState from '../components/SourcesEmptyState';
import { pageAndSize } from '../redux/sources/actions';
import { routes } from '../Routes';

const SourceEditModal = lazy(() => import(/* webpackChunkName: "edit" */ '../components/SourceEditForm/SourceEditModal'));
const SourceRemoveModal = lazy(() => import(/* webpackChunkName: "remove" */
    '../components/SourceRemoveModal/SourceRemoveModal'
));
const AddApplication = lazy(() => import(/* webpackChunkName: "addApp" */ '../components/AddApplication/AddApplication'));
const AddSourceWizard = lazy(() => import(
    /* webpackChunkName: "addSource" */ '@redhat-cloud-services/frontend-components-sources'
).then(module => ({ default: module.AddSourceWizard })));

import {
    prepareChips,
    removeChips,
    setFilter,
    debouncedFiltering,
    prepareSourceTypeSelection,
    afterSuccess,
    loadedTypes,
    prepareApplicationTypeSelection
} from './Sources/helpers';
import PaginationLoader from './Sources/PaginationLoader';
import { useIsLoaded } from '../hooks/useIsLoaded';
import { useIsOrgAdmin } from '../hooks/useIsOrgAdmin';
import CustomRoute from '../components/CustomRoute/CustomRoute';
import { updateQuery, parseQuery } from '../utilities/urlQuery';
import { Tooltip } from '@patternfly/react-core/dist/js/components/Tooltip/Tooltip';

const SourcesPage = () => {
    const [showEmptyState, setShowEmptyState] = useState(false);
    const [checkEmptyState, setCheckEmptyState] = useState(false);
    const [filter, setFilterValue] = useState();

    const loaded = useIsLoaded();
    const isOrgAdmin = useIsOrgAdmin();

    const history = useHistory();
    const location = useLocation();
    const intl = useIntl();

    const sources = useSelector(({ sources }) => sources, shallowEqual);

    const {
        filterValue,
        numberOfEntities,
        appTypes,
        pageSize,
        pageNumber,
        fetchingError,
        sourceTypes,
        paginationClicked,
        appTypesLoaded,
        sourceTypesLoaded
    } = sources;

    const dispatch = useDispatch();

    useEffect(() => {
        Promise.all([dispatch(loadSourceTypes()), dispatch(loadAppTypes()), dispatch(loadEntities(parseQuery()))])
        .then(() => setCheckEmptyState(true));
    }, []);

    const hasSomeFilter = Object.entries(filterValue).map(([_key, value]) => value).filter(Boolean).length > 0;

    useEffect(() => {
        if (checkEmptyState) {
            setShowEmptyState(loaded && numberOfEntities === 0 && !hasSomeFilter);
            updateQuery(sources);
        }
    }, [location, checkEmptyState]);

    useEffect(() => {
        if (filter !== filterValue.name) {
            setFilterValue(filterValue.name);
        }
    }, [filterValue.name]);

    useEffect(() => {
        if (checkEmptyState && loaded) {
            setShowEmptyState(numberOfEntities === 0 && !hasSomeFilter);
        }
    }, [loaded]);

    const onSetPage = (_e, page) => dispatch(pageAndSize(page, pageSize));

    const onPerPageSelect = (_e, perPage) => dispatch(pageAndSize(1, perPage));

    const maximumPageNumber = Math.ceil(numberOfEntities / pageSize);

    useEffect(() => {
        if (loaded && numberOfEntities > 0 && pageNumber > Math.max(maximumPageNumber, 1)) {
            onSetPage({}, maximumPageNumber);
        }
    });

    const paginationConfig = {
        itemCount: numberOfEntities,
        page: pageNumber,
        perPage: pageSize,
        onSetPage,
        onPerPageSelect
    };

    const paginationConfigBottom = {
        ...paginationConfig,
        dropDirection: 'up',
        variant: 'bottom',
        isCompact: false
    };

    const showPaginationLoader = (!loaded || !appTypesLoaded || !sourceTypesLoaded) && !paginationClicked;

    const mainContent = () => (
        <React.Fragment>
            <PrimaryToolbar
                pagination={showPaginationLoader ? <PaginationLoader /> : numberOfEntities > 0 ? paginationConfig : undefined}
                actionsConfig={isOrgAdmin ? {
                    actions: [
                        <Link to={routes.sourcesNew.path} key="addSourceButton">
                            <Button variant='primary' id="addSourceButton">
                                <FormattedMessage
                                    id="sources.addSource"
                                    defaultMessage="Add source"
                                />
                            </Button>
                        </Link>
                    ]
                } : {
                    actions: [
                        <Tooltip
                            content={
                                intl.formatMessage({
                                    id: 'sources.notAdminButton',
                                    defaultMessage: 'You do not have permission to perform this action.'
                                })
                            }
                            key="addSourceButton"
                        >
                            <span tabIndex="0">
                                <Button variant='primary' isDisabled id="addSourceButton">
                                    <FormattedMessage
                                        id="sources.addSource"
                                        defaultMessage="Add source"
                                    />
                                </Button>
                            </span>
                        </Tooltip>
                    ]
                }}
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
                    }, {
                        label: intl.formatMessage({
                            id: 'sources.application',
                            defaultMessage: 'Application'
                        }),
                        type: 'checkbox',
                        filterValues: {
                            onChange: (_event, value) =>
                                setFilter('applications', value, dispatch),
                            items: prepareApplicationTypeSelection(appTypes || []),
                            value: filterValue.applications
                        }
                    }]
                }}
                activeFiltersConfig={{
                    filters: prepareChips(filterValue, sourceTypes, appTypes),
                    onDelete: (_event, chips, deleteAll) =>
                        dispatch(filterSources(removeChips(chips, filterValue, deleteAll)))
                }}
            />
            <SourcesTable />
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
            <Suspense fallback={null}>
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
                        onClose: () => history.push(routes.sources.path),
                        afterSuccess: (source) => afterSuccess(dispatch, source),
                        hideSourcesButton: true
                    }}
                />
                <CustomRoute exact route={routes.sourcesEdit} Component={SourceEditModal}/>
            </Suspense>
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
