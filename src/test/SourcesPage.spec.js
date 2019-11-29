import thunk from 'redux-thunk';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import ContentLoader from 'react-content-loader';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';

import SourcesPage, { onCloseAddSourceWizard, afterSuccess, afterSuccessLoadParameters } from '../pages/SourcesPage';
import SourcesEmptyState from '../components/SourcesEmptyState';
import SourcesSimpleView from '../components/SourcesSimpleView/SourcesSimpleView';

import { sourcesDataGraphQl } from './sourcesData';
import { sourceTypesData } from './sourceTypesData';
import { applicationTypesData } from './applicationTypesData';

import { componentWrapperIntl } from '../Utilities/testsHelpers';

import ReducersProviders, { defaultProvidersState } from '../redux/reducers/providers';
import * as api from '../api/entities';
import * as typesApi from '../api/source_types';

import * as actions from '../redux/actions/providers';
import { act } from 'react-dom/test-utils';

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

            filterInput(wrapper).simulate('change', { target: { value: SEARCH_TERM } });

            wrapper.update();
        });

        it('should call onFilterSelect', async () => {
            expect(store.getState().providers.filterValue).toEqual({
                name: SEARCH_TERM
            });
        });

        it('filtered value is shown in the input', () => {
            expect(filterInput(wrapper).props().value).toEqual(SEARCH_TERM);
        });
    });

    describe('helpers', () => {
        describe('onCloseAddSourceWizard', () => {
            let args;

            beforeEach(() => {
                args = {
                    values: { some_value: 'aa' },
                    intl: {
                        formatMessage: ({ defaultMessage }) => defaultMessage
                    },
                    dispatch: jest.fn(),
                    history: {
                        push: jest.fn()
                    }
                };

                actions.addMessage = jest.fn();
                actions.clearAddSource = jest.fn();
            });

            it('create notifications when values', () => {
                const tmpDate = Date.now;

                const TIMESTAMP = 12345313512;

                Date.now = () => TIMESTAMP;

                const EXPECTED_TITLE = expect.any(String);
                const EXPECTED_VARIANT = expect.any(String);
                const EXPECTED_DEESCRIPTION = expect.any(Object);
                const EXPECTED_CUSTOM_ID = TIMESTAMP;

                onCloseAddSourceWizard(args);

                expect(actions.addMessage).toHaveBeenCalledWith(
                    EXPECTED_TITLE,
                    EXPECTED_VARIANT,
                    EXPECTED_DEESCRIPTION,
                    EXPECTED_CUSTOM_ID
                );
                expect(actions.clearAddSource).toHaveBeenCalled();
                expect(args.history.push).toHaveBeenCalled();

                Date.now = tmpDate;
            });

            it('only clear and change path when no values/empty', () => {
                onCloseAddSourceWizard({ ...args, values: {} });

                expect(actions.addMessage).not.toHaveBeenCalled();
                expect(actions.clearAddSource).toHaveBeenCalled();
                expect(args.history.push).toHaveBeenCalled();
            });
        });

        describe('afterSuccess', () => {
            it('calls function', () => {
                const dispatch = jest.fn();

                actions.loadEntities = jest.fn();
                actions.clearAddSource = jest.fn();

                afterSuccess(dispatch);

                expect(dispatch.mock.calls.length).toBe(2);
                expect(actions.loadEntities).toHaveBeenCalledWith(afterSuccessLoadParameters);
                expect(actions.loadEntities).toHaveBeenCalled();
            });
        });
    });
});
