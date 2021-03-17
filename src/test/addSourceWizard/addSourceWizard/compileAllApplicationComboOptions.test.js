import { CLOUD_VENDOR, REDHAT_VENDOR } from '../../../utilities/constants';
import { compileAllApplicationComboOptions } from '../../../components/addSourceWizard/compileAllApplicationComboOptions';
import { NO_APPLICATION_VALUE } from '../../../components/addSourceWizard/stringConstants';

describe('compileAllApplicationComboOptions', () => {
  const mockAppTypes = [{ name: 'app', display_name: 'Application', id: '1' }];

  const INTl = { formatMessage: ({ defaultMessage }) => defaultMessage };

  it('cloud type selection - has none application', () => {
    expect(compileAllApplicationComboOptions(mockAppTypes, INTl, CLOUD_VENDOR)).toEqual([
      { label: 'Application', value: '1', description: undefined },
      { label: 'No application', value: NO_APPLICATION_VALUE },
    ]);
  });

  it('red hat type selection - is none', () => {
    expect(compileAllApplicationComboOptions(mockAppTypes, INTl, REDHAT_VENDOR)).toEqual([
      { label: 'Application', value: '1', description: undefined },
    ]);
  });
});
