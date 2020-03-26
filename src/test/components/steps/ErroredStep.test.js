import React from 'react';
import { mount } from 'enzyme';
import { EmptyStateIcon, Title, EmptyStateBody, Button } from '@patternfly/react-core';
import { IntlProvider } from 'react-intl';
import ErroredStep from '../../../components/steps/ErroredStep';

describe('ErroredStep', () => {
    let spyOnClose;
    let spyOnRetry;
    let initialProps;

    beforeEach(() => {
        spyOnClose = jest.fn();
        spyOnRetry = jest.fn();
        initialProps = {
            title: 'This is a title',
            message: 'This is a message',
            onClose: spyOnClose,
            onRetry: spyOnRetry
        };
    });

    afterEach(() => {
        spyOnClose.mockReset();
        spyOnRetry.mockReset();
    });

    it('renders correctly', () => {
        const wrapper = mount(<IntlProvider locale='en'><ErroredStep {...initialProps}/></IntlProvider>);

        expect(wrapper.find(Title).text()).toEqual(initialProps.title);
        expect(wrapper.find(EmptyStateBody).text()).toEqual(initialProps.message);
        expect(wrapper.find(EmptyStateIcon).length).toEqual(1);
        expect(wrapper.find(Button).length).toEqual(2);
    });

    it('renders correctly without onRetry', () => {
        const wrapper = mount(<IntlProvider locale='en'><ErroredStep {...initialProps} onRetry={undefined}/></IntlProvider>);

        expect(wrapper.find(Title).text()).toEqual(initialProps.title);
        expect(wrapper.find(EmptyStateBody).text()).toEqual(initialProps.message);
        expect(wrapper.find(EmptyStateIcon).length).toEqual(1);
        expect(wrapper.find(Button).length).toEqual(1);
    });

    it('calls onClose function', () => {
        const wrapper = mount(<IntlProvider locale='en'><ErroredStep {...initialProps}/></IntlProvider>);
        wrapper.find(Button).at(0).simulate('click');

        expect(spyOnClose).toHaveBeenCalled();
        expect(spyOnRetry).not.toHaveBeenCalled();
    });

    it('calls onRetry function', () => {
        const wrapper = mount(<IntlProvider locale='en'><ErroredStep {...initialProps}/></IntlProvider>);
        wrapper.find(Button).at(1).simulate('click');

        expect(spyOnClose).not.toHaveBeenCalled();
        expect(spyOnRetry).toHaveBeenCalled();
    });
});
