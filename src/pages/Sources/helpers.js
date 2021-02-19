import React from 'react';
import awesomeDebounce from 'awesome-debounce-promise';

import { AlertActionLink } from '@patternfly/react-core/dist/esm/components/Alert/AlertActionLink';

import computeSourceStatus from '@redhat-cloud-services/frontend-components-sources/esm/computeSourceStatus';

import { loadEntities, filterSources, addMessage, removeMessage } from '../../redux/sources/actions';
import { replaceRouteId, routes } from '../../Routes';
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

export const checkSubmit = (state, dispatch, push, intl, stateDispatch) => {
  const id = `sources-wizard-notification-${Date.now()}`;

  if (location.pathname.split('/').filter(Boolean).pop() !== routes.sourcesNew.path.split('/').pop()) {
    if (state.isErrored) {
      const { activeStep, activeStepIndex, maxStepIndex, prevSteps, registeredFieldsHistory } = state.wizardState;

      dispatch(
        addMessage({
          title: intl.formatMessage({
            id: 'alert.error.title',
            defaultMessage: 'Error adding source',
          }),
          description: intl.formatMessage(
            {
              id: 'alert.error.description',
              defaultMessage:
                'There was a problem while trying to add source {name}. Please try again. If the error persists, open a support case.',
            },
            { name: <b>{state.values.source.name}</b> }
          ),
          variant: 'danger',
          id,
          actionLinks: (
            <AlertActionLink
              onClick={() => {
                stateDispatch({
                  type: 'retryWizard',
                  initialValues: state.values,
                  initialState: { activeStep, activeStepIndex, maxStepIndex, prevSteps, registeredFieldsHistory },
                });
                dispatch(removeMessage(id));
                push(routes.sourcesNew.path);
              }}
            >
              {intl.formatMessage({
                id: 'alert.error.link',
                defaultMessage: 'Retry',
              })}
            </AlertActionLink>
          ),
        })
      );
    } else {
      switch (computeSourceStatus(state.createdSource)) {
        case 'unavailable':
          dispatch(
            addMessage({
              title: intl.formatMessage({
                id: 'alert.error.title',
                defaultMessage: 'Source configuration unsuccessful',
              }),
              description: (
                <React.Fragment>
                  {state.createdSource.applications?.[0]?.availability_status_error ||
                    state.createdSource.endpoint?.[0]?.availability_status_error ||
                    intl.formatMessage({
                      id: 'wizard.unknownError',
                      defaultMessage: 'Unknown error',
                    })}
                  &nbsp;[<b>{state.createdSource.name}</b>]
                </React.Fragment>
              ),
              variant: 'danger',
              id,
              actionLinks: (
                <AlertActionLink
                  onClick={() => {
                    dispatch(removeMessage(id));
                    push(replaceRouteId(routes.sourcesDetail.path, state.createdSource.id));
                  }}
                >
                  {intl.formatMessage({
                    id: 'alert.unavailable.link',
                    defaultMessage: 'Edit source',
                  })}
                </AlertActionLink>
              ),
            })
          );
          break;
        case 'timeout':
          dispatch(
            addMessage({
              title: intl.formatMessage({
                id: 'alert.timeout.title',
                defaultMessage: 'Source configuration in progress',
              }),
              description: intl.formatMessage(
                {
                  id: 'alert.timeout.description',
                  defaultMessage:
                    'We are still working to confirm credentials for source {name}. To track progress, check the Status column in the Sources table.',
                },
                { name: <b>{state.createdSource.name}</b> }
              ),
              variant: 'info',
            })
          );
          break;
        default:
          dispatch(
            addMessage({
              title: intl.formatMessage(
                {
                  id: 'alert.success.title',
                  defaultMessage: '{type} connection successful',
                },
                { type: state.sourceTypes.find(({ id }) => id === state.createdSource.source_type_id)?.product_name }
              ),
              description: intl.formatMessage(
                {
                  id: 'alert.success.description',
                  defaultMessage: 'Source {name} was successfully added',
                },
                { name: <b>{state.createdSource.name}</b> }
              ),
              variant: 'success',
              id,
              actionLinks: (
                <AlertActionLink
                  onClick={() => {
                    dispatch(removeMessage(id));
                    push(replaceRouteId(routes.sourcesDetail.path, state.createdSource.id));
                  }}
                >
                  {intl.formatMessage({
                    id: 'alert.success.link',
                    defaultMessage: 'View source details',
                  })}
                </AlertActionLink>
              ),
            })
          );
          break;
      }
    }
  }
};
