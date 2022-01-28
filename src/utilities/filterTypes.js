import { ANSIBLE_TOWER_NAME, CLOUD_VENDOR, REDHAT_VENDOR, SATELLITE_NAME } from './constants';

const filterTypes = (type) => type.schema;

const hiddenTypes = [SATELLITE_NAME, ANSIBLE_TOWER_NAME];

export const filterVendorTypes =
  (activeVendor, showHidden) =>
  ({ vendor, name }) => {
    if (activeVendor === CLOUD_VENDOR) {
      return vendor !== REDHAT_VENDOR;
    } else {
      if (showHidden) {
        return vendor === REDHAT_VENDOR;
      } else {
        return vendor === REDHAT_VENDOR && !hiddenTypes.includes(name);
      }
    }
  };

export default filterTypes;
