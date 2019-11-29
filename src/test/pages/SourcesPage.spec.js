import thunk from 'redux-thunk';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import ContentLoader from 'react-content-loader';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import { act } from 'react-dom/test-utils';

import SourcesPage from '../../pages/SourcesPage';
import SourcesEmptyState from '../../components/SourcesEmptyState';
import SourcesSimpleView from '../../components/SourcesSimpleView/SourcesSimpleView';

import { sourcesDataGraphQl } from '../sourcesData';
import { sourceTypesData } from '../sourceTypesData';
import { applicationTypesData } from '../applicationTypesData';

import { componentWrapperIntl } from '../../Utilities/testsHelpers';

import ReducersProviders, { defaultProvidersState } from '../../redux/reducers/providers';
import * as api from '../../api/entities';
import * as typesApi from '../../api/source_types';

describe('SourcesPage', () => {
    const middlewares = [thunk, notificationsMiddleware()];
    let initialProps;
    let store;
    let wrapper;

    beforeEach(() => {
        initialProps = {};

        api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: sourcesDataGraphQl }));
        api.doLoadCountOfSources = jest.fn().mockImplementation(() => Promise.resolve({ meta: { count: sourcesDataGraphQl.length } }));
        api.doLoadAppTypes = jest.fn().mockImplementation(() => Promise.resolve(applicationTypesData));
        typesApi.doLoadSourceTypes =  jest.fn().mockImplementation(() => Promise.resolve(sourceTypesData.data));

        store = createStore(
            combineReducers({ providers: applyReducerHash(ReducersProviders, defaultProvidersState) }),
            applyMiddleware(...middlewares)
        );
    });

    it('should fetch sources and source types on component mount', async () => {
        await act(async() => {
            wrapper = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));
        });

        expect(api.doLoadEntities).toHaveBeenCalled();
        expect(api.doLoadAppTypes).toHaveBeenCalled();
        expect(typesApi.doLoadSourceTypes).toHaveBeenCalled();

        wrapper.update();
        expect(wrapper.find(SourcesEmptyState)).toHaveLength(0);
        expect(wrapper.find(PrimaryToolbar)).toHaveLength(2);
        expect(wrapper.find(SourcesSimpleView)).toHaveLength(1);
    });

    it('renders empty state when there are no Sources', async () => {
        api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [] }));
        api.doLoadCountOfSources = jest.fn().mockImplementation(() => Promise.resolve({ meta: { count: 0 } }));

        await act(async() => {
            wrapper = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));
        });

        wrapper.update();
        expect(wrapper.find(SourcesEmptyState)).toHaveLength(1);
        expect(wrapper.find(PrimaryToolbar)).toHaveLength(0);
        expect(wrapper.find(SourcesSimpleView)).toHaveLength(0);
    });

    it('renders empty state when there is fetching error', async () => {
        const ERROR_MESSAGE = 'ERROR_MESSAGE';
        api.doLoadEntities = jest.fn().mockImplementation(() => Promise.reject({ detail: ERROR_MESSAGE }));

        await act(async() => {
            wrapper = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));
        });

        wrapper.update();
        expect(wrapper.find(SourcesEmptyState)).toHaveLength(1);
        expect(wrapper.find(PrimaryToolbar)).toHaveLength(0);
        expect(wrapper.find(SourcesSimpleView)).toHaveLength(0);
        expect(wrapper.text().includes(ERROR_MESSAGE)).toEqual(true);
    });

    it('renders table and filtering', async () => {
        await act(async() => {
            wrapper = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));
        });

        expect(wrapper.find(SourcesEmptyState)).toHaveLength(0);
        expect(wrapper.find(PrimaryToolbar)).toHaveLength(2);
        expect(wrapper.find(SourcesSimpleView)).toHaveLength(1);
    });

    it('renders loading state when is loading', async () => {
        await act(async() => {
            wrapper = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));
        });

        expect(wrapper.find(ContentLoader).length).toEqual(12);
        wrapper.update();
        expect(wrapper.find(ContentLoader).length).toEqual(0);
    });

    describe('filtering', () => {
        const SEARCH_TERM = 'Pepa';
        const FILTER_INPUT_INDEX = 0;

        let wrapper;
        const filterInput = (wrapper) => wrapper.find('input').at(FILTER_INPUT_INDEX);;

        beforeEach(async () => {
            await act(async() => {
                wrapper = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));
            });
            wrapper.update();

            await act(async() => {
                filterInput(wrapper).simulate('change', { target: { value: SEARCH_TERM } });
            });
            wrapper.update();
        });

        it('should call onFilterSelect', (done) => {
            setTimeout(() => {
                expect(store.getState().providers.filterValue).toEqual({
                    name: SEARCH_TERM
                });
                done();
            }, 500);
        });

        it('filtered value is shown in the input', () => {
            expect(filterInput(wrapper).props().value).toEqual(SEARCH_TERM);
        });
    });
});
