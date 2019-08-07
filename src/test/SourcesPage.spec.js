import thunk from 'redux-thunk';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import ContentLoader from 'react-content-loader';
import { IntlProvider } from 'react-intl';
import { MemoryRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { applyReducerHash } from '@red-hat-insights/insights-frontend-components';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import configureStore from 'redux-mock-store';

import SourcesPage from '../pages/SourcesPage';
import SourcesEmptyState from '../components/SourcesEmptyState';
import SourcesFilter from '../components/SourcesFilter';
import SourcesSimpleView from '../components/SourcesSimpleView';

import { sourcesData, sourcesDataGraphQl } from './sourcesData';
import { sourceTypesData } from './sourceTypesData';
import { applicationTypesData } from './applicationTypesData';

import { SOURCES_API_BASE } from '../Utilities/Constants';

import { componentWrapperIntl } from '../Utilities/testsHelpers';

import ReducersProviders, { defaultProvidersState } from '../redux/reducers/providers';

describe('SourcesPage', () => {
    const middlewares = [thunk, notificationsMiddleware()];
    let mockStore;
    let initialProps;
    let initialState;

    beforeEach(() => {
        initialProps = {};
        mockStore = configureStore(middlewares);
        initialState = { providers: { loaded: true, rows: [], entities: [], numberOfEntities: 0 } };
    });

    const applicationsSource19 = {
        meta: { count: 0, limit: 100, offset: 0 },
        links: { first: '/api/v1.0/applications/?offset=0\u00219source_id=19', last: '/api/v1.0/applications/?offset=0\u00219source_id=19' },
        data: []
    };

    const endpointsSource19 = {
        meta: { count: 1, limit: 100, offset: 0 },
        links: { first: '/api/v1.0/endpoints/?offset=0\u00219source_id=19', last: '/api/v1.0/endpoints/?offset=0\u00219source_id=19' },
        data: [
            { certificate_authority: 'asfasfasf', created_at: '2019-05-02T12:44:12Z', default: false, host: 'bar.bar', id: '4', path: '/', port: 3300, role: 'kubernetes', scheme: 'http', source_id: '6', updated_at: '2019-05-02T12:44:12Z', verify_ssl: true, tenant: 'martinpovolny' }
        ]
    };

    const mockInitialHttpRequests = () => {
        apiClientMock.get(`${SOURCES_API_BASE}/sources`, mockOnce({ body: sourcesData }));
        apiClientMock.get(`${SOURCES_API_BASE}/source_types`, mockOnce({ body: sourceTypesData }));
        apiClientMock.get(`${SOURCES_API_BASE}/application_types`, mockOnce({ body: applicationTypesData }));
        apiClientMock.get(`${SOURCES_API_BASE}/applications/?source_id=19`, mockOnce({ body: applicationsSource19 }));
        apiClientMock.get(`${SOURCES_API_BASE}/endpoints/?source_id=19`, mockOnce({ body: endpointsSource19 }));
        apiClientMock.post(`${SOURCES_API_BASE}/graphql`, mockOnce({ body: { data: { sources: sourcesDataGraphQl } } }));
    };

    it('should fetch sources and source types on component mount', (done) => {
        expect.assertions(1);
        const store = mockStore(initialState);
        mockInitialHttpRequests();

        const expectedActions = [
            { type: 'LOAD_SOURCE_TYPES_PENDING' },
            { type: 'LOAD_APP_TYPES_PENDING' },
            { type: 'LOAD_ENTITIES_PENDING' },
            expect.objectContaining({ type: 'LOAD_APP_TYPES_FULFILLED' }),
            expect.objectContaining({ type: 'LOAD_SOURCE_TYPES_FULFILLED' }),
            expect.objectContaining({ type: 'LOAD_ENTITIES_FULFILLED' })
        ];

        mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));
        setImmediate(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
        });
    });

    it('renders empty state when there are no Sources', (done) => {
        const store = mockStore(initialState);
        mockInitialHttpRequests();

        const page = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));
        setImmediate(() => {
            expect(page.find(SourcesEmptyState)).toHaveLength(1);
            expect(page.find(SourcesFilter)).toHaveLength(0);
            expect(page.find(SourcesSimpleView)).toHaveLength(0);
            done();
        });
    });

    it('renders table and filtering', (done) => {
        const store = mockStore({
            providers: { loaded: true, rows: [], entities: [], numberOfEntities: 1 }
        });
        mockInitialHttpRequests();

        const page = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));

        setImmediate(() => {
            expect(page.find(SourcesEmptyState)).toHaveLength(0);
            expect(page.find(SourcesFilter)).toHaveLength(1);
            expect(page.find(SourcesSimpleView)).toHaveLength(1);
            done();
        });
    });
    it('renders loading state when is loading', (done) => {
        const store = createStore(
            combineReducers({ providers: applyReducerHash(ReducersProviders, defaultProvidersState) }),
            applyMiddleware(...middlewares)
        );
        mockInitialHttpRequests();

        const page = mount(<IntlProvider locale="en">
            <Provider store={ store }>
                <MemoryRouter initialEntries={ ['/'] }>
                    <Route path='/' render={() => <SourcesPage />}/>
                </MemoryRouter>
            </Provider>
        </IntlProvider>);

        expect(page.find(ContentLoader).length).toEqual(2);
        setImmediate(() => {
            page.update();
            expect(page.find(ContentLoader).length).toEqual(0);
            done();
        });
    });
});
