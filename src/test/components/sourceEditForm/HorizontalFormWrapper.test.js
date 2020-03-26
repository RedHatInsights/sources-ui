import HorizontalFormWrapper from '../../../components/SourceEditForm/HorizontalFormWrapper';
import { Form } from '@patternfly/react-core';

describe('horizontal form wrapper', () => {
    it('renders horizontal form', () => {
        const wrapper = mount(<HorizontalFormWrapper />);

        expect(wrapper.find(Form).props().isHorizontal).toEqual(true);
    });
});
