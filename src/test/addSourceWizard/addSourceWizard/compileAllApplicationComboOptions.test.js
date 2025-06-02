import { COST_MANAGEMENT_APP_ID, COST_MANAGEMENT_APP_NAME, HCS_APP_NAME, REDHAT_VENDOR } from '../../../utilities/constants';
import { compileAllApplicationComboOptions } from '../../../components/addSourceWizard/compileAllApplicationComboOptions';
import HybridCommittedSpendDescription from '../../../components/addSourceWizard/descriptions/HybridCommittedSpendDescription';
import { Label } from '@patternfly/react-core';

describe('compileAllApplicationComboOptions', () => {
  const mockAppTypes = [{ name: 'app', display_name: 'Application', id: '1' }];

  const INTl = { formatMessage: ({ defaultMessage }) => defaultMessage };

  it('red hat type selection - is none', () => {
    expect(compileAllApplicationComboOptions(mockAppTypes, INTl, REDHAT_VENDOR)).toEqual([
      { label: 'Application', value: '1', description: undefined },
    ]);
  });

  it('cost type selection - HCS', () => {
    const appTypes = [{ name: COST_MANAGEMENT_APP_NAME, display_name: 'Cost Management', id: COST_MANAGEMENT_APP_ID }];
    expect(compileAllApplicationComboOptions(appTypes, INTl, true)).toEqual([
      {
        description: <HybridCommittedSpendDescription id="2" />,
        label: (
          <span className="src-c-wizard__rhel-mag-label">
            {`${HCS_APP_NAME} `}
            <Label className="pf-v6-u-ml-sm" color="purple">
              Bundle
            </Label>
          </span>
        ),
        value: '2',
      },
    ]);
  });
});
