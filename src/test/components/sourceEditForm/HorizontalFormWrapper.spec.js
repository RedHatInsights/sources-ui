import HorizontalFormWrapper from '../../../components/SourceEditForm/HorizontalFormWrapper';
import { Form } from '@patternfly/react-core';

describe('horizontal form wrapper', () => {
    it('renders horizontal form', () => {
        const wrapper = mount(<HorizontalFormWrapper />);

        expect(wrapper.find(Form).props().isHorizontal).toEqual(true);
    });

    it('calls preventDefault on submit', () => {
        const wrapper = mount(<HorizontalFormWrapper />);

        const mockEvent = {
            preventDefault: jest.fn()
        };

        wrapper.find(Form).props().onSubmit(mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
});
