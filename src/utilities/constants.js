export const SATELLITE_NAME = 'satellite';
export const ANSIBLE_TOWER_NAME = 'ansible-tower';
export const AZURE_NAME = 'azure';
export const GOOGLE_NAME = 'google';
export const REDHAT_VENDOR = 'Red Hat';
export const CLOUD_VENDOR = 'Cloud';
export const TOPOLOGY_INV_NAME = '/insights/platform/topological-inventory';
export const COST_MANAGEMENT_APP_NAME = '/insights/platform/cost-management';
export const CLOUD_METER_APP_NAME = '/insights/platform/cloud-meter';
export const CATALOG_APP = '/insights/platform/catalog';
export const OPENSHIFT_NAME = 'openshift';

export const getActiveVendor = () => new URLSearchParams(window.location.search).get('activeVendor');

export const timeoutedApps = (appTypes) => [
  appTypes.find(({ name }) => name === CLOUD_METER_APP_NAME)?.id,
  appTypes.find(({ name }) => name === COST_MANAGEMENT_APP_NAME)?.id,
];
