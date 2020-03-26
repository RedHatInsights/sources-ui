import { MockFieldProvider } from '../../__mocks__/helpers';
import EditField from '../../../components/EditField/EditField';
import { FormGroup } from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';

describe('Edit field', () => {
    let initialProps;

    const NAME = 'name1234';
    const VALUE = 'password';

    const SPACE_CODE = 32;

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

    it('calls setEdit with field name by pressing space', () => {
        const setEdit = jest.fn();

        const wrapper = mount(<EditField
            {...initialProps}
            setEdit={setEdit}
        />);

        const event = {
            charCode: SPACE_CODE,
            preventDefault: jest.fn()
        };

        wrapper.find(FormGroup).simulate('keypress', event);

        expect(setEdit).toHaveBeenCalledWith(NAME);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('do not call setEdit with field name by pressing different key than space', () => {
        const setEdit = jest.fn();

        const wrapper = mount(<EditField
            {...initialProps}
            setEdit={setEdit}
        />);

        const event = {
            charCode: 31,
            preventDefault: jest.fn()
        };

        wrapper.find(FormGroup).simulate('keypress', event);

        expect(setEdit).not.toHaveBeenCalled();
        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('do nothing when setEdit is not set', () => {
        const wrapper = mount(<EditField
            {...initialProps}
            setEdit={undefined}
        />);

        const event = {
            charCode: SPACE_CODE,
            preventDefault: jest.fn()
        };

        wrapper.find(FormGroup).simulate('keypress', event);

        expect(event.preventDefault).not.toHaveBeenCalled();
    });
});
