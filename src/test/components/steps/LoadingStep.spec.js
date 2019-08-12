import React from 'react';
import { mount } from 'enzyme';
import { EmptyStateBody, Button } from '@patternfly/react-core';
import { IntlProvider } from 'react-intl';
import { Spinner } from '@redhat-cloud-services/frontend-components';

import LoadingStep from '../../../components/steps/LoadingStep';

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
});
