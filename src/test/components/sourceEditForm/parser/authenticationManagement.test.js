import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import configureStore from 'redux-mock-store';
import { Button, Text, Title } from '@patternfly/react-core';

import RemoveAuth from '../../../../components/SourceEditForm/parser/RemoveAuth';
import { componentWrapperIntl } from '../../../../utilities/testsHelpers';
import sourceEditContext from '../../../../components/SourceEditForm/sourceEditContext';
import AuthenticationManagement from '../../../../components/SourceEditForm/parser/AuthenticationManagement';
import { applicationTypesData, COSTMANAGEMENT_APP, TOPOLOGICALINVENTORY_APP } from '../../../__mocks__/applicationTypesData';

describe('AuhtenticationManagement', () => {
    let initialProps;
    let source;

    const middlewares = [thunk, notificationsMiddleware()];
    let mockStore;
    let store;

    beforeEach(() => {
        initialProps = {
            schemaAuth: { name: 'some name' },
            auth: { id: 'authid' },
            appTypes: applicationTypesData.data
        };
        source = {
            source: {
                applications: []
            }
        };
        mockStore = configureStore(middlewares);
        store = mockStore();
    });

    it('renders correctly without assigned app', () => {
        const wrapper = mount(componentWrapperIntl(
            <sourceEditContext.Provider value={{ source }}>
                <AuthenticationManagement {...initialProps }/>
            </sourceEditContext.Provider>
        ),
        store
        );

        expect(wrapper.find(RemoveAuth)).toHaveLength(0);
        expect(wrapper.find(Button)).toHaveLength(1);
        expect(wrapper.find(Title).text()).toEqual('some name ');
        expect(wrapper.find(Text).text()).toEqual('id: authid not used by any app');
    });

    it('renders correctly with assigned app', () => {
        source = {
            source: {
                applications: [{
                    application_type_id: COSTMANAGEMENT_APP.id,
                    authentications: [{
                        id: 'authid'
                    }]
                }]
            }
        };

        const wrapper = mount(componentWrapperIntl(
            <sourceEditContext.Provider value={{ source }}>
                <AuthenticationManagement {...initialProps }/>
            </sourceEditContext.Provider>
        ),
        store
        );

        expect(wrapper.find(RemoveAuth)).toHaveLength(0);
        expect(wrapper.find(Button)).toHaveLength(1);
        expect(wrapper.find(Title).text()).toEqual('some name ');
        expect(wrapper.find(Text).text()).toEqual('id: authid used by Cost Management');
    });

    it('renders correctly with assigned multiple apps', () => {
        source = {
            source: {
                applications: [{
                    application_type_id: COSTMANAGEMENT_APP.id,
                    authentications: [{
                        id: 'authid'
                    }]
                }, {
                    application_type_id: TOPOLOGICALINVENTORY_APP.id,
                    authentications: [{
                        id: 'authid'
                    }]
                },  {
                    application_type_id: undefined,
                    authentications: [{
                        id: 'authid'
                    }]
                }]
            }
        };

        const wrapper = mount(componentWrapperIntl(
            <sourceEditContext.Provider value={{ source }}>
                <AuthenticationManagement {...initialProps }/>
            </sourceEditContext.Provider>
        ),
        store
        );

        expect(wrapper.find(RemoveAuth)).toHaveLength(0);
        expect(wrapper.find(Button)).toHaveLength(1);
        expect(wrapper.find(Title).text()).toEqual('some name ');
        expect(wrapper.find(Text).text()).toEqual('id: authid used by Cost Management, Topological Inventory');
    });

    it('renders deleting', () => {
        initialProps = {
            ...initialProps,
            isDeleting: true
        };

        const wrapper = mount(componentWrapperIntl(
            <sourceEditContext.Provider value={{ source }}>
                <AuthenticationManagement {...initialProps }/>
            </sourceEditContext.Provider>
        ),
        store
        );

        expect(wrapper.find(RemoveAuth)).toHaveLength(0);
        expect(wrapper.find(Button)).toHaveLength(0);
        expect(wrapper.find(Title).text()).toEqual('some name ');
        expect(wrapper.find(Text).text()).toEqual('id: authid not used by any app');
    });

    it('renders remove modal', () => {
        const setState = jest.fn();

        const wrapper = mount(componentWrapperIntl(
            <sourceEditContext.Provider value={{ source, setState }}>
                <AuthenticationManagement {...initialProps }/>
            </sourceEditContext.Provider>
        ),
        store
        );

        expect(wrapper.find(RemoveAuth)).toHaveLength(0);
        wrapper.find(Button).simulate('click');
        wrapper.update();

        expect(setState).toHaveBeenCalledWith({
            type: 'setAuthRemoving',
            removingAuth: {
                auth: initialProps.auth,
                appNames: [],
                schemaAuth: initialProps.schemaAuth
            }
        });
    });
});
