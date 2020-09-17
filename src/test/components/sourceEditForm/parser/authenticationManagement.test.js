import { mount } from 'enzyme';
import { Title } from '@patternfly/react-core';

import AuthenticationManagement from '../../../../components/SourceEditForm/parser/AuthenticationManagement';

describe('AuhtenticationManagement', () => {
    let initialProps;

    beforeEach(() => {
        initialProps = {
            schemaAuth: { name: 'some name' },
        };
    });

    it('renders correctly without assigned app', () => {
        const wrapper = mount(
            <AuthenticationManagement {...initialProps }/>
        );

        expect(wrapper.find(Title).text()).toEqual('some name');
    });
});
