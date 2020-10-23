import { componentWrapperIntl } from '../../../../utilities/testsHelpers';
import AuthenticationId from '../../../../components/SourceEditForm/parser/AuthenticationId';

import { FormGroup } from '@patternfly/react-core/dist/js/components/Form/FormGroup';

describe('AuthenticationID', () => {
  it('renders correctly', () => {
    const wrapper = mount(componentWrapperIntl(<AuthenticationId id="some-id" />));

    expect(wrapper.find(FormGroup)).toHaveLength(1);
    expect(wrapper.find(FormGroup).text()).toEqual('Authentication ID some-id');
  });
});
