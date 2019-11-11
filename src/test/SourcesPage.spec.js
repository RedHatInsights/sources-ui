import thunk from 'redux-thunk';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import ContentLoader from 'react-content-loader';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import SourcesPage from '../pages/SourcesPage';
import SourcesEmptyState from '../components/SourcesEmptyState';
import SourcesFilter from '../components/SourcesFilter';
import SourcesSimpleView from '../components/SourcesSimpleView/SourcesSimpleView';

import { sourcesDataGraphQl } from './sourcesData';
import { sourceTypesData } from './sourceTypesData';
import { applicationTypesData } from './applicationTypesData';

import { componentWrapperIntl } from '../Utilities/testsHelpers';

import ReducersProviders, { defaultProvidersState } from '../redux/reducers/providers';
import * as api from '../api/entities';
import * as typesApi from '../api/source_types';

describe('SourcesPage', () => {
    const middlewares = [thunk, notificationsMiddleware()];
    let initialProps;
    let store;

    beforeEach(() => {
        initialProps = {};

        api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: sourcesDataGraphQl }));
        api.doLoadAppTypes = jest.fn().mockImplementation(() => Promise.resolve(applicationTypesData));
        typesApi.doLoadSourceTypes =  jest.fn().mockImplementation(() => Promise.resolve(sourceTypesData.data));

        store = createStore(
            combineReducers({ providers: applyReducerHash(ReducersProviders, defaultProvidersState) }),
            applyMiddleware(...middlewares)
        );
    });

    it('should fetch sources and source types on component mount', (done) => {
        const wrapper = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));

        expect(api.doLoadEntities).toHaveBeenCalled();
        expect(api.doLoadAppTypes).toHaveBeenCalled();
        expect(typesApi.doLoadSourceTypes).toHaveBeenCalled();

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(SourcesEmptyState)).toHaveLength(0);
            expect(wrapper.find(SourcesFilter)).toHaveLength(1);
            expect(wrapper.find(SourcesSimpleView)).toHaveLength(1);
            done();
        });
    });

    it('renders empty state when there are no Sources', (done) => {
        api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [] }));

        const wrapper = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(SourcesEmptyState)).toHaveLength(1);
            expect(wrapper.find(SourcesFilter)).toHaveLength(0);
            expect(wrapper.find(SourcesSimpleView)).toHaveLength(0);
            done();
        });
    });

    it('renders empty state when there is fetching error', (done) => {
        const ERROR_MESSAGE = 'ERROR_MESSAGE';
        api.doLoadEntities = jest.fn().mockImplementation(() => Promise.reject({ detail: ERROR_MESSAGE }));

        const wrapper = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(SourcesEmptyState)).toHaveLength(1);
            expect(wrapper.find(SourcesFilter)).toHaveLength(0);
            expect(wrapper.find(SourcesSimpleView)).toHaveLength(0);
            expect(wrapper.find('SourcesPage').props().fetchingError.detail).toEqual(ERROR_MESSAGE);
            done();
        });
    });

    it('renders table and filtering', (done) => {
        const wrapper = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));

        setImmediate(() => {
            expect(wrapper.find(SourcesEmptyState)).toHaveLength(0);
            expect(wrapper.find(SourcesFilter)).toHaveLength(1);
            expect(wrapper.find(SourcesSimpleView)).toHaveLength(1);
            done();
        });
    });

    it('renders loading state when is loading', (done) => {
        const wrapper = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));

        expect(wrapper.find(ContentLoader).length).toEqual(2);
        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(ContentLoader).length).toEqual(0);
            done();
        });
    });

    it('should call onFilterSelect', (done) => {
        const SEARCH_TERM = 'Pepa';
        const FILTER_INPUT_INDEX = 0;

        const wrapper = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));

        setImmediate(() => {
            wrapper.update();
            const filterInput = wrapper.find('input').at(FILTER_INPUT_INDEX);

            filterInput.simulate('change', { target: { value: SEARCH_TERM } });

            expect(store.getState().providers.filterValue).toEqual(SEARCH_TERM);
            done();
        });
    });
});
