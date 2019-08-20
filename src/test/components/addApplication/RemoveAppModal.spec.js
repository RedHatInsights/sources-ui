import React from 'react';
import { mount } from 'enzyme';
import { Modal, Button } from '@patternfly/react-core';
import configureStore from 'redux-mock-store';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { Provider } from 'react-redux';
import * as redux from 'redux';

import RemoveAppModal from '../../../components/AddApplication/RemoveAppModal';
import * as actions from '../../../redux/actions/providers';
import * as entities from '../../../api/entities';
import LoadingStep from '../../../components/steps/LoadingStep';

describe('RemoveAppModal', () => {
    let store;
    let mockStore;
    let initialProps;
    let spyOnCancel;

    beforeEach(() => {
        mockStore = configureStore();
        store = mockStore();
        spyOnCancel = jest.fn();
        initialProps = {
            app: {
                id: '187894151315',
                display_name: 'Catalog'
            },
            onCancel: spyOnCancel
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

    it('calls a submit, show loading step and calls cancel', (done) => {
        redux.bindActionCreators = jest.fn(x => x);
        entities.doDeleteApplication = jest.fn(() => new Promise((resolve) => resolve('OK')));
        actions.loadEntities = jest.fn(() => new Promise((resolve) => resolve('OK')));
        actions.addMessage = jest.fn();

        const wrapper = mount(
            <IntlProvider locale="en">
                <Provider store={ store }>
                    <RemoveAppModal {...initialProps} />
                </Provider>
            </IntlProvider>
        );

        wrapper.find(Button).at(1).simulate('click');

        expect(entities.doDeleteApplication).toHaveBeenCalledWith('187894151315');
        expect(spyOnCancel).not.toHaveBeenCalled();
        expect(actions.addMessage).not.toHaveBeenCalled();
        wrapper.update();
        expect(wrapper.find(LoadingStep).length).toEqual(1);

        setImmediate(() => {
            expect(actions.addMessage).toHaveBeenCalledWith(expect.any(String), 'success');
            expect(spyOnCancel).toHaveBeenCalled();
            done();
        });
    });

    it('calls a submit, show error message', (done) => {
        const message = 'Something went terribly wrong';
        redux.bindActionCreators = jest.fn(x => x);
        entities.doDeleteApplication = jest.fn(() => new Promise((resolve, reject) => reject({
            data: {
                errors: [{
                    detail: message
                }]
            }
        })));
        actions.addMessage = jest.fn();

        const wrapper = mount(
            <IntlProvider locale="en">
                <Provider store={ store }>
                    <RemoveAppModal {...initialProps} />
                </Provider>
            </IntlProvider>
        );

        wrapper.find(Button).at(1).simulate('click');

        expect(entities.doDeleteApplication).toHaveBeenCalledWith('187894151315');
        expect(spyOnCancel).not.toHaveBeenCalled();
        expect(actions.addMessage).not.toHaveBeenCalled();

        setImmediate(() => {
            wrapper.update();
            expect(actions.addMessage).toHaveBeenCalledWith(expect.any(String), 'danger', message);
            expect(spyOnCancel).toHaveBeenCalled();
            done();
        });
    });
});
