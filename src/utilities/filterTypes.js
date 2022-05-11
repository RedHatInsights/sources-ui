import { ANSIBLE_TOWER_NAME, SATELLITE_NAME } from './constants';

const filterTypes = (type) => type.schema;

const hiddenTypes = [SATELLITE_NAME, ANSIBLE_TOWER_NAME];

export const filterVendorTypes =
  (activeCategory, showHidden) =>
  ({ category, name }) => {
    if (showHidden) {
      return category === activeCategory;
    } else {
      return category === activeCategory && !hiddenTypes.includes(name);
    }
  };

export default filterTypes;
