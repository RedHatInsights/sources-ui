import { FormattedMessage } from 'react-intl';
import { Text, Button, Title, EmptyStateBody, EmptyStateIcon, Progress } from '@patternfly/react-core';

import { componentWrapperIntl } from '../../../../utilities/testsHelpers';
import ErroredStepAttach from '../../../../components/AddApplication/steps/ErroredStep';

describe('AddApplication wizard - ErroredStep', () => {
    let initialProps;
    let goToSources;
    let error;
    let onReset;
    let progressStep;
    let progressTexts;

    beforeEach(() => {
        goToSources = jest.fn();
        error = 'Some error';
        onReset = jest.fn();
        progressTexts = ['Progress step', 'Progress step 2', 'Progress step 3'];
        progressStep = 1;

        initialProps = {
            goToSources,
            error,
            onReset,
            progressStep,
            progressTexts
        };
    });

    it('renders correctly', () => {
        const wrapper = mount(componentWrapperIntl(<ErroredStepAttach {...initialProps}/>));

        expect(wrapper.find(Title)).toHaveLength(1);
        expect(wrapper.find(EmptyStateBody)).toHaveLength(1);
        expect(wrapper.find(EmptyStateIcon)).toHaveLength(1);
        expect(wrapper.find(Button)).toHaveLength(2);
        expect(wrapper.find(FormattedMessage)).toHaveLength(4);
        expect(wrapper.find(Text).text().includes(error)).toEqual(true);
        expect(wrapper.find(Button)).toHaveLength(2);
        expect(wrapper.find(Progress)).toHaveLength(1);
        expect(wrapper.find(Progress).props().label).toEqual('Progress step 2');
    });

    it('resets wizard', () => {
        const wrapper = mount(componentWrapperIntl(<ErroredStepAttach {...initialProps}/>));

        wrapper.find(Button).last().simulate('click');

        expect(onReset).toHaveBeenCalled();
    });

    it('calls onClose function', () => {
        const wrapper = mount(componentWrapperIntl(<ErroredStepAttach {...initialProps}/>));

        wrapper.find(Button).at(0).simulate('click');

        expect(goToSources).toHaveBeenCalled();
        expect(onReset).not.toHaveBeenCalled();
    });
});
