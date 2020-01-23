import React from 'react';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import { Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Text, Button } from '@patternfly/react-core';
import { MemoryRouter } from 'react-router-dom';

import * as actions from '../../redux/sources/actions';
import SourceRemoveModal from '../../components/SourceRemoveModal';
import { componentWrapperIntl } from '../../Utilities/testsHelpers';
import { sourcesDataGraphQl } from '../sourcesData';
import { applicationTypesData } from '../applicationTypesData';
import RemoveAppModal from '../../components/AddApplication/RemoveAppModal';
import ApplicationList from '../../components/ApplicationsList/ApplicationList';
import RedirectNoId from '../../components/RedirectNoId/RedirectNoId';

describe('SourceRemoveModal', () => {
    const middlewares = [thunk, notificationsMiddleware()];
    let mockStore;
    let store;

    beforeEach(() => {
        mockStore = configureStore(middlewares);
        store = mockStore({
            sources: { entities: sourcesDataGraphQl, appTypes: applicationTypesData.data }
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

        it('renders redirect app when no source', () => {
            store = mockStore({
                sources: { entities: [], appTypes: applicationTypesData.data }
            });

            const wrapper = mount(componentWrapperIntl(
                <Route path="/remove/:id" render={ (...args) => <SourceRemoveModal { ...args } /> } />,
                store,
                ['/remove/14'])
            );

            expect(wrapper.find(RedirectNoId)).toHaveLength(1);
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
            actions.removeSource = jest.fn().mockImplementation(() => ({ type: 'REMOVE' }));

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
        const CONNECTED_APPS_BUTTON = 1;
        const APP_REMOVE_BUTTON = 2;

        it('renders correctly', () => {
            const wrapper = mount(componentWrapperIntl(
                <Route path="/remove/:id" render={ (...args) => <SourceRemoveModal { ...args } /> } />,
                store,
                ['/remove/406'])
            );

            const source = sourcesDataGraphQl.find((s) => s.id === '406');
            const application = applicationTypesData.data.find((app) => app.id === source.applications[0].application_type_id);

            expect(wrapper.find('input')).toHaveLength(0); // checkbox
            expect(wrapper.find(Button)).toHaveLength(4); // cancel modal, cancel delete, connected apps, remove the app
            expect(wrapper.find(Text).at(2).text().includes(application.display_name)).toEqual(true); // application in the list
            expect(wrapper.find(ApplicationList)).toHaveLength(1);
        });

        it('clicks on connected apps', () => {
            const wrapper = mount(componentWrapperIntl(
                <Route path="/remove/:id" render={ (...args) => <SourceRemoveModal { ...args } /> } />,
                store,
                ['/remove/406'])
            );

            wrapper.find(Button).at(CONNECTED_APPS_BUTTON).simulate('click'); // Click on redirect

            expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/manage_apps/406');
        });

        it('click on remove app and close it', () => {
            const REMOVE_APP_CLOSE_BUTTON = 1;
            const wrapper = mount(componentWrapperIntl(
                <Route path="/remove/:id" render={ (...args) => <SourceRemoveModal { ...args } /> } />,
                store,
                ['/remove/406'])
            );

            expect(wrapper.find(RemoveAppModal)).toHaveLength(0);
            wrapper.find(Button).at(APP_REMOVE_BUTTON).simulate('click'); // Click on redirect
            wrapper.update();

            expect(wrapper.find(RemoveAppModal)).toHaveLength(1);

            wrapper.find(Button).at(REMOVE_APP_CLOSE_BUTTON).simulate('click'); // Click on redirect
            wrapper.update();
            expect(wrapper.find(RemoveAppModal)).toHaveLength(0);
        });

        it('renders correctly when app is being deleted', () => {
            const APPS_BEING_REMOVED_MSG = 'Connected applications are being removed.';
            store = mockStore({
                sources: { entities: [{
                    ...sourcesDataGraphQl.find((s) => s.id === '406'),
                    applications: [{
                        ...sourcesDataGraphQl.find((s) => s.id === '406').applications,
                        isDeleting: true
                    }]
                }
                ], appTypes: applicationTypesData.data }
            });

            const wrapper = mount(componentWrapperIntl(
                <Route path="/remove/:id" render={ (...args) => <SourceRemoveModal { ...args } /> } />,
                store,
                ['/remove/406'])
            );

            expect(wrapper.find(ApplicationList)).toHaveLength(0);
            expect(wrapper.find(Text).at(2).html().includes(APPS_BEING_REMOVED_MSG)).toEqual(true);
        });
    });
});
