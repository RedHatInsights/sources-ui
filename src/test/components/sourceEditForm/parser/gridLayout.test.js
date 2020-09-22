import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import TextField from '@data-driven-forms/pf4-component-mapper/dist/cjs/text-field';

import SourcesFormRenderer from '../../../../utilities/SourcesFormRenderer';
import GridLayout from '../../../../components/SourceEditForm/parser/GridLayout';
import AuthenticationId from '../../../../components/SourceEditForm/parser/AuthenticationId';

import { componentWrapperIntl } from '../../../../utilities/testsHelpers';

describe('EditAlert', () => {
    it('renders correctly', () => {
        const wrapper = mount(componentWrapperIntl(<SourcesFormRenderer
            onSubmit={jest.fn()}
            schema={{
                fields: [{
                    component: 'description',
                    name: 'alert',
                    Content: GridLayout,
                    id: '1234',
                    fields: [{
                        component: componentTypes.TEXT_FIELD,
                        name: 'some-field'
                    }]
                }]
            }}
        />));

        expect(wrapper.find(AuthenticationId).props().id).toEqual('1234');
        expect(wrapper.find(TextField)).toHaveLength(1);
    });
});
