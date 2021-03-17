import { CLOUD_VENDOR, REDHAT_VENDOR } from './constants';

const filterTypes = (type) => type.schema?.authentication && type.schema?.endpoint;

export const filterVendorTypes = (activeVendor) => ({ vendor, name }) =>
  activeVendor === CLOUD_VENDOR ? vendor !== REDHAT_VENDOR : vendor === REDHAT_VENDOR && name !== 'satellite';

export default filterTypes;
