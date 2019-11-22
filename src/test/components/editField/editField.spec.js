import { MockFieldProvider } from '../../__mocks__/helpers';
import EditField from '../../../components/editField/EditField';
import { FormGroup } from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';

describe('Edit field', () => {
    let initialProps;

    const NAME = 'name1234';
    const VALUE = 'password';

    beforeEach(() => {
        initialProps = {
            FieldProvider: MockFieldProvider,
            input: {
                name: NAME
            }
        };
    });

    it('renders correctly', () => {
        const wrapper = mount(<EditField {...initialProps} />);

        expect(wrapper.find(FormGroup)).toHaveLength(1);
        expect(wrapper.find('span')).toHaveLength(1);
        expect(wrapper.find(PencilAltIcon)).toHaveLength(0);
    });

    it('renders correctly with error', () => {
        const ERROR = 'errror';

        const wrapper = mount(<EditField
            {...initialProps}
            meta={{ error: ERROR, touched: true }}
        />
        );

        expect(wrapper.find(FormGroup).props().isValid).toEqual(false);
        expect(wrapper.find(FormGroup).props().helperTextInvalid).toEqual(ERROR);
    });

    it('renders correctly with value', () => {
        const wrapper = mount(<EditField
            {...initialProps}
            input={{
                ...initialProps.input,
                value: VALUE
            }}
        />);

        expect(wrapper.find('span').text()).toEqual(VALUE);
        expect(wrapper.find(PencilAltIcon)).toHaveLength(0);
    });

    it('renders correctly true', () => {
        const wrapper = mount(<EditField
            {...initialProps}
            input={{
                ...initialProps.input,
                value: true
            }}
        />);

        expect(wrapper.find('span').text()).toEqual('True');
    });

    it('renders correctly false', () => {
        const wrapper = mount(<EditField
            {...initialProps}
            input={{
                ...initialProps.input,
                value: false
            }}
        />);

        expect(wrapper.find('span').text()).toEqual('False');
    });

    it('renders empty - Click to add', () => {
        const wrapper = mount(<EditField
            {...initialProps}
            input={{
                ...initialProps.input,
                value: undefined
            }}
            setEdit={jest.fn()}
        />);

        expect(wrapper.find('span').text().includes('add')).toEqual(true);
    });

    it('renders empty password - Click to edit', () => {
        const wrapper = mount(<EditField
            {...initialProps}
            input={{
                ...initialProps.input,
                value: undefined
            }}
            type="password"
            setEdit={jest.fn()}
        />);

        expect(wrapper.find('span').text().includes('edit')).toEqual(true);
    });

    it('renders empty - no value', () => {
        const wrapper = mount(<EditField
            {...initialProps}
            input={{
                ...initialProps.input,
                value: undefined
            }}
        />);

        expect(wrapper.find('span').text()).toEqual('');
    });

    it('renders editable', () => {
        const wrapper = mount(<EditField
            {...initialProps}
            setEdit={jest.fn()}
        />);

        expect(wrapper.find(PencilAltIcon)).toHaveLength(1);
    });

    it('calls setEdit with field name', () => {
        const setEdit = jest.fn();

        const wrapper = mount(<EditField
            {...initialProps}
            setEdit={setEdit}
        />);

        wrapper.find(FormGroup).simulate('click');

        expect(setEdit).toHaveBeenCalledWith(NAME);
    });
});
