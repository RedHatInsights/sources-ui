import thunk from 'redux-thunk';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import ContentLoader from 'react-content-loader';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { PrimaryToolbar, ConditionalFilter } from '@redhat-cloud-services/frontend-components';
import { act } from 'react-dom/test-utils';
import { Chip, Select, Pagination } from '@patternfly/react-core';

import SourcesPage from '../../pages/SourcesPage';
import SourcesEmptyState from '../../components/SourcesEmptyState';
import SourcesSimpleView from '../../components/SourcesSimpleView/SourcesSimpleView';

import { sourcesDataGraphQl } from '../sourcesData';
import { sourceTypesData, OPENSHIFT_ID } from '../sourceTypesData';
import { applicationTypesData } from '../applicationTypesData';

import { componentWrapperIntl } from '../../Utilities/testsHelpers';

import ReducersProviders, { defaultProvidersState } from '../../redux/reducers/providers';
import * as api from '../../api/entities';
import * as typesApi from '../../api/source_types';
import EmptyStateTable from '../../components/SourcesSimpleView/EmptyStateTable';
import PaginationLoader from '../../pages/SourcesPage/PaginationLoader';

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
        expect(wrapper.find(Pagination)).toHaveLength(2);
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
        expect(wrapper.find(PaginationLoader)).toHaveLength(2);
    });

    it('renders loading state when is loading', async () => {
        await act(async() => {
            wrapper = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));
        });

        const paginationLoadersCount = 2;
        const rowLoadersCount = 12;
        const loadersCount = rowLoadersCount + paginationLoadersCount;

        expect(wrapper.find(ContentLoader).length).toEqual(loadersCount);
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

        it('should call onFilterSelect with type', (done) => {
            setTimeout(() => {
                wrapper.update();
                expect(wrapper.find(Chip)).toHaveLength(1);

                // Switch to source type in conditional filter
                wrapper.find(ConditionalFilter).setState({ stateValue: 1 });
                wrapper.update();

                const checkboxDropdownProps = wrapper.find(Select).last().props();

                // Select openshift
                const EVENT = {};
                checkboxDropdownProps.onSelect(EVENT, OPENSHIFT_ID);
                wrapper.update();

                expect(wrapper.find(Chip)).toHaveLength(2);
                expect(store.getState().providers.filterValue).toEqual({
                    name: SEARCH_TERM,
                    source_type_id: [OPENSHIFT_ID]
                });
                done();
            }, 500);
        });

        it('filtered value is shown in the input', () => {
            expect(filterInput(wrapper).props().value).toEqual(SEARCH_TERM);
        });

        it('should remove the name badge when clicking on remove icon', (done) => {
            setTimeout(async () => {
                wrapper.update();

                expect(wrapper.find(Chip)).toHaveLength(1);

                await act(async () => wrapper.find(Chip).simulate('click'));
                wrapper.update();

                expect(wrapper.find(Chip)).toHaveLength(0);
                done();
            }, 500);
        });

        it('should remove the name badge when clicking on Clear filters button', (done) => {
            const clearFillterButtonSelector = '.pf-m-link';

            setTimeout(async () => {
                wrapper.update();

                expect(wrapper.find(clearFillterButtonSelector)).toHaveLength(1);

                await act(async () => wrapper.find(clearFillterButtonSelector).simulate('click'));
                wrapper.update();

                expect(wrapper.find(clearFillterButtonSelector)).toHaveLength(0);
                done();
            }, 500);
        });

        it('renders emptyStateTable when no entities found', (done) => {
            setTimeout(async () => {
                wrapper.update();

                api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [] }));
                api.doLoadCountOfSources = jest.fn().mockImplementation(() => Promise.resolve({ meta: { count: 0 } }));

                const totalNonsense = '122#$@#%#^$#@!^$#^$#^546454abcerd';

                await act(async() => {
                    filterInput(wrapper).simulate('change', { target: { value: totalNonsense } });
                });

                setTimeout(() => {
                    wrapper.update();
                    expect(store.getState().providers.filterValue).toEqual({
                        name: totalNonsense
                    });
                    expect(store.getState().providers.numberOfEntities).toEqual(0);
                    expect(wrapper.find(EmptyStateTable)).toHaveLength(1);
                    expect(wrapper.find(Pagination)).toHaveLength(0);
                    done();
                }, 500);
            }, 500);
        });
    });
});
