import { mount } from 'enzyme';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Route } from 'react-router-dom';

import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import { sourceTypesData, OPENSHIFT_ID } from '../../sourceTypesData';
import { SOURCE_ALL_APS_ID, SOURCE_NO_APS_ID } from '../../sourcesData';
import { applicationTypesData, COSTMANAGEMENT_APP, TOPOLOGICALINVENTORY_APP } from '../../applicationTypesData';
import { AuthTypeSetter } from '../../../components/AddApplication/AuthTypeSetter';
import { paths } from '../../../Routes';

describe('AuthTypeSetter', () => {
    let store;
    let initialEntry;
    let mockStore;
    let SOURCE_ID;

    const middlewares = [thunk, notificationsMiddleware()];

    let initialProps;
    let formOptions;
    let authenticationValues;

    const AUTH_VALUES1 = {
        id: '23231',
        password: 'password',
        name: 'lojza'
    };

    const AUTH_VALUES2 = {
        id: '09862',
        azure: {
            extra: {
                tenant: 'US-EAST1'
            }
        }
    };

    let changeSpy;

    beforeEach(() => {
        SOURCE_ID = '232232';

        mockStore = configureStore(middlewares);
        store = mockStore({
            providers: {
                entities: [{
                    id: SOURCE_ID,
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
                appTypes: [{
                    id: '6898778',
                    supported_authentication_types: {
                        openshift: ['token']
                    }
                }, {
                    id: '986421686456',
                    supported_authentication_types: {
                        openshift: ['token_extra']
                    }
                }],
                sourceTypes: sourceTypesData.data,
                appTypesLoaded: true,
                sourceTypesLoaded: true,
                loaded: true
            }
        });
        initialEntry = [`/manage_apps/${SOURCE_ID}`];

        changeSpy = jest.fn().mockImplementation(console.log);

        formOptions = {
            getState: () => ({ values: { } }),
            change: changeSpy
        };

        authenticationValues = [AUTH_VALUES1, AUTH_VALUES2];

        initialProps = {
            formOptions,
            authenticationValues
        };
    });

    it('sets authentication when authentication_type is changed', () => {
        const wrapper = mount(componentWrapperIntl(
            <Route path={paths.sourceManageApps} render={ (...args) => <AuthTypeSetter { ...args } {...initialProps}/> } />,
            store,
            initialEntry
        ));

        expect(changeSpy.mock.calls[0][0]).toBe('supported_auth_type');
        expect(changeSpy.mock.calls[0][1]).toBe('');

        expect(changeSpy.mock.calls[1][0]).toBe('authentication');
        expect(changeSpy.mock.calls[1][1]).toBe(undefined);

        expect(changeSpy.mock.calls.length).toEqual(2);

        console.log(wrapper.debug());

        wrapper.find(AuthTypeSetter).props().formOptions = {
            getState: () => ({ values: { application: { application_type_id: '6898778' } } }),
            change: changeSpy
        };

        wrapper.update();

        expect(changeSpy.mock.calls.length).toEqual(3);
        expect(changeSpy.mock.calls[2][0]).toBe('supported_auth_type');
        expect(changeSpy.mock.calls[2][1]).toBe('');
    });
});
