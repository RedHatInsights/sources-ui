import React from 'react';
import { mount } from 'enzyme';
import { Modal, Button, Text } from '@patternfly/react-core';
import configureStore from 'redux-mock-store';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { Provider } from 'react-redux';
import * as redux from 'redux';

import RemoveAppModal from '../../../components/AddApplication/RemoveAppModal';
import * as actions from '../../../redux/actions/providers';

describe('RemoveAppModal', () => {
    let store;
    let mockStore;
    let initialProps;
    let spyOnCancel;

    const APP_ID = '187894151315';
    const SOURCE_ID = '15';
    const SUCCESS_MSG = expect.any(String);
    const ERROR_MSG = expect.any(String);

    const APP1 = 'APP_1';
    const APP2 = 'APP_2';
    const APP1_DISPLAY_NAME = 'APP_1';
    const APP2_DISPLAY_NAME = 'APP_2';
    const DEPENDENT_APPS = [APP1, APP2];

    const APP_TYPES = [
        { name: APP1, display_name: APP1_DISPLAY_NAME },
        { name: APP2, display_name: APP2_DISPLAY_NAME }
    ];

    beforeEach(() => {
        mockStore = configureStore();
        store = mockStore();
        spyOnCancel = jest.fn();
        initialProps = {
            app: {
                id: APP_ID,
                display_name: 'Catalog',
                dependent_applications: []
            },
            onCancel: spyOnCancel,
            sourceId: SOURCE_ID,
            appTypes: []
        };
    });

    afterEach(() => {
        spyOnCancel.mockReset();
    });

    it('renders correctly', () => {
        const wrapper = mount(
            <IntlProvider locale="en">
                <Provider store={ store }>
                    <RemoveAppModal {...initialProps} />
                </Provider>
            </IntlProvider>
        );

        expect(wrapper.find(Modal).length).toEqual(1);
        expect(wrapper.find(Button).length).toEqual(3); // modal cancel, remove, cancel
        expect(wrapper.find(FormattedMessage).length).toEqual(3);
        expect(wrapper.find(Button).at(1).text()).toEqual('Remove');
        expect(wrapper.find(Button).last().text()).toEqual('Cancel');
    });

    it('renders correctly with attached dependent applications', () => {
        const ATTACHED_APPS = [APP1_DISPLAY_NAME, APP2_DISPLAY_NAME];
        const app = {
            ...initialProps.app,
            dependent_applications: DEPENDENT_APPS,
            sourceAppsNames: ATTACHED_APPS
        };

        const wrapper = mount(
            <IntlProvider locale="en">
                <Provider store={ store }>
                    <RemoveAppModal {...initialProps} app={app} appTypes={APP_TYPES}/>
                </Provider>
            </IntlProvider>
        );

        expect(wrapper.find(Text)).toHaveLength(2);
        expect(wrapper.find(Text).last().html().includes(APP1_DISPLAY_NAME)).toEqual(true);
        expect(wrapper.find(Text).last().html().includes(APP2_DISPLAY_NAME)).toEqual(true);
    });

    it('renders correctly with unattached dependent applications', () => {
        const ATTACHED_APPS = [];
        const app = {
            ...initialProps.app,
            dependent_applications: DEPENDENT_APPS,
            sourceAppsNames: ATTACHED_APPS
        };

        const wrapper = mount(
            <IntlProvider locale="en">
                <Provider store={ store }>
                    <RemoveAppModal {...initialProps} app={app} appTypes={APP_TYPES}/>
                </Provider>
            </IntlProvider>
        );

        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(Text).last().html().includes(APP1_DISPLAY_NAME)).toEqual(false);
        expect(wrapper.find(Text).last().html().includes(APP2_DISPLAY_NAME)).toEqual(false);
    });

    it('calls cancel', () => {
        const wrapper = mount(
            <IntlProvider locale="en">
                <Provider store={ store }>
                    <RemoveAppModal {...initialProps} />
                </Provider>
            </IntlProvider>
        );

        wrapper.find(Button).last().simulate('click');
        expect(spyOnCancel).toHaveBeenCalled();
    });

    it('calls a submit and calls cancel', (done) => {
        redux.bindActionCreators = jest.fn(x => x);
        actions.removeApplication = jest.fn(() => new Promise((resolve) => resolve('OK')));

        const wrapper = mount(
            <IntlProvider locale="en">
                <Provider store={ store }>
                    <RemoveAppModal {...initialProps} />
                </Provider>
            </IntlProvider>
        );

        wrapper.find(Button).at(1).simulate('click');

        expect(actions.removeApplication).toHaveBeenCalledWith(APP_ID, SOURCE_ID, SUCCESS_MSG, ERROR_MSG);
        expect(spyOnCancel).toHaveBeenCalled();
        done();
    });
});
