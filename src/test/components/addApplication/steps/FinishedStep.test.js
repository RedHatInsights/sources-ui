import { FormattedMessage } from 'react-intl';
import { Button, EmptyStateSecondaryActions, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';

import { componentWrapperIntl } from '../../../../utilities/testsHelpers';
import FinishedStepAttach from '../../../../components/AddApplication/steps/FinishedStep';

describe('AddApplication wizard - Finished step', () => {
    let initialProps;
    let goToSources;
    let onReset;
    let progressStep;
    let progressTexts;

    beforeEach(() => {
        goToSources = jest.fn();
        onReset = jest.fn();
        progressTexts = ['Progress step', 'Progress step 2', 'Progress step 3'];
        progressStep = 1;

        initialProps = {
            goToSources,
            onReset,
            progressStep,
            progressTexts
        };
    });

    it('renders correctly', () => {
        const wrapper = mount(componentWrapperIntl(<FinishedStepAttach {...initialProps}/>));

        expect(wrapper.find(FormattedMessage)).toHaveLength(4);
        expect(wrapper.find(Title)).toHaveLength(1);
        expect(wrapper.find(EmptyStateBody)).toHaveLength(1);
        expect(wrapper.find(EmptyStateIcon)).toHaveLength(1);
        expect(wrapper.find(EmptyStateSecondaryActions)).toHaveLength(1);
        expect(wrapper.find(Button)).toHaveLength(2);
        expect(wrapper.find(EmptyStateSecondaryActions)).toHaveLength(1);
    });

    it('resets wizard', () => {
        const wrapper = mount(componentWrapperIntl(<FinishedStepAttach {...initialProps}/>));

        wrapper.find(Button).last().simulate('click');

        expect(onReset).toHaveBeenCalled();
    });

    it('closes wizard', () => {
        const wrapper = mount(componentWrapperIntl(<FinishedStepAttach {...initialProps}/>));

        wrapper.find(Button).first().simulate('click');

        expect(goToSources).toHaveBeenCalled();
    });
});
