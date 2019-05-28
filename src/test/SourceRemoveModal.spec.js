import React from 'react';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import * as actions from '../redux/actions/providers';
import * as redux from 'redux';

import SourceRemoveModal from '../components/SourceRemoveModal';
import { componentWrapperIntl } from '../Utilities/testsHelpers';

describe('SourceRemoveModal', () => {
    const middlewares = [thunk, notificationsMiddleware()];
    let mockStore;
    let store;

    beforeEach(() => {
        mockStore = configureStore(middlewares);
        store = mockStore({
            providers: { loaded: true, rows: [], entities: [{ id: '15', name: 'Source' }], numberOfEntities: 1 }
        });
    });

    it('renders correctly', () => {
        const wrapper = mount(componentWrapperIntl(
            <Route path="/remove/:id" render={ (...args) => <SourceRemoveModal { ...args } /> } />,
            store,
            ['/remove/15'])
        );

        expect(wrapper.find('input')).toHaveLength(1); // checkbox
        expect(wrapper.find('button')).toHaveLength(3); // cancel modal, cancel delete, delete
        expect(wrapper.find('button[id="deleteSubmit"]').props().disabled).toEqual(true); // delete is disabled
    });

    it('enables submit button', () => {
        const wrapper = mount(componentWrapperIntl(
            <Route path="/remove/:id" render={ (...args) => <SourceRemoveModal { ...args } /> } />,
            store,
            ['/remove/15'])
        );

        expect(wrapper.find('button[id="deleteSubmit"]').props().disabled).toEqual(true); // delete is disabled

        wrapper.find('input').simulate('change', { target: { checked: true } }); // click on checkbox
        wrapper.update();

        expect(wrapper.find('button[id="deleteSubmit"]').props().disabled).toEqual(false); // delete is enabled
    });

    it('calls submit action', () => {
        redux.bindActionCreators = jest.fn(x => x);
        actions.removeSource = jest.fn(() => new Promise(() => ({})));

        const wrapper = mount(componentWrapperIntl(
            <Route path="/remove/:id" render={ (...args) => <SourceRemoveModal { ...args } /> } />,
            store,
            ['/remove/15'])
        );

        wrapper.find('input').simulate('change', { target: { checked: true } }); // click on checkbox
        wrapper.update();

        wrapper.find('button[id="deleteSubmit"]').simulate('click');

        expect(actions.removeSource).toHaveBeenCalledWith('15', 'Source was deleted successfully.'); // calls removeSource with id of the source and right message
    });
});
