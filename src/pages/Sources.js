import React, { Suspense, useEffect, useReducer } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Button, Tooltip } from '@patternfly/react-core';
import { useIntl } from 'react-intl';

import AppLink from '../components/AppLink';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { Section } from '@redhat-cloud-services/frontend-components/Section';
import { ErrorState } from '@redhat-cloud-services/frontend-components/ErrorState';
import { isSmallScreen, useScreenSize } from '@redhat-cloud-services/frontend-components/useScreenSize';
import { downloadFile } from '@redhat-cloud-services/frontend-components-utilities/helpers';

import SourcesTable from '../components/SourcesTable/SourcesTable';
import { filterSources, pageAndSize } from '../redux/sources/actions';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { routes } from '../Routing';

import {
  afterSuccess,
  checkSubmit,
  debouncedFiltering,
  loadedTypes,
  prepareApplicationTypeSelection,
  prepareChips,
  prepareSourceTypeSelection,
  removeChips,
  setFilter,
} from './Sources/helpers';
import { useIsLoaded } from '../hooks/useIsLoaded';
import { useHasWritePermissions } from '../hooks/useHasWritePermissions';
import { PaginationLoader } from '../components/SourcesTable/loaders';
import CloudCards from '../components/CloudTiles/CloudCards';
import { CLOUD_VENDOR, COMMUNICATIONS, INTEGRATIONS, OVERVIEW, REDHAT_VENDOR, REPORTING, WEBHOOKS } from '../utilities/constants';
import CloudEmptyState from '../components/CloudTiles/CloudEmptyState';
import { AVAILABLE, UNAVAILABLE } from '../views/formatters';
import RedHatEmptyState from '../components/RedHatTiles/RedHatEmptyState';
import { filterVendorTypes } from '../utilities/filterTypes';
import { filterVendorAppTypes } from '../utilities/filterApps';
import SourcesHeader from '../components/SourcesHeader';
import generateCSV from '../utilities/generateCSV';
import generateJSON from '../utilities/generateJSON';
import { Outlet } from 'react-router-dom';
import { useFlag } from '@unleash/proxy-client-react';
import Overview from '../components/Overview';

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
  const isOrgAdmin = useSelector(({ user }) => user.isOrgAdmin);
  const enableIntegrations = useFlag('platform.sources.integrations') || useFlag('platform.sources.breakdown');

  const appNavigate = useAppNavigate();
  const intl = useIntl();

  const screenSize = useScreenSize();

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
    activeCategory,
    entities,
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

  const filteredSourceTypes = sourceTypes.filter(filterVendorTypes(activeCategory, true));

  const addSourceText = intl.formatMessage({
    id: 'sources.addSource',
    defaultMessage: 'Add integration',
  });
  const noPermissionsText = isOrgAdmin
    ? intl.formatMessage({
        id: 'sources.notAdminAddButton',
        defaultMessage: 'To add a source, you must add Cloud Integration Administrator permissions to your user.',
      })
    : intl.formatMessage({
        id: 'sources.notPermissionsAddButton',
        defaultMessage:
          'To add a source, your Organization Administrator must grant you Cloud Integration Administrator permissions.',
      });

  let actionsConfig;

  if (isSmallScreen(screenSize)) {
    actionsConfig = {
      dropdownProps: { position: 'right' },
      actions: hasWritePermissions
        ? [{ label: addSourceText, props: { to: routes.sourcesNew.path, component: AppLink } }]
        : [
            {
              label: addSourceText,
              props: {
                component: 'button',
                isDisabled: true,
                tooltip: noPermissionsText,
                tooltipProps: {
                  content: noPermissionsText,
                },
                className: 'src-m-dropdown-item-disabled',
              },
            },
          ],
    };
  }

  const hasSomeFilter =
    Object.entries(filterValue)
      .map(([_key, value]) => value && (!Array.isArray(value) || (Array.isArray(value) && value.length > 0)))
      .filter(Boolean).length > 0;

  const showEmptyState = loaded && numberOfEntities === 0 && !hasSomeFilter;
  const showOverview = activeCategory === OVERVIEW && !showEmptyState;
  const showInfoCards = activeCategory === CLOUD_VENDOR && !showEmptyState;

  const setSelectedType = (selectedType) => stateDispatch({ type: 'setSelectedType', selectedType });

  const mainContent =
    [INTEGRATIONS, COMMUNICATIONS, REPORTING, WEBHOOKS].includes(activeCategory) && enableIntegrations ? (
      <AsyncComponent appName="notifications" module="./IntegrationsTable" activeCategory={activeCategory} />
    ) : !fetchingError && !showEmptyState ? (
      <React.Fragment>
        <PrimaryToolbar
          pagination={showPaginationLoader ? <PaginationLoader /> : numberOfEntities > 0 ? paginationConfig : undefined}
          actionsConfig={
            actionsConfig || {
              dropdownProps: { position: 'right' },
              actions: hasWritePermissions
                ? [
                    <AppLink to={routes.sourcesNew.path} key="addSourceButton">
                      <Button
                        data-hcc-index="true"
                        data-hcc-title={addSourceText}
                        data-hcc-alt="create source;add cloud provider"
                        variant="primary"
                        id="addSourceButton"
                      >
                        {addSourceText}
                      </Button>
                    </AppLink>,
                  ]
                : [
                    <Tooltip content={noPermissionsText} key="addSourceButton">
                      <span tabIndex="0">
                        <Button variant="primary" isDisabled id="addSourceButton">
                          {addSourceText}
                        </Button>
                      </span>
                    </Tooltip>,
                  ],
            }
          }
          filterConfig={{
            items: [
              {
                type: 'text',
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
                  value: filter || '',
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
                  value: filterValue.source_type_id ?? [],
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
                  items: prepareApplicationTypeSelection(
                    appTypes?.filter(filterVendorAppTypes(filteredSourceTypes, activeCategory)) || [],
                  ),
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
                  onChange: (event, value, selectedValue) =>
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
            onDelete: (_event, chips, deleteAll) => {
              dispatch(filterSources(removeChips(chips, filterValue, deleteAll)));
            },
          }}
          exportConfig={{
            ...(isSmallScreen && { position: 'right' }),
            isDisabled: !loaded,
            onSelect: (_e, type) => {
              const data =
                type === 'csv'
                  ? generateCSV(entities, intl, appTypes, sourceTypes)
                  : generateJSON(entities, intl, appTypes, sourceTypes);
              downloadFile(data, `sources-${new Date().toISOString()}`, type);
            },
          }}
        />
        <SourcesTable />
        <PrimaryToolbar
          pagination={showPaginationLoader ? <PaginationLoader /> : numberOfEntities > 0 ? paginationConfigBottom : undefined}
        />
      </React.Fragment>
    ) : null;

  return (
    <React.Fragment>
      <Suspense fallback={null}>
        <Outlet
          context={{
            sourceTypes: loadedTypes(sourceTypes, sourceTypesLoaded),
            applicationTypes: loadedTypes(appTypes, appTypesLoaded),
            isOpen: true,
            onClose: () => {
              stateDispatch({ type: 'closeWizard' });
              appNavigate(routes.sources.path);
            },
            afterSuccess: (source) => afterSuccess(dispatch, source),
            hideSourcesButton: true,
            selectedType,
            submitCallback: (state) => checkSubmit(state, dispatch, appNavigate, intl, stateDispatch),
            initialValues: wizardInitialValues,
            initialWizardState: wizardInitialState,
            activeCategory,
          }}
        />
      </Suspense>
      <SourcesHeader />
      <Section type="content">
        {showOverview && <Overview />}
        {showInfoCards && <CloudCards />}
        {fetchingError && <ErrorState />}
        {!fetchingError && showEmptyState && activeCategory === CLOUD_VENDOR && (
          <CloudEmptyState setSelectedType={setSelectedType} />
        )}
        {!fetchingError && showEmptyState && activeCategory === REDHAT_VENDOR && (
          <RedHatEmptyState setSelectedType={setSelectedType} />
        )}
        {!showOverview && mainContent}
      </Section>
    </React.Fragment>
  );
};

export default SourcesPage;
