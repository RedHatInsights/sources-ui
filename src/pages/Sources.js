import React, { useEffect, lazy, Suspense, useReducer } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Button } from '@patternfly/react-core/dist/esm/components/Button/Button';
import { useIntl } from 'react-intl';

import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { Section } from '@redhat-cloud-services/frontend-components/Section';

import { filterSources, pageAndSize } from '../redux/sources/actions';
import SourcesTable from '../components/SourcesTable/SourcesTable';
import SourcesErrorState from '../components/SourcesErrorState';
import { routes } from '../Routes';

const SourceRemoveModal = lazy(() =>
  import(
    /* webpackChunkName: "remove" */
    '../components/SourceRemoveModal/SourceRemoveModal'
  )
);
const AddSourceWizard = lazy(() =>
  import(/* webpackChunkName: "addSource" */ '../addSourceWizard/addSourceWizard/index').then((module) => ({
    default: module.AddSourceWizard,
  }))
);

import {
  prepareChips,
  removeChips,
  setFilter,
  debouncedFiltering,
  prepareSourceTypeSelection,
  afterSuccess,
  loadedTypes,
  prepareApplicationTypeSelection,
  checkSubmit,
} from './Sources/helpers';
import { useIsLoaded } from '../hooks/useIsLoaded';
import { useHasWritePermissions } from '../hooks/useHasWritePermissions';
import CustomRoute from '../components/CustomRoute/CustomRoute';
import { Tooltip } from '@patternfly/react-core/dist/esm/components/Tooltip/Tooltip';
import { PaginationLoader } from '../components/SourcesTable/loaders';
import TabNavigation from '../components/TabNavigation';
import CloudCards from '../components/CloudTiles/CloudCards';
import { CLOUD_VENDOR, REDHAT_VENDOR } from '../utilities/constants';
import CloudEmptyState from '../components/CloudTiles/CloudEmptyState';
import { AVAILABLE, UNAVAILABLE } from '../views/formatters';
import RedHatEmptyState from '../components/RedHatTiles/RedHatEmptyState';
import { filterVendorTypes } from '../addSourceWizard/utilities/filterTypes';
import { filterVendorAppTypes } from '../addSourceWizard/utilities/filterApps';

const initialState = {
  filter: undefined,
  selectedType: undefined,
  wizardInitialState: undefined,
  wizardInitialValues: undefined,
};

const reducer = (state, { type, value, selectedType, initialValues, initialState }) => {
  switch (type) {
    case 'setFilterValue':
      return { ...state, filter: value };
    case 'setSelectedType':
      return { ...state, selectedType };
    case 'retryWizard':
      return { ...state, wizardInitialState: initialState, wizardInitialValues: initialValues };
    case 'closeWizard':
      return { ...state, selectedType: undefined, wizardInitialState: undefined, wizardInitialValues: undefined };
  }
};

