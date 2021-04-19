import { CLOUD_VENDOR, REDHAT_VENDOR, TOPOLOGY_INV_NAME } from './constants';

const filterApps = (type) => type.name !== TOPOLOGY_INV_NAME;

export const filterVendorAppTypes = (sourceTypes, activeVendor) => ({ supported_source_types }) =>
  supported_source_types.find((type) =>
    activeVendor === CLOUD_VENDOR
      ? (sourceTypes.find(({ name }) => type === name)?.vendor || REDHAT_VENDOR) !== REDHAT_VENDOR
      : sourceTypes.find(({ name }) => type === name)?.vendor === REDHAT_VENDOR
  );

export default filterApps;
