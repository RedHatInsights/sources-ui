import { restFilterGenerator } from '../api/entities';
import { AVAILABLE, UNAVAILABLE } from '../views/formatters';
import { sourcesColumns } from '../views/sourcesViewDefinition';
import { CLOUD_VENDOR, COMMUNICATIONS, OVERVIEW, REDHAT_VENDOR, REPORTING, WEBHOOKS } from './constants';

export const updateQuery = ({ sortBy, sortDirection, pageNumber, pageSize, filterValue, activeCategory }) => {
  const sortQuery = `sort_by[]=${sortBy}:${sortDirection}`;
  const category = activeCategory === null ? OVERVIEW : activeCategory;
  const removeQuery = category === OVERVIEW;

  const paginationQuery = `limit=${pageSize}&offset=${(pageNumber - 1) * pageSize}${category ? `&category=${category}` : ''}`;

  const filterQuery = restFilterGenerator(filterValue);

  const query = `?${sortQuery}&${paginationQuery}${filterQuery ? `&${filterQuery}` : ''}`;

  const fullHref = decodeURIComponent(`${window.location.pathname}${removeQuery ? `?category=${category}` : query}`);

  if (location.href !== fullHref) {
    return history.replaceState('', '', fullHref);
  }

  return null;
};

export const loadEnhancedAttributes = (params) => {
  const urlParams = params || new URLSearchParams(window.location.search);

  const applications = urlParams.getAll('application');
  const types = urlParams.getAll('type');
  const category = urlParams.getAll('category');

  return {
    applications: applications.length && applications,
    types: types.length && types,
    category,
  };
};

export const parseQuery = (getState) => {
  let fetchOptions = {};

  const urlParams = new URLSearchParams(window.location.search);

  const sortByRaw = urlParams.get('sort_by[]');

  let sortBy;
  let sortDirection;

  if (sortByRaw) {
    sortBy = sortByRaw.split(':')[0];
    sortDirection = sortByRaw.split(':')[1];

    sortBy = sourcesColumns({ formatMessage: () => '' })
      .filter(({ sortable }) => sortable)
      .map(({ value }) => value)
      .includes(sortBy)
      ? sortBy
      : 'created_at';
    sortDirection = ['desc', 'asc'].includes(sortDirection) ? sortDirection : 'desc';
  }

  if (sortBy && sortDirection) {
    fetchOptions = {
      sortBy,
      sortDirection,
    };
  }

  const pageSize = urlParams.get('limit');
  const offset = urlParams.get('offset');

  let pageNumber;

  if (offset && pageSize) {
    pageNumber = offset / pageSize + 1;
    if (isNaN(pageNumber)) {
      pageNumber = undefined;
    }
  }

  if (pageSize && pageNumber) {
    fetchOptions = {
      ...fetchOptions,
      pageNumber: parseInt(pageNumber, 10),
      pageSize: Math.min(parseInt(pageSize, 10), 100),
    };
  }

  let filterValue = {};

  const name = urlParams.get('filter[name][contains_i]');

  if (name) {
    filterValue = { name };
  }

  const sourceTypes = urlParams.getAll('filter[source_type_id][]');

  if (sourceTypes.length > 0) {
    filterValue = {
      ...filterValue,
      source_type_id: sourceTypes,
    };
  }

  const applicationTypes = urlParams.getAll('filter[applications][application_type_id][eq][]');

  if (applicationTypes.length > 0) {
    filterValue = {
      ...filterValue,
      applications: applicationTypes,
    };
  }

  if (urlParams.get('filter[availability_status]')) {
    filterValue = {
      ...filterValue,
      availability_status: [AVAILABLE],
    };
  } else if (urlParams.get('filter[availability_status][]')) {
    filterValue = {
      ...filterValue,
      availability_status: [UNAVAILABLE],
    };
  }

  const { applications, types } = loadEnhancedAttributes(urlParams);

  if (applications || types) {
    const { appTypes, sourceTypes } = getState().sources;

    const applicationIds = applications.map?.((app) => appTypes.find(({ name }) => name.includes(app))?.id).filter(Boolean);
    const typeIds = types.map?.((type) => sourceTypes.find(({ name }) => name === type)?.id).filter(Boolean);

    filterValue = {
      ...filterValue,
      ...(applicationIds?.length && { applications: applicationIds }),
      ...(typeIds?.length && { source_type_id: typeIds }),
    };
  }

  const hasSomeFilterValue =
    Object.entries(filterValue)
      .map(([_key, value]) => value)
      .filter(Boolean).length > 0;

  if (hasSomeFilterValue) {
    fetchOptions = {
      ...fetchOptions,
      filterValue,
    };
  }

  const activeCategory = urlParams.get('category') || urlParams.get('activeVendor');

  if ([CLOUD_VENDOR, REDHAT_VENDOR, COMMUNICATIONS, REPORTING, WEBHOOKS].includes(activeCategory)) {
    fetchOptions = {
      ...fetchOptions,
      activeCategory,
    };
  }

  return fetchOptions;
};
