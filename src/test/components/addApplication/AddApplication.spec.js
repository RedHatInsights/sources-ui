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
import { routes, replaceRouteId } from '../../../Routes';
import FinishedStep from '../../../components/steps/FinishedStep';
import ErroredStepAttach from '../../../components/AddApplication/steps/ErroredStep';
import * as onCancel from '../../../components/AddApplication/onCancel';

describe('AddApplication', () => {
    let store;
    let initialEntry;
    let mockStore;
    const middlewares = [thunk, notificationsMiddleware()];

    beforeEach(() => {
        initialEntry = [replaceRouteId(routes.sourceManageApps.path, SOURCE_NO_APS_ID)];
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
        expect(wrapper.find('Card').length).toEqual(1); // one app is not compatible, one app is topology inventory
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
        expect(wrapper.find('Card').length).toEqual(1);
        expect(wrapper.find(Button).at(1).text()).toEqual('Next');
    });

    it('renders correctly when there is no free application - finish button instead of next', async () => {
        let wrapper;

        await act(async () => {
            wrapper = mount(componentWrapperIntl(
                <Route path={routes.sourceManageApps.path} render={ (...args) => <AddApplication { ...args }/> } />,
                store,
                [replaceRouteId(routes.sourceManageApps.path, SOURCE_ALL_APS_ID)]
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

    describe('custom type - integration tests', () => {
        const customSourceType = {
            name: 'custom_type',
            product_name: 'Custom Type',
            id: '6844',
            schema: {
                authentication: [
                    {
                        type: 'receptor',
                        name: 'receptor',
                        fields: [{
                            component: 'text-field',
                            label: 'Another value',
                            name: 'source.nested.another_value'
                        }, {
                            component: 'text-field',
                            label: 'Receptor ID',
                            name: 'source.nested.source_ref'
                        }]
                    }
                ],
                endpoint: {
                    hidden: true,
                    fields: [{ name: 'endpoint_id', hideField: true, component: 'text-field' }]
                }
            }
        };

        const application = {
            name: 'custom-app',
            display_name: 'Custom app',
            id: '15654165',
            supported_source_types: ['custom_type'],
            supported_authentication_types: { custom_type: ['receptor'] }
        };

        const another_value = 'do not remove this when retry';

        const source = {
            id: SOURCE_NO_APS_ID,
            source_type_id: customSourceType.id,
            applications: [],
            nested: {
                source_ref: 'original',
                another_value
            }
        };

        let wrapper;

        beforeEach(async () => {
            store = mockStore({
                sources: {
                    entities: [source],
                    appTypes: [application],
                    sourceTypes: [customSourceType],
                    appTypesLoaded: true,
                    sourceTypesLoaded: true,
                    loaded: 0
                }
            });

            await act(async () => {
                wrapper = mount(componentWrapperIntl(
                    <Route path={routes.sourceManageApps.path} render={ (...args) => <AddApplication { ...args }/> } />,
                    store,
                    initialEntry
                ));
            });
            wrapper.update();
        });

        it('loads with undo values', async () => {
            const undoValue = 'undoValue';
            const preserveAuthenticationChanges = {
                doNotChange: 'this'
            };

            store = mockStore({
                sources: {
                    entities: [source],
                    appTypes: [application],
                    sourceTypes: [customSourceType],
                    appTypesLoaded: true,
                    sourceTypesLoaded: true,
                    loaded: 0,
                    undoValues: {
                        source: {
                            nested: {
                                source_ref: undoValue
                            }
                        },
                        authentication: preserveAuthenticationChanges
                    }
                }
            });

            await act(async () => {
                wrapper = mount(componentWrapperIntl(
                    <Route path={routes.sourceManageApps.path} render={ (...args) => <AddApplication { ...args }/> } />,
                    store,
                    initialEntry
                ));
            });
            wrapper.update();

            await act(async () => {
                const firstAppCard = wrapper.find('Card').first();
                firstAppCard.simulate('click');
            });
            wrapper.update();

            await act(async () => {
                const nextButton = wrapper.find(Button).at(1);
                nextButton.simulate('click');
            });
            wrapper.update();

            const sourceRefInput = wrapper.find('input').last();
            expect(sourceRefInput.instance().value).toEqual(undoValue);

            await act(async () => {
                const nextButton = wrapper.find(Button).at(1);
                nextButton.simulate('click');
            });
            wrapper.update();

            const ERROR = 'VERY UGLY ERROR';
            attachSource.doAttachApp = jest.fn().mockImplementation(() => Promise.reject(ERROR));

            await act(async () => {
                const submitButton = wrapper.find(Button).at(1);
                submitButton.simulate('click');
            });
            wrapper.update();

            expect(wrapper.find(ErroredStepAttach)).toHaveLength(1);
            expect(wrapper.find(ErroredStepAttach).props().error).toEqual(ERROR);
            expect(attachSource.doAttachApp).toHaveBeenCalled();

            await act(async () => {
                const retryButton = wrapper.find(Button).at(2);
                retryButton.simulate('click');
            });
            wrapper.update();

            await act(async () => {
                const nextButton = wrapper.find(Button).at(1);
                nextButton.simulate('click');
            });
            wrapper.update();

            await act(async () => {
                const nextButton = wrapper.find(Button).at(1);
                nextButton.simulate('click');
            });
            wrapper.update();

            entities.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [] }));
            entities.doLoadCountOfSources = jest.fn().mockImplementation(() => Promise.resolve({ meta: { count: 0 } }));
            attachSource.doAttachApp = jest.fn().mockImplementation(() => Promise.resolve('OK'));

            await act(async () => {
                const submitButton = wrapper.find(Button).at(1);
                submitButton.simulate('click');
            });
            wrapper.update();

            expect(wrapper.find(ErroredStepAttach)).toHaveLength(0);
            expect(wrapper.find(FinishedStep)).toHaveLength(1);

            expect(attachSource.doAttachApp.mock.calls[0][1].getState().values).toEqual({
                application: { application_type_id: application.id },
                endpoint_id: undefined,
                noEndpoint: '',
                source: { ...source, nested: { source_ref: undoValue, another_value } },
                supported_auth_type: 'receptor',
                authentication: preserveAuthenticationChanges
            });
        });

        it('calls onCancel function', async () => {
            await act(async () => {
                const firstAppCard = wrapper.find('Card').first();
                firstAppCard.simulate('click');
            });
            wrapper.update();

            await act(async () => {
                const nextButton = wrapper.find(Button).at(1);
                nextButton.simulate('click');
            });
            wrapper.update();

            const value = 'SOURCE_REF_CHANGED';

            await act(async () => {
                const sourceRefInput = wrapper.find('input').last();
                sourceRefInput.instance().value = value;
                sourceRefInput.simulate('change');
            });
            wrapper.update();

            onCancel.onCancelAddApplication = jest.fn().mockImplementation(() => Promise.resolve('OK'));

            await act(async () => {
                const closeButton = wrapper.find(Button).at(0);
                closeButton.simulate('click');
            });
            wrapper.update();

            expect(onCancel.onCancelAddApplication).toHaveBeenCalledWith({
                values: {
                    application: {
                        application_type_id: application.id
                    },
                    source: {
                        ...source,
                        nested: {
                            ...source.nested,
                            source_ref: value
                        }
                    },
                    supported_auth_type: application.supported_authentication_types.custom_type[0],
                    noEndpoint: ''
                },
                dispatch: expect.any(Function),
                history: expect.objectContaining({ push: expect.any(Function) }),
                intl: expect.objectContaining({ formatMessage: expect.any(Function) }),
                sourceId: source.id
            });
        });

        it('sets values on retry and do not erase nested original values', async () => {
            await act(async () => {
                const firstAppCard = wrapper.find('Card').first();
                firstAppCard.simulate('click');
            });
            wrapper.update();

            await act(async () => {
                const nextButton = wrapper.find(Button).at(1);
                nextButton.simulate('click');
            });
            wrapper.update();

            const value = 'SOURCE_REF_CHANGED';

            await act(async () => {
                const sourceRefInput = wrapper.find('input').last();
                sourceRefInput.instance().value = value;
                sourceRefInput.simulate('change');
            });
            wrapper.update();

            await act(async () => {
                const nextButton = wrapper.find(Button).at(1);
                nextButton.simulate('click');
            });
            wrapper.update();

            const ERROR = 'VERY UGLY ERROR';
            attachSource.doAttachApp = jest.fn().mockImplementation(() => Promise.reject(ERROR));

            await act(async () => {
                const submitButton = wrapper.find(Button).at(1);
                submitButton.simulate('click');
            });
            wrapper.update();

            expect(wrapper.find(ErroredStepAttach)).toHaveLength(1);
            expect(wrapper.find(ErroredStepAttach).props().error).toEqual(ERROR);
            expect(attachSource.doAttachApp).toHaveBeenCalled();

            await act(async () => {
                const retryButton = wrapper.find(Button).at(2);
                retryButton.simulate('click');
            });
            wrapper.update();

            await act(async () => {
                const nextButton = wrapper.find(Button).at(1);
                nextButton.simulate('click');
            });
            wrapper.update();

            await act(async () => {
                const nextButton = wrapper.find(Button).at(1);
                nextButton.simulate('click');
            });
            wrapper.update();

            entities.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [] }));
            entities.doLoadCountOfSources = jest.fn().mockImplementation(() => Promise.resolve({ meta: { count: 0 } }));
            attachSource.doAttachApp = jest.fn().mockImplementation(() => Promise.resolve('OK'));

            await act(async () => {
                const submitButton = wrapper.find(Button).at(1);
                submitButton.simulate('click');
            });
            wrapper.update();

            expect(wrapper.find(ErroredStepAttach)).toHaveLength(0);
            expect(wrapper.find(FinishedStep)).toHaveLength(1);

            expect(attachSource.doAttachApp.mock.calls[0][0]).toEqual({
                application: { application_type_id: application.id },
                endpoint_id: undefined,
                noEndpoint: '',
                source: { nested: { source_ref: value, another_value } }
            });
        });
    });

    describe('imported source - not need to edit any value', () => {
        let initialValues;
        let source;

        beforeEach(() => {
            source = {
                id: SOURCE_NO_APS_ID,
                source_type_id: OPENSHIFT_ID,
                applications: [],
                imported: 'cfme'
            };

            store = mockStore({
                sources: {
                    entities: [source],
                    appTypes: applicationTypesData.data,
                    sourceTypes: sourceTypesData.data,
                    appTypesLoaded: true,
                    sourceTypesLoaded: true,
                    loaded: 0
                }
            });
            initialValues = { application: undefined, source };
        });

        it('renders review', async () => {
            const wrapper = mount(componentWrapperIntl(
                <Route path={routes.sourceManageApps.path} render={ (...args) => <AddApplication { ...args }/> } />,
                store,
                initialEntry
            ));

            await act(async () => {
                const firstAppCard = wrapper.find('Card').first();
                firstAppCard.simulate('click');
            });
            wrapper.update();

            await act(async () => {
                const nextButton = wrapper.find(Button).at(1);
                nextButton.simulate('click');
            });
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
                initialValues
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
                initialValues
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
