import { CLOUD_VENDOR, REDHAT_VENDOR, TOPOLOGY_INV_NAME } from '../../utilities/constants';
import filterApps, { filterVendorAppTypes } from '../../utilities/filterApps';
import applicationTypes from '../addSourceWizard/helpers/applicationTypes';

describe('filterApps', () => {
  it('filters topology invetory app from app types', () => {
    const appTypes = applicationTypes;

    expect(appTypes.find(({ name }) => name === TOPOLOGY_INV_NAME)).toBeDefined();

    expect(appTypes.filter(filterApps).find(({ name }) => name === TOPOLOGY_INV_NAME)).toBeUndefined();
  });

  describe('vendor filter', () => {
    const sourceTypesVendors = [
      { id: '1', name: 'azure', vendor: 'Microsoft' },
      { id: '2', name: 'aws', vendor: 'amazon' },
      { id: '3', name: 'openshift', vendor: 'Red Hat' },
      { id: '4', name: 'vmware', vendor: 'vmware' },
    ];

    const appTypes = [
      { id: '123', name: 'cost', supported_source_types: ['aws'] },
      { id: '13', name: 'sub watch', supported_source_types: ['azure'] },
      { id: '9089', name: 'topology', supported_source_types: ['openshift', 'vmware'] },
      { id: '1', name: 'remediations', supported_source_types: ['openshift'] },
    ];

    it('filters CLOUD source types', () => {
      expect(appTypes.filter(filterVendorAppTypes(sourceTypesVendors, CLOUD_VENDOR))).toEqual([
        { id: '123', name: 'cost', supported_source_types: ['aws'] },
        { id: '13', name: 'sub watch', supported_source_types: ['azure'] },
        { id: '9089', name: 'topology', supported_source_types: ['openshift', 'vmware'] },
      ]);
    });

    it('filters CLOUD source types when only cloud source types - when type is not, filter the app', () => {
      const onlyCloudTypes = [
        { id: '1', name: 'azure', vendor: 'Microsoft' },
        { id: '2', name: 'aws', vendor: 'amazon' },
        { id: '4', name: 'vmware', vendor: 'vmware' },
      ];

      expect(appTypes.filter(filterVendorAppTypes(onlyCloudTypes, CLOUD_VENDOR))).toEqual([
        { id: '123', name: 'cost', supported_source_types: ['aws'] },
        { id: '13', name: 'sub watch', supported_source_types: ['azure'] },
        { id: '9089', name: 'topology', supported_source_types: ['openshift', 'vmware'] },
      ]);
    });

    it('filters RED HAT source types', () => {
      expect(appTypes.filter(filterVendorAppTypes(sourceTypesVendors, REDHAT_VENDOR))).toEqual([
        { id: '9089', name: 'topology', supported_source_types: ['openshift', 'vmware'] },
        { id: '1', name: 'remediations', supported_source_types: ['openshift'] },
      ]);
    });
  });
});
