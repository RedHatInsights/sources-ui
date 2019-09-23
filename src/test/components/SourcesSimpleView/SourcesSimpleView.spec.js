import React from 'react';
import thunk from 'redux-thunk';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import configureStore from 'redux-mock-store';
import { Table, TableHeader, TableBody, RowWrapper } from '@patternfly/react-table';
import { MemoryRouter } from 'react-router-dom';

import SourcesSimpleView from '../../../components/SourcesSimpleView/SourcesSimpleView';
import { PlaceHolderTable } from '../../../components/SourcesSimpleView/loaders';

import { sourcesDataGraphQl } from '../../sourcesData';
import { sourceTypesData } from '../../sourceTypesData';
import { applicationTypesData } from '../../applicationTypesData';

import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import { sortByCompare } from '../../../Utilities/filteringSorting';
import * as actions from '../../../redux/actions/providers';

export const columns = [
    { title: null, value: 'id' },
    { title: null, value: 'uid' },
    { title: 'Name', value: 'name', searchable: true, formatter: 'nameFormatter' },
    { title: 'Type', value: 'source_type_id', searchable: false, formatter: 'sourceTypeFormatter' },
    { title: 'Application', value: 'applications', searchable: false, formatter: 'applicationFormatter' },
    { title: 'Date added', value: 'created_at', formatter: 'dateFormatter' },
    { title: null, value: 'tenant_id' }
];