const SourcesPage = () => {
  const [{ filter, selectedType, wizardInitialState, wizardInitialValues }, stateDispatch] = useReducer(reducer, initialState);

  const entitiesLoaded = useIsLoaded();
  const hasWritePermissions = useHasWritePermissions();

  const history = useHistory();
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
    sourceTypesLoaded,
    activeVendor,
  } = sources;

  const loaded = entitiesLoaded && sourceTypesLoaded && appTypesLoaded;

  const dispatch = useDispatch();

  useEffect(() => {
    if (filter !== filterValue.name) {
      stateDispatch({ type: 'setFilterValue', value: filterValue.name });
    }
  }, [filterValue.name]);

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
    onPerPageSelect,
    className: 'top-pagination',
  };

  const paginationConfigBottom = {
    ...paginationConfig,
    dropDirection: 'up',
    variant: 'bottom',
    isCompact: false,
    className: 'bottom-pagination',
  };

  const showPaginationLoader = (!loaded || !appTypesLoaded || !sourceTypesLoaded) && !paginationClicked;

  const filteredSourceTypes = sourceTypes.filter(filterVendorTypes);

  const mainContent = () => (
    <React.Fragment>
      <PrimaryToolbar
        pagination={showPaginationLoader ? <PaginationLoader /> : numberOfEntities > 0 ? paginationConfig : undefined}
        actionsConfig={
          hasWritePermissions
            ? {
                actions: [
                  <Link to={routes.sourcesNew.path} key="addSourceButton">
                    <Button variant="primary" id="addSourceButton">
                      {intl.formatMessage({
                        id: 'sources.addSource',
                        defaultMessage: 'Add source',
                      })}
                    </Button>
                  </Link>,
                ],
              }
            : {
                actions: [
                  <Tooltip
                    content={intl.formatMessage({
                      id: 'sources.notAdminAddButton',
                      defaultMessage:
                        'To add a source, you must be granted write permissions from your Organization Administrator.',
                    })}
                    key="addSourceButton"
                  >
                    <span tabIndex="0">
                      <Button variant="primary" isDisabled id="addSourceButton">
                        {intl.formatMessage({
                          id: 'sources.addSource',
                          defaultMessage: 'Add source',
                        })}
                      </Button>
                    </span>
                  </Tooltip>,
                ],
              }
        }
        filterConfig={{
          items: [
            {
              label: intl.formatMessage({
                id: 'sources.name',
                defaultMessage: 'Name',
              }),
              filterValues: {
                'aria-label': intl.formatMessage({
                  id: 'sources.filterByName',
                  defaultMessage: 'Filter by name',
                }),
                onChange: (_event, value) => {
                  stateDispatch({ type: 'setFilterValue', value });
                  debouncedFiltering(() => setFilter('name', value, dispatch));
                },
                value: filter,
              },
            },
            {
              label: intl.formatMessage({
                id: 'sources.type',
                defaultMessage: 'Type',
              }),
              type: 'checkbox',
              filterValues: {
                onChange: (_event, value) => setFilter('source_type_id', value, dispatch),
                items: prepareSourceTypeSelection(filteredSourceTypes),
                value: filterValue.source_type_id,
              },
            },
            {
              label: intl.formatMessage({
                id: 'sources.application',
                defaultMessage: 'Application',
              }),
              type: 'checkbox',
              filterValues: {
                onChange: (_event, value) => setFilter('applications', value, dispatch),
                items: prepareApplicationTypeSelection(appTypes?.filter(filterVendorAppTypes(filteredSourceTypes)) || []),
                value: filterValue.applications,
              },
            },
            {
              label: intl.formatMessage({
                id: 'sources.availabilityStatus',
                defaultMessage: 'Status',
              }),
              type: 'checkbox',
              filterValues: {
                onChange: (event, _value, selectedValue) =>
                  setFilter('availability_status', event.target.checked ? [selectedValue] : [], dispatch),
                items: [
                  { label: intl.formatMessage({ id: 'sources.available', defaultMessage: 'Available' }), value: AVAILABLE },
                  {
                    label: intl.formatMessage({ id: 'sources.unavailable', defaultMessage: 'Unavailable' }),
                    value: UNAVAILABLE,
                  },
                ],
                value: filterValue.availability_status,
              },
            },
          ],
        }}
        activeFiltersConfig={{
          filters: prepareChips(filterValue, sourceTypes, appTypes, intl),
          onDelete: (_event, chips, deleteAll) => dispatch(filterSources(removeChips(chips, filterValue, deleteAll))),
        }}
      />
      <SourcesTable />
      <PrimaryToolbar
        pagination={showPaginationLoader ? <PaginationLoader /> : numberOfEntities > 0 ? paginationConfigBottom : undefined}
      />
    </React.Fragment>
  );

  const hasSomeFilter =
    Object.entries(filterValue)
      .map(([_key, value]) => value && (!Array.isArray(value) || (Array.isArray(value) && value.length > 0)))
      .filter(Boolean).length > 0;

  const showEmptyState = loaded && numberOfEntities === 0 && !hasSomeFilter;
  const showInfoCards = activeVendor === CLOUD_VENDOR && !showEmptyState;

  const setSelectedType = (selectedType) => stateDispatch({ type: 'setSelectedType', selectedType });

  return (
    <React.Fragment>
      <Suspense fallback={null}>
        <CustomRoute exact route={routes.sourcesRemove} Component={SourceRemoveModal} />
        <CustomRoute
          exact
          route={routes.sourcesNew}
          Component={AddSourceWizard}
          componentProps={{
            sourceTypes: loadedTypes(sourceTypes, sourceTypesLoaded),
            applicationTypes: loadedTypes(appTypes, appTypesLoaded),
            isOpen: true,
            onClose: () => {
              stateDispatch({ type: 'closeWizard' });
              history.push(routes.sources.path);
            },
            afterSuccess: (source) => afterSuccess(dispatch, source),
            hideSourcesButton: true,
            selectedType,
            submitCallback: (state) => checkSubmit(state, dispatch, history.push, intl, stateDispatch),
            initialValues: wizardInitialValues,
            initialWizardState: wizardInitialState,
          }}
        />
      </Suspense>
      <PageHeader className="pf-u-pb-0">
        <PageHeaderTitle
          title={intl.formatMessage({
            id: 'sources.sources',
            defaultMessage: 'Sources',
          })}
        />
        <TabNavigation />
      </PageHeader>
      <Section type="content">
        {showInfoCards && <CloudCards />}
        {fetchingError && <SourcesErrorState />}
        {!fetchingError && showEmptyState && activeVendor === CLOUD_VENDOR && (
          <CloudEmptyState setSelectedType={setSelectedType} />
        )}
        {!fetchingError && showEmptyState && activeVendor === REDHAT_VENDOR && (
          <RedHatEmptyState setSelectedType={setSelectedType} />
        )}
        {!fetchingError && !showEmptyState && mainContent()}
      </Section>
    </React.Fragment>
  );
};

export default SourcesPage;
