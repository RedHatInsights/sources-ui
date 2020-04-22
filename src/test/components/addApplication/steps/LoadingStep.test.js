import React from 'react';
import { mount } from 'enzyme';
import { EmptyStateBody, Button, Progress } from '@patternfly/react-core';
import { IntlProvider } from 'react-intl';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner';
import LoadingStep from '../../../../components/AddApplication/steps/LoadingStep';

describe('LoadingStep', () => {
    let spyOnClose;
    let initialProps;

    beforeEach(() => {
        spyOnClose = jest.fn();
        initialProps = {
            customText: 'This is a custom text',
            onClose: spyOnClose
        };
    });

    afterEach(() => {
        spyOnClose.mockReset();
    });

    it('renders correctly', () => {
        const wrapper = mount(<IntlProvider locale='en'><LoadingStep {...initialProps}/></IntlProvider>);

        expect(wrapper.find(EmptyStateBody).text()).toEqual(initialProps.customText);
        expect(wrapper.find(Spinner).length).toEqual(1);
        expect(wrapper.find(Button).length).toEqual(1);
    });

    it('renders without button', () => {
        const wrapper = mount(<IntlProvider locale='en'><LoadingStep {...initialProps} onClose={undefined}/></IntlProvider>);

        expect(wrapper.find(Button).length).toEqual(0);
    });

    it('calls function', () => {
        const wrapper = mount(<IntlProvider locale='en'><LoadingStep {...initialProps}/></IntlProvider>);
        wrapper.find(Button).simulate('click');

        expect(spyOnClose).toHaveBeenCalled();
    });

    it('renders correctly with progress text', () => {
        initialProps = {
            ...initialProps,
            progressTexts: ['ProgressText', 'CurrentText'],
            progressStep: 1
        };

        const wrapper = mount(<IntlProvider locale='en'><LoadingStep {...initialProps}/></IntlProvider>);

        expect(wrapper.find(Spinner).length).toEqual(1);
        expect(wrapper.find(Button).length).toEqual(1);
        expect(wrapper.find(Progress).length).toEqual(1);
        expect(wrapper.find(Progress).props().label).toEqual('CurrentText');
    });
});
