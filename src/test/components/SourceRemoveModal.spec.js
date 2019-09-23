import React from 'react';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import { Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Text, Button } from '@patternfly/react-core';
import { MemoryRouter } from 'react-router-dom';
import * as redux from 'redux';

import * as actions from '../../redux/actions/providers';
import SourceRemoveModal from '../../components/SourceRemoveModal';
import { componentWrapperIntl } from '../../Utilities/testsHelpers';
import { sourcesDataGraphQl } from '../sourcesData';
import { applicationTypesData } from '../applicationTypesData';

describe('SourceRemoveModal', () => {
    const middlewares = [thunk, notificationsMiddleware()];
    let mockStore;
    let store;

    beforeEach(() => {
        mockStore = configureStore(middlewares);
        store = mockStore({
            providers: { entities: sourcesDataGraphQl, appTypes: applicationTypesData.data }
        });
    });

    describe('source with no application', () => {
        it('renders correctly', () => {
            const wrapper = mount(componentWrapperIntl(
                <Route path="/remove/:id" render={ (...args) => <SourceRemoveModal { ...args } /> } />,
                store,
                ['/remove/14'])
            );

            expect(wrapper.find('input')).toHaveLength(1); // checkbox
            expect(wrapper.find(Button)).toHaveLength(3); // cancel modal, cancel delete, delete
            expect(wrapper.find('button[id="deleteSubmit"]').props().disabled).toEqual(true); // delete is disabled
        });

        it('enables submit button', () => {
            const wrapper = mount(componentWrapperIntl(
                <Route path="/remove/:id" render={ (...args) => <SourceRemoveModal { ...args } /> } />,
                store,
                ['/remove/14'])
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
                ['/remove/14'])
            );

            wrapper.find('input').simulate('change', { target: { checked: true } }); // click on checkbox
            wrapper.update();

            wrapper.find('button[id="deleteSubmit"]').simulate('click');

            const source = sourcesDataGraphQl.find((s) => s.id === '14');

            expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/'); // modal was closed
            expect(actions.removeSource).toHaveBeenCalledWith('14', `${source.name} was deleted successfully.`); // calls removeSource with id of the source and right message
        });
    });

    describe('source with applications', () => {
        it('renders correctly', () => {
            const wrapper = mount(componentWrapperIntl(
                <Route path="/remove/:id" render={ (...args) => <SourceRemoveModal { ...args } /> } />,
                store,
                ['/remove/406'])
            );

            const source = sourcesDataGraphQl.find((s) => s.id === '406');
            const application = applicationTypesData.data.find((app) => app.id === source.applications[0].application_type_id);

            expect(wrapper.find('input')).toHaveLength(0); // checkbox
            expect(wrapper.find(Button)).toHaveLength(3); // cancel modal, cancel delete, connected apps
            expect(wrapper.find(Text).at(2).text().includes(application.display_name)).toEqual(true); // application in the list
        });

        it('clicks on connected apps', () => {
            const wrapper = mount(componentWrapperIntl(
                <Route path="/remove/:id" render={ (...args) => <SourceRemoveModal { ...args } /> } />,
                store,
                ['/remove/406'])
            );

            wrapper.find(Button).at(1).simulate('click'); // Click on redirect

            expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/manage_apps/406');
        });
    });
});
