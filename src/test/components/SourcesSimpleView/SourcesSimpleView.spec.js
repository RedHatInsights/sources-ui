import React from 'react';
import thunk from 'redux-thunk';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import configureStore from 'redux-mock-store';
import { Table, TableHeader, TableBody, RowWrapper } from '@patternfly/react-table';
import { MemoryRouter } from 'react-router-dom';
import { RowLoader } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';
import { act } from 'react-dom/test-utils';

import SourcesSimpleView, { insertEditAction, actionResolver } from '../../../components/SourcesSimpleView/SourcesSimpleView';
import { PlaceHolderTable, RowWrapperLoader } from '../../../components/SourcesSimpleView/loaders';

import { sourcesDataGraphQl } from '../../sourcesData';
import { sourceTypesData } from '../../sourceTypesData';
import { applicationTypesData } from '../../applicationTypesData';

import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import { sortByCompare } from '../../../Utilities/filteringSorting';
import * as actions from '../../../redux/actions/providers';
import * as API from '../../../api/entities';

describe('SourcesSimpleView', () => {
    const middlewares = [thunk, notificationsMiddleware()];
    let loadedProps;
    let mockStore;
    let initialProps;
    let initialState;

    beforeEach(() => {
        initialProps = {};
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
        API.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources: sourcesDataGraphQl }));
        API.doLoadCountOfSources = jest.fn().mockImplementation(() => Promise.resolve({ meta: { count: sourcesDataGraphQl.length } }));
    });

    it('renders loading state', () => {
        const store = mockStore(initialState);
        const wrapper = mount(componentWrapperIntl(<SourcesSimpleView { ...initialProps } />, store));

        expect(wrapper.find(Table)).toHaveLength(0);
        expect(wrapper.find(PlaceHolderTable)).toHaveLength(1);
    });

    it('renders removing row', (done) => {
        initialState = {
            providers: {
                ...initialState.providers,
                ...loadedProps,
                entities: [
                    {
                        ...sourcesDataGraphQl[0],
                        isDeleting: true
                    },
                    ...sourcesDataGraphQl.slice(1)
                ]
            }
        };

        const store = mockStore(initialState);
        const wrapper = mount(componentWrapperIntl(<SourcesSimpleView { ...initialProps } />, store));

        setTimeout(() => {
            setTimeout(() => {
                wrapper.update();
                expect(wrapper.find(RowWrapperLoader)).toHaveLength(sourcesDataGraphQl.length);
                expect(wrapper.find(RowLoader)).toHaveLength(1);
                done();
            });
        });
    });

    it('renders table when loaded', (done) => {
        const ROW_WRAPPER_CLASSNAME = 'ins-c-sources__row-vertical-centered';
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
                expect(wrapper.find(RowWrapper).first().props().className).toEqual(ROW_WRAPPER_CLASSNAME);
                done();
            });
        });
    });

    it('re-renders when entities changed', async () => {
        let wrapper;

        initialState = {
            providers: {
                ...initialState.providers,
                ...loadedProps
            }
        };

        const initialStateUpdated = ({
            providers: {
                ...initialState.providers,
                entities: [sourcesDataGraphQl[0]],
                numberOfEntities: 1
            }
        });

        const store = mockStore(
            jest.fn()
            .mockImplementationOnce(() => initialState)
            .mockImplementationOnce(() => initialState)
            .mockImplementationOnce(() => initialState)
            .mockImplementationOnce(() => initialState)
            .mockImplementationOnce(() => initialState)
            // 5 initial renders :()
            .mockImplementation(() => initialStateUpdated)
        );

        await act(async () => {
            wrapper = mount(componentWrapperIntl(<SourcesSimpleView { ...initialProps } />, store));
        });

        wrapper.update();
        expect(wrapper.find(RowWrapper)).toHaveLength(sourcesDataGraphQl.length);

        // trigger render
        await act(async () => {
            wrapper.find('button').first().simulate('click');
        });

        wrapper.update();

        expect(wrapper.find(RowWrapper)).toHaveLength(1);
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
                expect(spy).toHaveBeenCalledWith('created_at', 'asc');

                done();
            });
        });
    });

    describe('helper functions', () => {
        const INTL_MOCK = { formatMessage: ({ defaultMessage }) => defaultMessage };
        const pushMock = jest.fn();

        describe('insertEditAction', () => {
            it('inserts edit item to index 1', () => {
                const ACTIONS = ['first', 'second'];

                insertEditAction(ACTIONS, INTL_MOCK, pushMock);

                expect(ACTIONS).toHaveLength(3);
                expect(ACTIONS[1]).toEqual(expect.objectContaining({
                    title: expect.any(String),
                    onClick: expect.any(Function)
                }));
            });
        });

        describe('actionResolver', () => {
            const actionObject = (title) => expect.objectContaining({
                title: title ? expect.stringContaining(title) : expect.any(String)
            });

            const MANAGE_APP_TITLE = 'Manage applications';
            const EDIT_TITLE = 'Edit';
            const DELETE_TITLE = 'Delete';

            it('create actions for editable source', () => {
                const EDITABLE_DATA = { imported: undefined };

                const actions = actionResolver(INTL_MOCK, pushMock)(EDITABLE_DATA);

                expect(actions).toHaveLength(3);
                expect(actions).toEqual(expect.arrayContaining([
                    actionObject(MANAGE_APP_TITLE),
                    actionObject(EDIT_TITLE),
                    actionObject(DELETE_TITLE)
                ]));
            });

            it('create actions for uneditable source', () => {
                const UNEDITABLE_DATA = { imported: true };

                const actions = actionResolver(INTL_MOCK, pushMock)(UNEDITABLE_DATA);

                expect(actions).toHaveLength(2);
                expect(actions).toEqual(expect.arrayContaining([
                    actionObject(MANAGE_APP_TITLE),
                    actionObject(DELETE_TITLE)
                ]));
            });
        });
    });
});
