import { CLOUD_VENDOR, REDHAT_VENDOR } from '../../utilities/constants';
import filterTypes, { filterVendorTypes } from '../../utilities/filterTypes';

describe('filterTypes', () => {
  it('filters types that does not have any schema', () => {
    const sourceTypes = [
      { schema: { authentication: [{ type: 'password' }], endpoint: { title: 'endpoint setup' } } },
      { schema: { authentication: [{ type: 'password' }] } },
      {}, // remove
    ];

    expect(sourceTypes.filter(filterTypes)).toEqual([
      { schema: { authentication: [{ type: 'password' }], endpoint: { title: 'endpoint setup' } } },
      { schema: { authentication: [{ type: 'password' }] } },
    ]);
  });

  describe('vendor filter', () => {
    const sourceTypesVendors = [
      { id: '1', name: 'azure', vendor: 'Microsoft' },
      { id: '2', name: 'aws', vendor: 'amazon' },
      { id: '3', name: 'openshift', vendor: 'Red Hat' },
      { id: '4', name: 'vmware', vendor: 'vmware' },
      { id: '5', name: 'ansible-tower', vendor: 'Red Hat' },
      { id: '6', name: 'satellite', vendor: 'Red Hat' },
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

    it('filters RED HAT source types and show hidden', () => {
      expect(sourceTypesVendors.filter(filterVendorTypes(REDHAT_VENDOR, true))).toEqual([
        { id: '3', name: 'openshift', vendor: 'Red Hat' },
        { id: '5', name: 'ansible-tower', vendor: 'Red Hat' },
        { id: '6', name: 'satellite', vendor: 'Red Hat' },
      ]);
    });
  });
});
