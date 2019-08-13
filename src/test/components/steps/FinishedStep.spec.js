import React from 'react';
import { mount } from 'enzyme';
import { EmptyStateIcon, Title, EmptyStateBody, Button, EmptyStateSecondaryActions, Badge } from '@patternfly/react-core';
import { IntlProvider } from 'react-intl';
import FinishedStep from '../../../components/steps/FinishedStep';

describe('FinishedStep', () => {
    let spyOnClose;
    let initialProps;

    beforeEach(() => {
        spyOnClose = jest.fn();
        initialProps = {
            title: 'This is a title',
            successfulMessage: 'This is a message',
            onClose: spyOnClose
        };
    });

    afterEach(() => {
        spyOnClose.mockReset();
    });

    it('renders correctly', () => {
        const wrapper = mount(<IntlProvider locale='en'><FinishedStep {...initialProps}/></IntlProvider>);

        expect(wrapper.find(Title).text()).toEqual(initialProps.title);
        expect(wrapper.find(EmptyStateBody).text()).toEqual(initialProps.successfulMessage);
        expect(wrapper.find(EmptyStateIcon).length).toEqual(1);
        expect(wrapper.find(EmptyStateSecondaryActions).length).toEqual(0);
    });

    it('renders correctly with secondary action', () => {
        initialProps = {
            ...initialProps,
            secondaryActions: <Badge>Secondary badge</Badge>
        };
        const wrapper = mount(<IntlProvider locale='en'><FinishedStep {...initialProps}/></IntlProvider>);

        expect(wrapper.find(Title).text()).toEqual(initialProps.title);
        expect(wrapper.find(EmptyStateBody).text()).toEqual(initialProps.successfulMessage);
        expect(wrapper.find(EmptyStateIcon).length).toEqual(1);
        expect(wrapper.find(EmptyStateSecondaryActions).length).toEqual(1);
        expect(wrapper.find(Badge).length).toEqual(1);
    });

    it('calls function', () => {
        const wrapper = mount(<IntlProvider locale='en'><FinishedStep {...initialProps}/></IntlProvider>);
        wrapper.find(Button).simulate('click');

        expect(spyOnClose).toHaveBeenCalled();
    });
});
