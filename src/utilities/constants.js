export const HCS_NAME = 'hcs';
export const SATELLITE_NAME = 'satellite';
export const ANSIBLE_TOWER_NAME = 'ansible-tower';
export const AZURE_NAME = 'azure';
export const GOOGLE_NAME = 'google';
export const REDHAT_VENDOR = 'Red Hat';
export const CLOUD_VENDOR = 'Cloud';
export const INTEGRATIONS = 'Integrations';
export const COMMUNICATIONS = 'Communications';
export const REPORTING = 'Reporting & automation';
export const WEBHOOKS = 'Webhooks';
export const TOPOLOGY_INV_NAME = '/insights/platform/topological-inventory';
export const REMEDIATIONS_NAME = '/insights/platform/fifi';
export const COST_MANAGEMENT_APP_NAME = '/insights/platform/cost-management';
export const CLOUD_METER_APP_NAME = '/insights/platform/cloud-meter';
export const PROVISIONING_APP_NAME = '/insights/platform/provisioning';
export const CATALOG_APP = '/insights/platform/catalog';
export const OPENSHIFT_NAME = 'openshift';
export const OVERVIEW = 'overview';

export const HCS_APP_NAME = 'Hybrid Committed Spend';
export const COST_MANAGEMENT_APP_ID = '2'; // use only for Cost overwrite to HCS!

export const getActiveCategory = () => new URLSearchParams(window.location.search).get('activeCategory');

export const timeoutedApps = (appTypes) => [
  appTypes.find(({ name }) => name === CLOUD_METER_APP_NAME)?.id,
  appTypes.find(({ name }) => name === COST_MANAGEMENT_APP_NAME)?.id,
];
