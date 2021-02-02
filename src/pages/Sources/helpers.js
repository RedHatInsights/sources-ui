import awesomeDebounce from 'awesome-debounce-promise';
import { loadEntities, filterSources } from '../../redux/sources/actions';
import { AVAILABLE } from '../../views/formatters';

export const debouncedFiltering = awesomeDebounce((refresh) => refresh(), 500);

export const afterSuccessLoadParameters = {
  pageNumber: 1,
  sortBy: 'created_at',
  sortDirection: 'desc',
};

export const afterSuccess = (dispatch) => dispatch(loadEntities(afterSuccessLoadParameters));

export const prepareSourceTypeSelection = (sourceTypes) =>
  sourceTypes.map(({ id, product_name }) => ({ label: product_name, value: id })).sort((a, b) => a.label.localeCompare(b.label));

export const prepareApplicationTypeSelection = (appTypes) =>
  appTypes.map(({ id, display_name }) => ({ label: display_name, value: id })).sort((a, b) => a.label.localeCompare(b.label));

export const setFilter = (column, value, dispatch) =>
  dispatch(
    filterSources({
      [column]: value,
    })
  );

export const chipsFormatters = (key, filterValue, sourceTypes, appTypes, intl) =>
  ({
    name: () => ({ name: filterValue[key], key }),
    source_type_id: () => ({
      category: 'Source Type',
      key,
      chips: filterValue[key].map((id) => {
        const sourceType = sourceTypes.find((type) => type.id === id);

        return { name: sourceType ? sourceType.product_name : id, value: id };
      }),
    }),
    applications: () => ({
      category: 'Application',
      key,
      chips: filterValue[key].map((id) => {
        const appType = appTypes.find((type) => type.id === id);

        return { name: appType ? appType.display_name : id, value: id };
      }),
    }),
    availability_status: () => ({
      category: 'Status',
      key,
      chips: [
        {
          value: filterValue[key][0],
          name:
            filterValue[key][0] === AVAILABLE
              ? intl.formatMessage({
                  id: 'sources.available',
                  defaultMessage: 'Available',
                })
              : intl.formatMessage({
                  id: 'sources.unavailable',
                  defaultMessage: 'Unavailable',
                }),
        },
      ],
    }),
  }[key] || (() => ({ name: key })));

export const prepareChips = (filterValue, sourceTypes, appTypes, intl) =>
  Object.keys(filterValue)
    .map((key) =>
      filterValue[key] && filterValue[key].length > 0
        ? chipsFormatters(key, filterValue, sourceTypes, appTypes, intl)()
        : undefined
    )
    .filter(Boolean);

export const removeChips = (chips, filterValue, deleteAll) => {
  if (deleteAll) {
    return Object.keys(filterValue).reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: undefined,
      }),
      {}
    );
  }

  const chip = chips[0];

  return {
    ...filterValue,
    [chip.key]: chip.chips ? filterValue[chip.key].filter((value) => value !== chip.chips[0].value) : undefined,
  };
};

export const loadedTypes = (types, loaded) => (loaded && types.length > 0 ? types : undefined);
