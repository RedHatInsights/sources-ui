export const SATELLITE_NAME = 'satellite';
export const ANSIBLE_TOWER_NAME = 'ansible-tower';
export const REDHAT_VENDOR = 'Red Hat';
export const CLOUD_VENDOR = 'Cloud';
export const CLOUD_VENDORS = ['Amazon', 'Azure', 'Google'];
export const TOPOLOGY_INV_NAME = '/insights/platform/topological-inventory';

export const getActiveVendor = () => new URLSearchParams(window.location.search).get('activeVendor');
