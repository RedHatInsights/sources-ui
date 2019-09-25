import React from 'react';
import { mount } from 'enzyme';
import { Modal, Button } from '@patternfly/react-core';
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

    beforeEach(() => {
        mockStore = configureStore();
        store = mockStore();
        spyOnCancel = jest.fn();
        initialProps = {
            app: {
                id: APP_ID,
                display_name: 'Catalog'
            },
            onCancel: spyOnCancel,
            sourceId: SOURCE_ID
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
