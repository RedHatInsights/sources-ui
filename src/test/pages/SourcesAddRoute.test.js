/* eslint-disable react/display-name */
import thunk from 'redux-thunk';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';

import { AddSourceWizard } from '@redhat-cloud-services/frontend-components-sources/cjs/addSourceWizard';

import SourcesPage from '../../pages/Sources';

import { sourcesDataGraphQl } from '../__mocks__/sourcesData';
import { sourceTypesData } from '../__mocks__/sourceTypesData';
import { applicationTypesData } from '../__mocks__/applicationTypesData';

import { componentWrapperIntl } from '../../utilities/testsHelpers';

import ReducersProviders, { defaultSourcesState } from '../../redux/sources/reducer';
import * as api from '../../api/entities';
import * as typesApi from '../../api/source_types';

import { routes } from '../../Routes';
import UserReducer from '../../redux/user/reducer';

jest.mock('@redhat-cloud-services/frontend-components-sources/cjs/addSourceWizard', () => ({
    __esModule: true,
    AddSourceWizard: jest.fn().mockImplementation(() => <h2>AddSource mock</h2>)
}));

describe('SourcesPage - addSource route', () => {
    const middlewares = [thunk, notificationsMiddleware()];
    let store;
    let wrapper;

    const wasRedirectedToRoot = (wrapper) => wrapper.find(MemoryRouter).instance().history.location.pathname === routes.sources.path;

    beforeEach(() => {
        api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: sourcesDataGraphQl }));
        api.doLoadCountOfSources = jest.fn().mockImplementation(() => Promise.resolve({ meta: { count: sourcesDataGraphQl.length } }));
        api.doLoadAppTypes = jest.fn().mockImplementation(() => Promise.resolve(applicationTypesData));
        typesApi.doLoadSourceTypes =  jest.fn().mockImplementation(() => Promise.resolve(sourceTypesData.data));

        store = createStore(
            combineReducers({
                sources: applyReducerHash(ReducersProviders, defaultSourcesState),
                user: applyReducerHash(UserReducer, { isOrgAdmin: false })
            }),
            applyMiddleware(...middlewares)
        );
    });

    it('redirect when not org admin', async () => {
        const initialEntry = [routes.sourcesNew.path];

        await act(async() => {
            wrapper = mount(componentWrapperIntl(<SourcesPage />, store, initialEntry));
        });
        wrapper.update();

        expect(wrapper.find(AddSourceWizard)).toHaveLength(0);
        expect(wasRedirectedToRoot(wrapper)).toEqual(true);
    });
});
