import { CLOUD_VENDOR, REDHAT_VENDOR } from '../../utilities/constants';
import filterTypes, { filterVendorTypes } from '../../utilities/filterTypes';

describe('filterTypes', () => {
  it('filters types that does not have any endpoint or authentication', () => {
    const sourceTypes = [
      { schema: { endpoint: { title: 'endpoint setup' } } }, // remove
      { schema: { authentication: [{ type: 'password' }], endpoint: { title: 'endpoint setup' } } },
      { schema: { authentication: [{ type: 'password' }] } }, // remove,
      {}, // remove
    ];

    expect(sourceTypes.filter(filterTypes)).toEqual([
      { schema: { authentication: [{ type: 'password' }], endpoint: { title: 'endpoint setup' } } },
    ]);
  });

  describe('vendor filter', () => {
    const sourceTypesVendors = [
      { id: '1', name: 'azure', vendor: 'Microsoft' },
      { id: '2', name: 'aws', vendor: 'amazon' },
      { id: '3', name: 'openshift', vendor: 'Red Hat' },
      { id: '4', name: 'vmware', vendor: 'vmware' },
    ];

    it('filters CLOUD source types', () => {
      expect(sourceTypesVendors.filter(filterVendorTypes(CLOUD_VENDOR))).toEqual([
        { id: '1', name: 'azure', vendor: 'Microsoft' },
        { id: '2', name: 'aws', vendor: 'amazon' },
        { id: '4', name: 'vmware', vendor: 'vmware' },
      ]);
    });

    it('filters RED HAT source types', () => {
      expect(sourceTypesVendors.filter(filterVendorTypes(REDHAT_VENDOR))).toEqual([
        { id: '3', name: 'openshift', vendor: 'Red Hat' },
      ]);
    });
  });
});
