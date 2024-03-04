import { REMEDIATIONS_NAME, TOPOLOGY_INV_NAME } from './constants';

const filterApps = (type) => type.name !== TOPOLOGY_INV_NAME && type.name !== REMEDIATIONS_NAME;

export const filterVendorAppTypes =
  (sourceTypes, category) =>
  ({ supported_source_types }) =>
    supported_source_types.find((type) => sourceTypes.find(({ name }) => type === name)?.category === category);

export default filterApps;
