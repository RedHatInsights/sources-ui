import {
  CLOUD_VENDOR,
  COST_MANAGEMENT_APP_ID,
  COST_MANAGEMENT_APP_NAME,
  HCS_APP_NAME,
  REDHAT_VENDOR,
} from '../../../utilities/constants';
import { compileAllApplicationComboOptions } from '../../../components/addSourceWizard/compileAllApplicationComboOptions';
import { NO_APPLICATION_VALUE } from '../../../components/addSourceWizard/stringConstants';
import HybridCommittedSpendDescription from '../../../components/addSourceWizard/descriptions/HybridCommittedSpendDescription';
import { Label } from '@patternfly/react-core';

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

  it('cost type selection - HCS', () => {
    const appTypes = [{ name: COST_MANAGEMENT_APP_NAME, display_name: 'Cost Management', id: COST_MANAGEMENT_APP_ID }];
    expect(compileAllApplicationComboOptions(appTypes, INTl, CLOUD_VENDOR, true)).toEqual([
      {
        description: <HybridCommittedSpendDescription id="2" />,
        label: (
          <span className="src-c-wizard__rhel-mag-label">
            {`${HCS_APP_NAME} `}
            <Label className="pf-u-ml-sm" color="purple">
              Bundle
            </Label>
          </span>
        ),
        value: '2',
      },
      {
        label: 'No application',
        value: 'no-application',
      },
    ]);
  });
});
