import React from 'react';
import { mount } from 'enzyme';
import { Button, EmptyStateBody } from '@patternfly/react-core';
import { Route } from 'react-router-dom';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { CardSelect, SummaryStep } from '@redhat-cloud-services/frontend-components-sources';
import { act } from 'react-dom/test-utils';

import SourcesFormRenderer from '../../../Utilities/SourcesFormRenderer';
import * as entities from '../../../api/entities';
import * as attachSource from '../../../api/doAttachApp';

import AddApplication from '../../../components/AddApplication/AddApplication';
import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import { sourceTypesData, OPENSHIFT_ID } from '../../sourceTypesData';
import { SOURCE_ALL_APS_ID, SOURCE_NO_APS_ID } from '../../sourcesData';
import { applicationTypesData, COSTMANAGEMENT_APP, TOPOLOGICALINVENTORY_APP } from '../../applicationTypesData';
import AddApplicationDescription from '../../../components/AddApplication/AddApplicationDescription';
import LoadingStep from '../../../components/steps/LoadingStep';
import { routes } from '../../../Routes';
import FinishedStep from '../../../components/steps/FinishedStep';
import ErroredStepAttach from '../../../components/AddApplication/steps/ErroredStep';

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
            sources: {
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
                loaded: 0
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
                <Route path={routes.sourceManageApps.path} render={ (...args) => <AddApplication { ...args }/> } />,
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

    it('loads with endpoint values - not removing of source', async () => {
        const loadAuthsSpy = jest.fn().mockImplementation(() => Promise.resolve({ data: [] }));

        entities.getSourcesApi = () => ({
            listEndpointAuthentications: loadAuthsSpy
        });

        const ENDPOINT_ID = '21312';

        store = mockStore({
            sources: {
                entities: [{
                    id: SOURCE_NO_APS_ID,
                    source_type_id: OPENSHIFT_ID,
                    applications: [],
                    endpoints: [
                        { id: ENDPOINT_ID }
                    ]
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
                loaded: 0
            }
        });

        let wrapper;

        await act(async () => {
            wrapper = mount(componentWrapperIntl(
                <Route path={routes.sourceManageApps.path} render={ (...args) => <AddApplication { ...args }/> } />,
                store,
                initialEntry
            ));
        });
        wrapper.update();

        expect(loadAuthsSpy).toHaveBeenCalledWith(ENDPOINT_ID);
        expect(wrapper.find(SourcesFormRenderer).length).toEqual(1);
        expect(wrapper.find(AddApplicationDescription).length).toEqual(1);
        expect(wrapper.find(CardSelect).length).toEqual(1);
        expect(wrapper.find('Card').length).toEqual(2);
        expect(wrapper.find(Button).at(1).text()).toEqual('Next');
    });

    it('renders correctly when there is no free application - finish button instead of next', async () => {
        let wrapper;

        await act(async () => {
            wrapper = mount(componentWrapperIntl(
                <Route path={routes.sourceManageApps.path} render={ (...args) => <AddApplication { ...args }/> } />,
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
            sources: {
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
                <Route path={routes.sourceManageApps.path} render={ (...args) => <AddApplication { ...args }/> } />,
                store,
                initialEntry
            ));
        });

        expect(wrapper.find(LoadingStep)).toHaveLength(1);
    });

    describe('imported source - not need to edit any value', () => {
        beforeEach(() => {
            store = mockStore({
                sources: {
                    entities: [{
                        id: SOURCE_NO_APS_ID,
                        source_type_id: OPENSHIFT_ID,
                        applications: [],
                        imported: 'cfme'
                    }],
                    appTypes: applicationTypesData.data,
                    sourceTypes: sourceTypesData.data,
                    appTypesLoaded: true,
                    sourceTypesLoaded: true,
                    loaded: 0
                }
            });
        });

        it('renders review', () => {
            const wrapper = mount(componentWrapperIntl(
                <Route path={routes.sourceManageApps.path} render={ (...args) => <AddApplication { ...args }/> } />,
                store,
                initialEntry
            ));

            wrapper.find('Card').first().simulate('click');
            wrapper.find(Button).at(1).simulate('click');
            wrapper.update();

            expect(wrapper.find(SummaryStep)).toHaveLength(1);
            expect(wrapper.find(Button).at(1).text()).toEqual('Finish');
        });

        it('calls on submit function', async () => {
            attachSource.doAttachApp = jest.fn().mockImplementation(() => Promise.resolve('ok'));

            entities.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [] }));
            entities.doLoadCountOfSources = jest.fn().mockImplementation(() => Promise.resolve({ meta: { count: 0 } }));

            const wrapper = mount(componentWrapperIntl(
                <Route path={routes.sourceManageApps.path} render={ (...args) => <AddApplication { ...args }/> } />,
                store,
                initialEntry
            ));

            await act(async () => {
                wrapper.find('Card').first().simulate('click');
                wrapper.find(Button).at(1).simulate('click');
            });
            wrapper.update();

            await act(async () => {
                wrapper.find(Button).at(1).simulate('click');
            });
            wrapper.update();

            await act(async () => {
                wrapper.find(Button).at(1).simulate('click');
            });
            wrapper.update();

            const formValues = { application: {
                application_type_id: '2'
            } };
            const formApi = expect.any(Object);
            const authenticationValues = expect.any(Array);

            expect(attachSource.doAttachApp).toHaveBeenCalledWith(
                formValues,
                formApi,
                authenticationValues,
            );
            expect(wrapper.find(FinishedStep).length).toEqual(1);
        });

        it('catch errors after submit', async () => {
            const ERROR_MESSAGE = 'Something went wrong :(';

            attachSource.doAttachApp = jest.fn().mockImplementation(() => new Promise((res, reject) => reject(ERROR_MESSAGE)));

            const wrapper = mount(componentWrapperIntl(
                <Route path={routes.sourceManageApps.path} render={ (...args) => <AddApplication { ...args }/> } />,
                store,
                initialEntry
            ));

            await act(async () => {
                wrapper.find('Card').first().simulate('click');
                wrapper.find(Button).at(1).simulate('click');
            });
            wrapper.update();

            await act(async () => {
                wrapper.find(Button).at(1).simulate('click');
            });
            wrapper.update();

            await act(async () => {
                wrapper.find(Button).at(1).simulate('click');
            });
            wrapper.update();

            const formValues = { application: {
                application_type_id: '2'
            } };
            const formApi = expect.any(Object);
            const authenticationValues = expect.any(Array);

            expect(attachSource.doAttachApp).toHaveBeenCalledWith(
                formValues,
                formApi,
                authenticationValues,
            );
            expect(wrapper.find(ErroredStepAttach).length).toEqual(1);
            expect(wrapper.find(EmptyStateBody).text().includes(ERROR_MESSAGE)).toEqual(true);
        });

        it('show loading step', async () => {
            attachSource.doAttachApp = jest.fn().mockImplementation(() => Promise.resolve('ok'));

            const wrapper = mount(componentWrapperIntl(
                <Route path={routes.sourceManageApps.path} render={ (...args) => <AddApplication { ...args }/> } />,
                store,
                initialEntry
            ));

            await act(async () => {
                wrapper.find('Card').first().simulate('click');
                wrapper.find(Button).at(1).simulate('click');
            });
            wrapper.update();

            await act(async () => {
                wrapper.find(Button).at(1).simulate('click');
            });
            wrapper.update();

            wrapper.find(Button).at(1).simulate('click');
            wrapper.update();

            expect(wrapper.find(LoadingStep).length).toEqual(1);
        });
    });
});
