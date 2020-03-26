import { FormattedMessage } from 'react-intl';
import { Button } from '@patternfly/react-core';

import { componentWrapperIntl } from '../../../../utilities/testsHelpers';
import FinishedStepAttach from '../../../../components/AddApplication/steps/FinishedStep';
import FinishedStep from '../../../../components/steps/FinishedStep';

describe('AddApplication wizard - Finished step', () => {
    let initialProps;
    let goToSources;
    let setState;

    beforeEach(() => {
        goToSources = jest.fn();
        setState = jest.fn();

        initialProps = {
            goToSources,
            setState
        };
    });

    afterEach(() => {
        goToSources.mockReset();
        setState.mockReset();
    });

    it('renders correctly', () => {
        const wrapper = mount(componentWrapperIntl(<FinishedStepAttach {...initialProps}/>));

        expect(wrapper.find(FormattedMessage)).toHaveLength(4);
        expect(wrapper.find(FinishedStep)).toHaveLength(1);
        expect(wrapper.find(Button)).toHaveLength(2);
    });

    it('resets wizard', () => {
        const wrapper = mount(componentWrapperIntl(<FinishedStepAttach {...initialProps}/>));

        wrapper.find(Button).last().simulate('click');

        expect(setState).toHaveBeenCalledWith({ state: 'wizard' });
    });
});
