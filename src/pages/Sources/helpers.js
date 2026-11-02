import { defineMessages } from 'react-intl';
import React from 'react';
import awesomeDebounce from 'awesome-debounce-promise';

import { AlertActionLink } from '@patternfly/react-core';

import { filterSources, loadEntities } from '../../redux/sources/actions';
import { replaceRouteId, routes } from '../../routes';
import { AVAILABLE } from '../../views/formatters';
import computeSourceStatus from '../../utilities/computeSourceStatus';
import { bold } from '../../utilities/intlShared';
import notificationsStore from '../../utilities/notificationsStore';

const messages = defineMessages({
  sourcesAvailable: {
    id: 'sources.available',
    defaultMessage: 'Available',
  },
  sourcesUnavailable: {
    id: 'sources.unavailable',
    defaultMessage: 'Unavailable',
  },
  alertErrorTitle: {
    id: 'alert.error.title',
    defaultMessage: 'Error adding integration',
  },
  alertErrorDescription: {
    id: 'alert.error.description',
    defaultMessage:
      'There was a problem while trying to add integration {name}. Please try again. If the error persists, open a support case.',
  },
  alertErrorLink: {
    id: 'alert.error.link',
    defaultMessage: 'Retry',
  },
  alertErrorTitle_1: {
    id: 'alert.sourceConfigurationUnsuccessful',
    defaultMessage: 'Source configuration unsuccessful',
  },
  errorNotification: {
    id: 'error.notification',
    defaultMessage: '{error} [<b>{name}</b>]',
  },
  wizardUnknownerror: {
    id: 'wizard.unknownError',
    defaultMessage: 'Unknown error',
  },
  alertUnavailableLink: {
    id: 'alert.unavailable.link',
    defaultMessage: 'Edit integration',
  },
  alertTimeoutTitle: {
    id: 'alert.timeout.title',
    defaultMessage: 'Integration configuration in progress',
  },
  alertTimeoutDescription: {
    id: 'alert.timeout.description',
    defaultMessage:
      'We are still working to confirm credentials for integration {name}. To track progress, check the Status column in the Integrations table.',
  },
  alertSuccessTitle: {
    id: 'alert.success.title',
    defaultMessage: '{type} connection successful',
  },
  alertSuccessDescription: {
    id: 'alert.success.description',
    defaultMessage: 'Source {name} was successfully added',
  },
  alertSuccessLink: {
    id: 'alert.success.link',
    defaultMessage: 'View source details',
  },
});

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
    }),
  );

export const chipsFormatters = (key, filterValue, sourceTypes, appTypes, intl) =>
  ({
    name: () => ({ name: filterValue[key], key }),
    source_type_id: () => ({
      category: 'Integration Type',
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
              ? intl.formatMessage(messages.sourcesAvailable)
              : intl.formatMessage(messages.sourcesUnavailable),
        },
      ],
    }),
  })[key] || (() => ({ name: key }));

export const prepareChips = (filterValue, sourceTypes, appTypes, intl) =>
  Object.keys(filterValue)
    .map((key) =>
      filterValue[key] && filterValue[key].length > 0
        ? chipsFormatters(key, filterValue, sourceTypes, appTypes, intl)()
        : undefined,
    )
    .filter(Boolean);

export const removeChips = (chips, filterValue, deleteAll) => {
  if (deleteAll) {
    return Object.keys(filterValue).reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: undefined,
      }),
      {},
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
      notificationsStore.addNotification({
        title: intl.formatMessage(messages.alertErrorTitle),
        description: intl.formatMessage(messages.alertErrorDescription, { name: <b>{state.values.source.name}</b> }),
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
              notificationsStore.removeNotification(id);
              push(routes.sourcesNew.path);
            }}
          >
            {intl.formatMessage(messages.alertErrorLink)}
          </AlertActionLink>
        ),
      });
    } else {
      switch (computeSourceStatus(state.createdSource)) {
        case 'unavailable':
          notificationsStore.addNotification({
            title: intl.formatMessage(messages.alertErrorTitle_1),
            description: intl.formatMessage(messages.errorNotification, {
              error:
                state.createdSource.applications?.[0]?.availability_status_error ||
                state.createdSource.endpoint?.[0]?.availability_status_error ||
                intl.formatMessage(messages.wizardUnknownerror),
              name: state.createdSource.name,
              b: bold,
            }),
            variant: 'danger',
            id,
            actionLinks: (
              <AlertActionLink
                onClick={() => {
                  notificationsStore.removeNotification(id);
                  push(replaceRouteId(routes.sourcesDetail.path, state.createdSource.id));
                }}
              >
                {intl.formatMessage(messages.alertUnavailableLink)}
              </AlertActionLink>
            ),
          });
          break;
        case 'timeout':
          notificationsStore.addNotification({
            title: intl.formatMessage(messages.alertTimeoutTitle),
            description: intl.formatMessage(messages.alertTimeoutDescription, { name: <b>{state.createdSource.name}</b> }),
            variant: 'info',
          });
          break;
        default:
          notificationsStore.addNotification({
            title: intl.formatMessage(messages.alertSuccessTitle, {
              type: state.sourceTypes.find(({ id }) => id === state.createdSource.source_type_id)?.product_name,
            }),
            description: intl.formatMessage(messages.alertSuccessDescription, { name: <b>{state.createdSource.name}</b> }),
            variant: 'success',
            id,
            actionLinks: (
              <AlertActionLink
                onClick={() => {
                  notificationsStore.removeNotification(id);
                  push(replaceRouteId(routes.sourcesDetail.path, state.createdSource.id));
                }}
              >
                {intl.formatMessage(messages.alertSuccessLink)}
              </AlertActionLink>
            ),
          });
          break;
      }
    }
  }
};
