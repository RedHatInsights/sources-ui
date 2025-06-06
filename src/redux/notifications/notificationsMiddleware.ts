import get from 'lodash/get';
import has from 'lodash/has';

import { Middleware } from 'redux';
import { NotificationConfig } from '@redhat-cloud-services/frontend-components-notifications';
import { AlertVariant } from '@patternfly/react-core';
import notificationsStore from '../../utilities/notificationsStore';

type PrepareErrorMessagePayload =
  | string
  | {
      sentryId?: string;
      requestId?: string;
    };

const prepareErrorMessage = (
  payload: PrepareErrorMessagePayload,
  errorTitleKey?: string[] | string,
  errorDescriptionKey?: string[] | string,
) => {
  if (typeof payload === 'string') {
    return {
      title: 'Error',
      description: payload,
    };
  }

  let titleKey = errorTitleKey;
  if (Array.isArray(errorTitleKey)) {
    titleKey = errorTitleKey.find((key) => has(payload, key));
  }

  let descriptionKey = errorDescriptionKey;
  if (Array.isArray(errorDescriptionKey)) {
    descriptionKey = errorDescriptionKey.find((key) => has(payload, key));
  }

  return {
    title: get(payload, titleKey as string) || 'Error',
    description: get(payload, descriptionKey as string),
    sentryId: payload?.sentryId,
    requestId: payload?.requestId,
  };
};

type DispatchDefaultErrorConfig = {
  isRejected?: boolean;
  hasCustomNotification?: boolean;
  noErrorOverride?: boolean;
  dispatchDefaultFailure?: boolean;
};

const shouldDispatchDefaultError = ({
  isRejected,
  hasCustomNotification,
  noErrorOverride,
  dispatchDefaultFailure,
}: DispatchDefaultErrorConfig) => isRejected && !hasCustomNotification && !noErrorOverride && dispatchDefaultFailure;

type CreateNotificationsMiddlewareOptions = {
  dispatchDefaultFailure?: boolean;
  pendingSuffix?: string;
  fulfilledSuffix?: string;
  rejectedSuffix?: string;
  autoDismiss?: boolean;
  dismissDelay?: number;
  errorTitleKey?: string | string[];
  errorDescriptionKey?: string | string[];
  useStatusText?: boolean;
  errorNamespaceKey?: string | string[];
};

export const createNotificationsMiddleware = (options?: CreateNotificationsMiddlewareOptions) => {
  const defaultOptions: CreateNotificationsMiddlewareOptions = {
    dispatchDefaultFailure: true,
    pendingSuffix: '_PENDING',
    fulfilledSuffix: '_FULFILLED',
    rejectedSuffix: '_REJECTED',
    autoDismiss: false,
    dismissDelay: 5000,
    errorTitleKey: 'title',
    errorDescriptionKey: 'detail',
    useStatusText: false,
  };
  const middlewareOptions = { ...defaultOptions, ...options };

  const matchPending = (type = '') => Boolean(type.match(new RegExp(`^.*${middlewareOptions.pendingSuffix}$`)));
  const matchFulfilled = (type = '') => Boolean(type.match(new RegExp(`^.*${middlewareOptions.fulfilledSuffix}$`)));
  const matchRejected = (type = '') => Boolean(type.match(new RegExp(`^.*${middlewareOptions.rejectedSuffix}$`)));

  const defaultNotificationOptions = {
    dismissable: !middlewareOptions.autoDismiss,
    dismissDelay: middlewareOptions.dismissDelay,
  };

  const middleware: Middleware<Record<string, unknown>, NotificationConfig[]> = () => (next) => (action) => {
    const type = action?.type;
    const meta = action?.meta || action?.payload?.meta;
    if (meta && meta.notifications && type) {
      const { notifications } = meta;
      if (matchPending(type) && notifications.pending) {
        if (typeof notifications.pending === 'function') {
          notifications.pending = notifications.pending(action.payload);
        }

        notificationsStore.addNotification({ ...defaultNotificationOptions, ...notifications.pending });
      } else if (matchFulfilled(type) && notifications.fulfilled) {
        if (typeof notifications.fulfilled === 'function') {
          notifications.fulfilled = notifications.fulfilled(action.payload);
        }

        notificationsStore.addNotification({ ...defaultNotificationOptions, ...notifications.fulfilled });
      } else if (matchRejected(type) && notifications.rejected) {
        if (typeof notifications.rejected === 'function') {
          notifications.rejected = notifications.rejected(action.payload);
        }

        notificationsStore.addNotification({
          ...defaultNotificationOptions,
          ...notifications.rejected,
          sentryId: action.payload && action.payload.sentryId,
          requestId: action.payload && action.payload.requestId,
        });
      }
    }

    if (
      type &&
      shouldDispatchDefaultError({
        isRejected: matchRejected(type),
        hasCustomNotification: meta && meta.notifications && meta.notifications.rejected,
        noErrorOverride: meta && meta.noError,
        dispatchDefaultFailure: middlewareOptions.dispatchDefaultFailure,
      })
    ) {
      if (middlewareOptions.useStatusText && action.payload) {
        notificationsStore.addNotification({
          variant: AlertVariant.danger,
          dismissable: true,
          ...prepareErrorMessage(action.payload, middlewareOptions.errorTitleKey, 'statusText'),
        });
      } else {
        const namespaceKey =
          Array.isArray(middlewareOptions.errorNamespaceKey) &&
          middlewareOptions.errorNamespaceKey.find((key) => has(action.payload, key));
        if (namespaceKey) {
          get(action.payload, namespaceKey).map((item: PrepareErrorMessagePayload) => {
            notificationsStore.addNotification({
              variant: AlertVariant.danger,
              dismissable: true,
              ...prepareErrorMessage(item, middlewareOptions.errorTitleKey, middlewareOptions.errorDescriptionKey),
            });
          });
        } else {
          if (Array.isArray(action.payload)) {
            action.payload.map((item: PrepareErrorMessagePayload) => {
              notificationsStore.addNotification({
                variant: AlertVariant.danger,
                dismissable: true,
                ...prepareErrorMessage(item, middlewareOptions.errorTitleKey, middlewareOptions.errorDescriptionKey),
              });
            });
          } else {
            notificationsStore.addNotification({
              variant: AlertVariant.danger,
              dismissable: true,
              ...prepareErrorMessage(action.payload, middlewareOptions.errorTitleKey, middlewareOptions.errorDescriptionKey),
            });
          }
        }
      }
    }

    next(action);
  };

  return middleware;
};

export default createNotificationsMiddleware;
