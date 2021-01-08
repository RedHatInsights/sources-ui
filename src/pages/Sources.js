import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { useIntl } from 'react-intl';

import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/components/cjs/PrimaryToolbar';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/components/cjs/PageHeader';
import { Section } from '@redhat-cloud-services/frontend-components/components/cjs/Section';
import { filterVendorAppTypes } from '@redhat-cloud-services/frontend-components-sources/cjs/filterApps';

import { filterSources, pageAndSize } from '../redux/sources/actions';
import SourcesTable from '../components/SourcesTable/SourcesTable';
import SourcesErrorState from '../components/SourcesErrorState';
import { replaceRouteId, routes } from '../Routes';

const SourceRemoveModal = lazy(() =>
  import(
    /* webpackChunkName: "remove" */
    '../components/SourceRemoveModal/SourceRemoveModal'
  )
);
const AddSourceWizard = lazy(() =>
  import(
    /* webpackChunkName: "addSource" */ '@redhat-cloud-services/frontend-components-sources/cjs/addSourceWizard'
  ).then((module) => ({ default: module.AddSourceWizard }))
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
} from './Sources/helpers';
import { useIsLoaded } from '../hooks/useIsLoaded';
import { useHasWritePermissions } from '../hooks/useHasWritePermissions';
import CustomRoute from '../components/CustomRoute/CustomRoute';
import { Tooltip } from '@patternfly/react-core/dist/js/components/Tooltip/Tooltip';
import { PaginationLoader } from '../components/SourcesTable/loaders';
import TabNavigation from '../components/TabNavigation';
import CloudCards from '../components/CloudTiles/CloudCards';
import { CLOUD_VENDOR } from '../utilities/constants';
import CloudEmptyState from '../components/CloudTiles/CloudEmptyState';

const SourcesPage = () => {
  const [filter, setFilterValue] = useState();
  const [selectedType, setSelectedType] = useState();

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
      setFilterValue(filterValue.name);
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
                  setFilterValue(value);
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
                items: prepareSourceTypeSelection(sourceTypes || [], activeVendor),
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
                items: prepareApplicationTypeSelection(appTypes?.filter(filterVendorAppTypes(sourceTypes)) || []),
                value: filterValue.applications,
              },
            },
          ],
        }}
        activeFiltersConfig={{
          filters: prepareChips(filterValue, sourceTypes, appTypes),
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

  const showEmptyState = loaded && numberOfEntities === 0 && !hasSomeFilter && activeVendor === CLOUD_VENDOR;
  const showInfoCards = activeVendor === CLOUD_VENDOR && !showEmptyState;

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
            onClose: (_values, source) => {
              setSelectedType(undefined);
              source?.id ? history.push(replaceRouteId(routes.sourcesDetail.path, source.id)) : history.push(routes.sources.path);
            },
            afterSuccess: (source) => afterSuccess(dispatch, source),
            hideSourcesButton: true,
            returnButtonTitle: intl.formatMessage({ id: 'sources.returnButtonTitle', defaultMessage: 'Exit to source details' }),
            selectedType,
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
        {showInfoCards && <CloudCards setSelectedType={setSelectedType} />}
        {fetchingError && <SourcesErrorState />}
        {!fetchingError && showEmptyState && <CloudEmptyState setSelectedType={setSelectedType} />}
        {!fetchingError && !showEmptyState && mainContent()}
      </Section>
    </React.Fragment>
  );
};

export default SourcesPage;
