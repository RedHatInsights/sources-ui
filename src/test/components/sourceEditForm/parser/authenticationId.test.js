import { componentWrapperIntl } from '../../../../utilities/testsHelpers';
import AuthenticationId from '../../../../components/SourceEditForm/parser/AuthenticationId';

import { FormGroup } from '@patternfly/react-core/dist/js/components/Form/FormGroup';
import { Tooltip } from '@patternfly/react-core/dist/js/components/Tooltip/Tooltip';

describe('AuthenticationID', () => {
    it('renders correctly', () => {
        const wrapper = mount(componentWrapperIntl(<AuthenticationId id="some-id"/>));

        expect(wrapper.find(FormGroup)).toHaveLength(1);
        expect(wrapper.find(Tooltip)).toHaveLength(1);
        expect(wrapper.find(FormGroup).text()).toEqual('Authentication ID some-id');
        expect(wrapper.find(Tooltip).props().content).toEqual('This authentication is not used by any application');
    });
});
