import { mount } from 'enzyme';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Route } from 'react-router-dom';

import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import { sourceTypesData, OPENSHIFT_ID } from '../../sourceTypesData';
import { AuthTypeSetter, checkAuthTypeMemo, innerSetter } from '../../../components/AddApplication/AuthTypeSetter';
import { routes, replaceRouteId } from '../../../Routes';

describe('AuthTypeSetter', () => {
    let store;
    let mockStore;

    const middlewares = [thunk, notificationsMiddleware()];

    let initialProps;
    let formOptions;
    let changeSpy;

    const AUTH_VALUES1 = {
        id: '23231',
        password: 'password',
        name: 'lojza',
        authtype: 'token'
    };

    const AUTH_VALUES2 = {
        id: '09862',
        azure: {
            extra: {
                tenant: 'US-EAST1'
            }
        },
        authtype: 'token_extra'
    };

    const authenticationValues = [AUTH_VALUES1, AUTH_VALUES2];

    const appTypes = [{
        id: '6898778',
        supported_authentication_types: {
            openshift: ['token']
        }
    }, {
        id: '986421686456',
        supported_authentication_types: {
            openshift: ['token_extra']
        }
    }];

    const SOURCE_ID = '232232';

    const SOURCE = {
        id: SOURCE_ID,
        source_type_id: OPENSHIFT_ID,
        applications: []
    };

    const initialEntry = [replaceRouteId(routes.sourceManageApps.path, SOURCE_ID)];

    beforeEach(() => {
        mockStore = configureStore(middlewares);
        store = mockStore({
            sources: {
                entities: [SOURCE],
                appTypes,
                sourceTypes: sourceTypesData.data,
                appTypesLoaded: true,
                sourceTypesLoaded: true,
                loaded: 0
            }
        });

        changeSpy = jest.fn().mockImplementation();

        formOptions = {
            getState: jest.fn().mockImplementation(() => ({})),
            change: changeSpy
        };

        initialProps = {
            formOptions,
            authenticationValues
        };
    });

    it('sets authentication when authentication_type on undefined', () => {
        mount(componentWrapperIntl(
            <Route path={routes.sourceManageApps.path} render={ (...args) => <AuthTypeSetter { ...args } {...initialProps}/> } />,
            store,
            initialEntry
        ));

        expect(changeSpy.mock.calls[0][0]).toBe('supported_auth_type');
        expect(changeSpy.mock.calls[0][1]).toBe('');

        expect(changeSpy.mock.calls[1][0]).toBe('authentication');
        expect(changeSpy.mock.calls[1][1]).toBe(undefined);

        expect(changeSpy.mock.calls.length).toEqual(2);
    });

    it('sets authentication when authentication_type on token', () => {
        formOptions = {
            getState: jest.fn().mockImplementation(() => ({ values: { application: { application_type_id: '6898778' } } })),
            change: changeSpy
        };

        initialProps = {
            formOptions,
            authenticationValues
        };

        mount(componentWrapperIntl(
            <Route path={routes.sourceManageApps.path} render={ (...args) => <AuthTypeSetter { ...args } {...initialProps}/> } />,
            store,
            initialEntry
        ));

        expect(changeSpy.mock.calls[0][0]).toBe('supported_auth_type');
        expect(changeSpy.mock.calls[0][1]).toBe('token');

        expect(changeSpy.mock.calls[1][0]).toBe('authentication');
        expect(changeSpy.mock.calls[1][1]).toBe(AUTH_VALUES1);

        expect(changeSpy.mock.calls.length).toEqual(2);
    });

    describe('inner function tests', () => {
        it('changes when types are changed', () => {
            const checkAuthType = checkAuthTypeMemo();

            let args = {
                sourceTypes: sourceTypesData.data,
                checkAuthType,
                formOptions: {
                    getState: jest.fn()
                    .mockImplementationOnce(() => ({ }))
                    .mockImplementationOnce(() => ({ values: { application: { application_type_id: '6898778' } } }))
                    .mockImplementationOnce(() => ({ values: { application: { application_type_id: '986421686456' } } }))
                    .mockImplementationOnce(() => ({ values: { application: { application_type_id: '986421686456' } } }))
                    .mockImplementationOnce(() => ({ })),
                    change: changeSpy
                },
                authenticationValues,
                appTypes,
                source: SOURCE
            };

            innerSetter(args);

            expect(changeSpy.mock.calls[0][0]).toBe('supported_auth_type');
            expect(changeSpy.mock.calls[0][1]).toBe('');

            expect(changeSpy.mock.calls[1][0]).toBe('authentication');
            expect(changeSpy.mock.calls[1][1]).toBe(undefined);

            expect(changeSpy.mock.calls.length).toEqual(2);

            innerSetter(args);

            expect(changeSpy.mock.calls[2][0]).toBe('supported_auth_type');
            expect(changeSpy.mock.calls[2][1]).toBe('token');

            expect(changeSpy.mock.calls[3][0]).toBe('authentication');
            expect(changeSpy.mock.calls[3][1]).toBe(AUTH_VALUES1);

            expect(changeSpy.mock.calls.length).toEqual(4);

            innerSetter(args);

            expect(changeSpy.mock.calls[4][0]).toBe('supported_auth_type');
            expect(changeSpy.mock.calls[4][1]).toBe('token_extra');

            expect(changeSpy.mock.calls[5][0]).toBe('authentication');
            expect(changeSpy.mock.calls[5][1]).toBe(AUTH_VALUES2);

            expect(changeSpy.mock.calls.length).toEqual(6);

            innerSetter(args);

            expect(changeSpy.mock.calls.length).toEqual(6);

            innerSetter(args);

            expect(changeSpy.mock.calls[6][0]).toBe('supported_auth_type');
            expect(changeSpy.mock.calls[6][1]).toBe('');

            expect(changeSpy.mock.calls[7][0]).toBe('authentication');
            expect(changeSpy.mock.calls[7][1]).toBe(undefined);

            expect(changeSpy.mock.calls.length).toEqual(8);
        });
    });
});
