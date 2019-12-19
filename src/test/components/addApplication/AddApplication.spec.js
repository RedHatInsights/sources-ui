import React from 'react';
import { mount } from 'enzyme';
import { Button, EmptyStateBody } from '@patternfly/react-core';
import { Route, MemoryRouter } from 'react-router-dom';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { CardSelect } from '@redhat-cloud-services/frontend-components-sources';
import { act } from 'react-dom/test-utils';

import SourcesFormRenderer from '../../../Utilities/SourcesFormRenderer';
import * as entities from '../../../api/entities';
import AddApplication from '../../../components/AddApplication/AddApplication';
import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import { sourceTypesData, OPENSHIFT_ID } from '../../sourceTypesData';
import { SOURCE_ALL_APS_ID, SOURCE_NO_APS_ID } from '../../sourcesData';
import { applicationTypesData, COSTMANAGEMENT_APP, TOPOLOGICALINVENTORY_APP } from '../../applicationTypesData';
import AddApplicationDescription from '../../../components/AddApplication/AddApplicationDescription';
import LoadingStep from '../../../components/steps/LoadingStep';
import { paths } from '../../../Routes';

describe('AddApplication', () => {
    let store;
    let initialEntry;
    let mockStore;
    const middlewares = [thunk, notificationsMiddleware()];
    const PATH = '/manage_apps/';

    beforeEach(() => {
        initialEntry = [`${PATH}${SOURCE_NO_APS_ID}`];
        mockStore = configureStore(middlewares);
        store = mockStore({
            providers: {
                entities: [{
                    id: SOURCE_NO_APS_ID,
                    source_type_id: OPENSHIFT_ID,
                    applications: []
                }, {
                    id: SOURCE_ALL_APS_ID,
                    source_type_id: OPENSHIFT_ID,
                    applications: [{
                        application_type_id: COSTMANAGEMENT_APP.id
                    }, {
                        application_type_id: TOPOLOGICALINVENTORY_APP.id
                    }]
                }],
                appTypes: applicationTypesData.data,
                sourceTypes: sourceTypesData.data,
                appTypesLoaded: true,
                sourceTypesLoaded: true,
                loaded: true
            }
        });
        entities.getSourcesApi = () => ({
            listEndpointAuthentications: jest.fn().mockImplementation(() => Promise.resolve({ data: [] }))
        });
    });

    it('renders limited options of applications correctly', async () => {
        let wrapper;

        await act(async () => {
            wrapper = mount(componentWrapperIntl(
                <Route path={paths.sourceManageApps} render={ (...args) => <AddApplication { ...args }/> } />,
                store,
                initialEntry
            ));
        });
        wrapper.update();

        expect(wrapper.find(SourcesFormRenderer).length).toEqual(1);
        expect(wrapper.find(AddApplicationDescription).length).toEqual(1);
        expect(wrapper.find(CardSelect).length).toEqual(1);
        expect(wrapper.find('Card').length).toEqual(2); // one app is not compatible
        expect(wrapper.find(Button).at(1).text()).toEqual('Next');
    });

    it('renders correctly when there is no free application - finish button instead of next', async () => {
        let wrapper;

        await act(async () => {
            wrapper = mount(componentWrapperIntl(
                <Route path={paths.sourceManageApps} render={ (...args) => <AddApplication { ...args }/> } />,
                store,
                [`${PATH}${SOURCE_ALL_APS_ID}`]
            ));
        });
        wrapper.update();

        expect(wrapper.find(SourcesFormRenderer).length).toEqual(1);
        expect(wrapper.find(AddApplicationDescription).length).toEqual(1);
        expect(wrapper.find(CardSelect).length).toEqual(0);
        expect(wrapper.find('Card').length).toEqual(0);
        expect(wrapper.find(Button).at(3).text()).toEqual('Finish');
    });

    it('renders loading state when is not loaded', async () => {
        store = mockStore({
            providers: {
                entities: [],
                appTypes: applicationTypesData.data,
                sourceTypes: sourceTypesData.data,
                appTypesLoaded: false,
                sourceTypesLoaded: true
            }
        });

        let wrapper;

        await act(async () => {
            wrapper = mount(componentWrapperIntl(
                <Route path={paths.sourceManageApps} render={ (...args) => <AddApplication { ...args }/> } />,
                store,
                initialEntry
            ));
        });

        expect(wrapper.find(LoadingStep)).toHaveLength(1);
    });

    it('redirects to table when the source does not exist', async () => {
        entities.doLoadSource = jest.fn().mockImplementation(() => Promise.resolve({ sources: [] }));

        store = mockStore({
            providers: {
                entities: [],
                appTypes: applicationTypesData.data,
                sourceTypes: sourceTypesData.data,
                appTypesLoaded: true,
                sourceTypesLoaded: true,
                loaded: true
            }
        });

        let wrapper;

        await act(async () => {
            wrapper = mount(componentWrapperIntl(
                <Route path={paths.sourceManageApps} render={ (...args) => <AddApplication { ...args }/> } />,
                store,
                initialEntry
            ));
        });
        wrapper.update();

        expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(paths.sources);
    });

    it.skip('renders review', () => {
        const wrapper = mount(componentWrapperIntl(
            <Route path={paths.sourceManageApps} render={ (...args) => <AddApplication { ...args }/> } />,
            store,
            initialEntry
        ));

        wrapper.find('Card').first().simulate('click');
        wrapper.find(Button).at(1).simulate('click');
        wrapper.update();

        expect(wrapper.find(Button).at(1).text()).toEqual('Finish');
    });

    it.skip('calls on submit function', (done) => {
        entities.doCreateApplication = jest.fn(() => new Promise((resolve) => resolve('OK')));

        const wrapper = mount(componentWrapperIntl(
            <Route path={paths.sourceManageApps} render={ (...args) => <AddApplication { ...args }/> } />,
            store,
            initialEntry
        ));

        wrapper.find('Card').first().simulate('click');
        wrapper.find(Button).at(1).simulate('click');
        wrapper.update();
        wrapper.find(Button).at(1).simulate('click');

        expect(entities.doCreateApplication).toHaveBeenCalledWith(SOURCE_NO_APS_ID, '2');
        setImmediate(() => {
            wrapper.update();
            //expect(wrapper.find(FinishedStep).length).toEqual(1);
            done();
        });
    });

    it.skip('catch errors after submit', (done) => {
        const ERROR_MESSAGE = 'Something went wrong :(';

        entities.doCreateApplication = jest.fn(() => new Promise((_resolve, reject) => reject(
            { errors: [{ detail: ERROR_MESSAGE }] }
        )));

        const wrapper = mount(componentWrapperIntl(
            <Route path={paths.sourceManageApps} render={ (...args) => <AddApplication { ...args }/> } />,
            store,
            initialEntry
        ));

        wrapper.find('Card').first().simulate('click');
        wrapper.find(Button).at(1).simulate('click');
        wrapper.update();
        wrapper.find(Button).at(1).simulate('click');

        expect(entities.doCreateApplication).toHaveBeenCalledWith(SOURCE_NO_APS_ID, '2');
        setImmediate(() => {
            wrapper.update();
            //expect(wrapper.find(ErroredStep).length).toEqual(1);
            expect(wrapper.find(EmptyStateBody).text().includes(ERROR_MESSAGE)).toEqual(true);
            done();
        });
    });

    it.skip('show loading step', () => {
        entities.doCreateApplication = jest.fn(() => new Promise((resolve) => resolve('OK')));

        const wrapper = mount(componentWrapperIntl(
            <Route path={paths.sourceManageApps} render={ (...args) => <AddApplication { ...args }/> } />,
            store,
            initialEntry
        ));

        wrapper.find('Card').first().simulate('click');
        wrapper.find(Button).at(1).simulate('click');
        wrapper.update();
        wrapper.find(Button).at(1).simulate('click');
        wrapper.update();
        expect(wrapper.find(LoadingStep).length).toEqual(1);
    });
});
