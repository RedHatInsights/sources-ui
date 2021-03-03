import { CLOUD_VENDOR, REDHAT_VENDOR } from '../../../utilities/constants';
import { compileAllApplicationComboOptions } from '../../../addSourceWizard/addSourceWizard/compileAllApplicationComboOptions';
import { NO_APPLICATION_VALUE } from '../../../addSourceWizard/utilities/stringConstants';

describe('compileAllApplicationComboOptions', () => {
  let tmpLocation;

  const mockAppTypes = [{ name: 'app', display_name: 'Application', id: '1' }];

  const INTl = { formatMessage: ({ defaultMessage }) => defaultMessage };

  beforeEach(() => {
    tmpLocation = Object.assign({}, window.location);

    delete window.location;

    window.location = {};
  });

  afterEach(() => {
    window.location = tmpLocation;
  });

  it('cloud type selection - has none application', () => {
    window.location.search = `activeVendor=${CLOUD_VENDOR}`;

    expect(compileAllApplicationComboOptions(mockAppTypes, INTl)).toEqual([
      { label: 'Application', value: '1', description: undefined },
      { label: 'No application', value: NO_APPLICATION_VALUE },
    ]);
  });

  it('red hat type selection - is none', () => {
    window.location.search = `activeVendor=${REDHAT_VENDOR}`;

    expect(compileAllApplicationComboOptions(mockAppTypes, INTl)).toEqual([
      { label: 'Application', value: '1', description: undefined },
    ]);
  });
});