describe('SourcesSimpleView', () => {
    const middlewares = [thunk, notificationsMiddleware()];
    let loadedProps;
    let mockStore;
    let initialProps;
    let initialState;

    beforeEach(() => {
        initialProps = { columns };
        mockStore = configureStore(middlewares);
        initialState = {
            providers:
            {
                loaded: true,
                rows: [],
                entities: [],
                numberOfEntities: 0,
                pageNumber: 1,
                pageSize: 10,
                filterColumn: 'name'
            }
        };
        loadedProps = {
            loaded: true,
            appTypesLoaded: true,
            sourceTypesLoaded: true,
            entities: sourcesDataGraphQl,
            numberOfEntities: sourcesDataGraphQl.length,
            appTypes: applicationTypesData.data,
            sourceTypes: sourceTypesData.data
        };
    });

    it('renders loading state', () => {
        const store = mockStore(initialState);
        const wrapper = mount(componentWrapperIntl(<SourcesSimpleView { ...initialProps } />, store));

        expect(wrapper.find(Table)).toHaveLength(0);
        expect(wrapper.find(PlaceHolderTable)).toHaveLength(1);
    });

    it('renders table when loaded', (done) => {
        initialState = {
            providers: {
                ...initialState.providers,
                ...loadedProps
            }
        };

        const store = mockStore(initialState);
        const wrapper = mount(componentWrapperIntl(<SourcesSimpleView { ...initialProps } />, store));

        setTimeout(() => {
            setTimeout(() => {
                wrapper.update();
                expect(wrapper.find(PlaceHolderTable)).toHaveLength(0);
                expect(wrapper.find(Table)).toHaveLength(1);
                expect(wrapper.find(TableHeader)).toHaveLength(1);
                expect(wrapper.find(TableBody)).toHaveLength(1);
                expect(wrapper.find(RowWrapper)).toHaveLength(sourcesDataGraphQl.length);
                done();
            });
        });
    });

    it('renders sorted table by name DESC', (done) => {
        const DIRECTION = 'desc';
        const SORTBY = 'name';

        initialState = {
            providers: {
                ...initialState.providers,
                ...loadedProps,
                sortDirection: DIRECTION,
                sortBy: SORTBY
            }
        };

        const store = mockStore(initialState);
        const wrapper = mount(componentWrapperIntl(<SourcesSimpleView { ...initialProps } />, store));

        setTimeout(() => {
            setTimeout(() => {
                wrapper.update();
                expect(wrapper.find(RowWrapper)).toHaveLength(sourcesDataGraphQl.length);
                expect(wrapper.find(RowWrapper).first().text().includes(sourcesDataGraphQl.sort(sortByCompare(SORTBY, DIRECTION))[0].name));
                expect(wrapper.find(RowWrapper).last().text().includes(sourcesDataGraphQl.sort(sortByCompare(SORTBY, DIRECTION)).slice(-1)[0].name));
                done();
            });
        });
    });

    it('renders sorted table by name ASC', (done) => {
        const DIRECTION = 'asc';
        const SORTBY = 'name';

        initialState = {
            providers: {
                ...initialState.providers,
                ...loadedProps,
                sortDirection: DIRECTION,
                sortBy: SORTBY
            }
        };

        const store = mockStore(initialState);
        const wrapper = mount(componentWrapperIntl(<SourcesSimpleView { ...initialProps } />, store));

        setTimeout(() => {
            setTimeout(() => {
                wrapper.update();
                expect(wrapper.find(RowWrapper)).toHaveLength(sourcesDataGraphQl.length);
                expect(wrapper.find(RowWrapper).first().text().includes(sourcesDataGraphQl.sort(sortByCompare(SORTBY, DIRECTION))[0].name));
                expect(wrapper.find(RowWrapper).last().text().includes(sourcesDataGraphQl.sort(sortByCompare(SORTBY, DIRECTION)).slice(-1)[0].name));
                done();
            });
        });
    });

    describe('actions', () => {
        const MANAGE_APPS_INDEX = 0;
        const EDIT_SOURCE_INDEX = 1;
        const DELETE_SOURCE_INDEX = 2;
        let wrapper;

        beforeEach(() => {
            initialState = {
                providers: {
                    ...initialState.providers,
                    ...loadedProps
                }
            };

            const store = mockStore(initialState);
            wrapper = mount(componentWrapperIntl(<SourcesSimpleView { ...initialProps } />, store));
        });

        it('redirect to edit', (done) => {
            setTimeout(() => {
                setTimeout(() => {
                    wrapper.update();
                    wrapper.find('.pf-c-dropdown__toggle').first().simulate('click');
                    wrapper.update();
                    wrapper.find('.pf-c-dropdown__menu-item').at(EDIT_SOURCE_INDEX).simulate('click');

                    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(`/edit/${sourcesDataGraphQl[0].id}`);
                    done();
                });
            });
        });

        it('redirect to delete', (done) => {
            setTimeout(() => {
                setTimeout(() => {
                    wrapper.update();
                    wrapper.find('.pf-c-dropdown__toggle').first().simulate('click');
                    wrapper.update();
                    wrapper.find('.pf-c-dropdown__menu-item').at(DELETE_SOURCE_INDEX).simulate('click');

                    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(`/remove/${sourcesDataGraphQl[0].id}`);
                    done();
                });
            });
        });

        it('redirect to manage apps', (done) => {
            setTimeout(() => {
                setTimeout(() => {
                    wrapper.update();
                    wrapper.find('.pf-c-dropdown__toggle').first().simulate('click');
                    wrapper.update();
                    wrapper.find('.pf-c-dropdown__menu-item').at(MANAGE_APPS_INDEX).simulate('click');

                    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(`/manage_apps/${sourcesDataGraphQl[0].id}`);
                    done();
                });
            });
        });
    });

    it('calls sortEntities', (done) => {
        const spy = jest.spyOn(actions, 'sortEntities');

        initialState = {
            providers: {
                ...initialState.providers,
                ...loadedProps
            }
        };

        const store = mockStore(initialState);
        const wrapper = mount(componentWrapperIntl(<SourcesSimpleView { ...initialProps } />, store));

        setTimeout(() => {
            setTimeout(() => {
                wrapper.update();
                wrapper.find('button').first().simulate('click');
                expect(spy).toHaveBeenCalledWith('name', 'asc');

                wrapper.update();
                wrapper.find('button').at(1).simulate('click');
                expect(spy).toHaveBeenCalledWith('source_type_id', 'asc');

                done();
            });
        });
    });
});
