import { FormattedMessage } from 'react-intl';
import { Text, Button } from '@patternfly/react-core';

import { componentWrapperIntl } from '../../../../utilities/testsHelpers';
import ErroredStepAttach from '../../../../components/AddApplication/steps/ErroredStep';
import ErroredStep from '../../../../components/steps/ErroredStep';

describe('AddApplication wizard - ErroredStep', () => {
    let initialProps;
    let goToSources;
    let setState;
    let error;

    beforeEach(() => {
        goToSources = jest.fn();
        setState = jest.fn();
        error = 'Some error';

        initialProps = {
            goToSources,
            setState,
            error
        };
    });

    afterEach(() => {
        goToSources.mockReset();
        setState.mockReset();
    });

    it('renders correctly', () => {
        const wrapper = mount(componentWrapperIntl(<ErroredStepAttach {...initialProps}/>));

        expect(wrapper.find(ErroredStep)).toHaveLength(1);
        expect(wrapper.find(FormattedMessage)).toHaveLength(4);
        expect(wrapper.find(Text).text().includes(error)).toEqual(true);
        expect(wrapper.find(Button)).toHaveLength(2);
    });

    it('resets wizard', () => {
        const wrapper = mount(componentWrapperIntl(<ErroredStepAttach {...initialProps}/>));

        wrapper.find(Button).last().simulate('click');

        expect(setState).toHaveBeenCalledWith({ state: 'wizard' });
    });
});
