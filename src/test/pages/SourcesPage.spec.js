import thunk from 'redux-thunk';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import ContentLoader from 'react-content-loader';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { PrimaryToolbar, ConditionalFilter } from '@redhat-cloud-services/frontend-components';
import { act } from 'react-dom/test-utils';
import { Chip, Select, Pagination, Button } from '@patternfly/react-core';
import { MemoryRouter, Link } from 'react-router-dom';
import { AddSourceWizard } from '@redhat-cloud-services/frontend-components-sources';
import { RowLoader } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';

import SourcesPage from '../../pages/SourcesPage';
import SourcesEmptyState from '../../components/SourcesEmptyState';
import SourcesSimpleView from '../../components/SourcesSimpleView/SourcesSimpleView';

import { sourcesDataGraphQl } from '../sourcesData';
import { sourceTypesData, OPENSHIFT_ID } from '../sourceTypesData';
import { applicationTypesData } from '../applicationTypesData';

import { componentWrapperIntl } from '../../Utilities/testsHelpers';

import ReducersProviders, { defaultSourcesState } from '../../redux/reducers/sources';
import * as api from '../../api/entities';
import * as typesApi from '../../api/source_types';
import EmptyStateTable from '../../components/SourcesSimpleView/EmptyStateTable';
import PaginationLoader from '../../pages/SourcesPage/PaginationLoader';
import { paths } from '../../Routes';
import * as helpers from '../../pages/SourcesPage/helpers';

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
            combineReducers({ sources: applyReducerHash(ReducersProviders, defaultSourcesState) }),
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
        expect(wrapper.find(PaginationLoader)).toHaveLength(0);
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

    it('renders table and filtering - loading', async () => {
        await act(async() => {
            wrapper = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));
        });

        expect(wrapper.find(SourcesEmptyState)).toHaveLength(0);
        expect(wrapper.find(PrimaryToolbar)).toHaveLength(2);
        expect(wrapper.find(SourcesSimpleView)).toHaveLength(1);
        expect(wrapper.find(PaginationLoader)).toHaveLength(2);
    });

    it('renders addSourceWizard', async () => {
        await act(async() => {
            wrapper = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));
        });
        wrapper.update();

        await act(async() => {
            wrapper.find(Link).first().simulate('click', { button: 0 });
        });
        wrapper.update();

        expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(paths.sourcesNew);
        expect(wrapper.find(AddSourceWizard)).toHaveLength(1);
    });

    it('renders and decreased page number if it is too great', async () => {
        store = createStore(
            combineReducers({ sources: applyReducerHash(ReducersProviders, {
                ...defaultSourcesState,
                pageNumber: 20
            }) }),
            applyMiddleware(...middlewares)
        );

        await act(async() => {
            wrapper = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));
        });
        wrapper.update();

        const paginationInput = wrapper.find('.pf-c-pagination__nav-page-select').first().find('input').first();

        expect(paginationInput.props().value).toEqual(1);
    });

    it('closes addSourceWizard', async () => {
        helpers.onCloseAddSourceWizard = jest.fn();

        await act(async() => {
            wrapper = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));
        });
        wrapper.update();

        await act(async() => {
            wrapper.find(Link).first().simulate('click', { button: 0 });
        });
        wrapper.update();

        await act(async() => {
            wrapper.find(AddSourceWizard).props().onClose();
        });
        wrapper.update();

        expect(helpers.onCloseAddSourceWizard).toHaveBeenCalledWith({
            values: undefined,
            intl: expect.any(Object),
            dispatch: expect.any(Function),
            history: expect.any(Object)
        });
    });

    it('afterSuccess addSourceWizard', async () => {
        helpers.afterSuccess = jest.fn();

        await act(async() => {
            wrapper = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));
        });
        wrapper.update();

        await act(async() => {
            wrapper.find(Link).first().simulate('click', { button: 0 });
        });
        wrapper.update();

        await act(async() => {
            wrapper.find(AddSourceWizard).props().afterSuccess();
        });
        wrapper.update();

        expect(helpers.afterSuccess).toHaveBeenCalledWith(expect.any(Function));
    });

    it('renders loading state when is loading', async () => {
        await act(async() => {
            wrapper = mount(componentWrapperIntl(<SourcesPage { ...initialProps } />, store));
        });

        const paginationLoadersCount = 2;
        const rowLoadersCount = 12;
        const loadersCount = rowLoadersCount + paginationLoadersCount;

        expect(wrapper.find(RowLoader)).toHaveLength(rowLoadersCount);
        expect(wrapper.find(PaginationLoader)).toHaveLength(paginationLoadersCount);
        expect(wrapper.find(ContentLoader)).toHaveLength(loadersCount);
        wrapper.update();
        expect(wrapper.find(RowLoader)).toHaveLength(0);
        expect(wrapper.find(PaginationLoader)).toHaveLength(0);
        expect(wrapper.find(ContentLoader)).toHaveLength(0);
    });

    describe('filtering', () => {
        const EMPTY_VALUE = '';
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
                expect(store.getState().sources.filterValue).toEqual({
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
                expect(store.getState().sources.filterValue).toEqual({
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
                expect(filterInput(wrapper).props().value).toEqual(EMPTY_VALUE);

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
                    expect(store.getState().sources.filterValue).toEqual({
                        name: totalNonsense
                    });
                    expect(store.getState().sources.numberOfEntities).toEqual(0);
                    expect(wrapper.find(EmptyStateTable)).toHaveLength(1);
                    expect(wrapper.find(Pagination)).toHaveLength(0);
                    done();
                }, 500);
            }, 500);
        });

        it('clears filter value in the name input when clicking on clears all filter in empty table state', (done) => {
            setTimeout(async () => {
                wrapper.update();

                api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: [] }));
                api.doLoadCountOfSources = jest.fn().mockImplementation(() => Promise.resolve({ meta: { count: 0 } }));

                const totalNonsense = '122#$@#%#^$#@!^$#^$#^546454abcerd';

                await act(async() => {
                    filterInput(wrapper).simulate('change', { target: { value: totalNonsense } });
                });

                setTimeout(async () => {
                    wrapper.update();

                    expect(filterInput(wrapper).props().value).toEqual(totalNonsense);

                    await act(async() => {
                        wrapper.find(Button).last().simulate('click');
                    });
                    wrapper.update();

                    expect(filterInput(wrapper).props().value).toEqual(EMPTY_VALUE);
                    done();
                }, 500);
            }, 500);
        });
    });
});
