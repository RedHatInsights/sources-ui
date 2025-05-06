import { NotificationConfig } from '@redhat-cloud-services/frontend-components-notifications';

const notificationsPrefix = '@@INSIGHTS-CORE/NOTIFICATIONS/';
export const ADD_NOTIFICATION = `${notificationsPrefix}ADD_NOTIFICATION`;
export const REMOVE_NOTIFICATION = `${notificationsPrefix}REMOVE_NOTIFICATION`;
export const CLEAR_NOTIFICATIONS = `${notificationsPrefix}CLEAR_NOTIFICATIONS`;

function generateID(type: string): string {
  return 'cloud-services' + type + '-' + new Date().getTime() + Math.random().toString(36).slice(2);
}

export type AddNotificationPayload = Omit<NotificationConfig, 'id'> & { id?: string | number };

export const addNotification = (notification: AddNotificationPayload) => ({
  type: ADD_NOTIFICATION,
  payload: {
    id: generateID('notification'),
    ...notification,
  },
});

export const removeNotification = (index: string | number) => ({
  type: REMOVE_NOTIFICATION,
  payload: index,
});

export const clearNotifications = () => ({
  type: CLEAR_NOTIFICATIONS,
});
