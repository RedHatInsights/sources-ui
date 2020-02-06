import React from 'react';
import thunk from 'redux-thunk';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import configureStore from 'redux-mock-store';
import { Table, TableHeader, TableBody, RowWrapper, sortable, ActionsColumn } from '@patternfly/react-table';
import { MemoryRouter } from 'react-router-dom';
import { RowLoader } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';
import { act } from 'react-dom/test-utils';

import SourcesSimpleView, { insertEditAction, actionResolver, prepareColumnsCells } from '../../../components/SourcesSimpleView/SourcesSimpleView';
import { PlaceHolderTable, RowWrapperLoader } from '../../../components/SourcesSimpleView/loaders';
import EmptyStateTable from '../../../components/SourcesSimpleView/EmptyStateTable';

import { sourcesDataGraphQl } from '../../sourcesData';
import { sourceTypesData } from '../../sourceTypesData';
import { applicationTypesData } from '../../applicationTypesData';

import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import * as actions from '../../../redux/sources/actions';
import * as API from '../../../api/entities';
import { replaceRouteId, routes } from '../../../Routes';
import { defaultSourcesState } from '../../../redux/sources/reducer';

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
            sources: defaultSourcesState,
            user: {
                isOrgAdmin: true
            }
        };
        loadedProps = {
            loaded: 0,
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

        expect(wrapper.find(PlaceHolderTable)).toHaveLength(1);
    });

    it('renders removing row', (done) => {
        initialState = {
            ...initialState,
            sources: {
                ...initialState.sources,
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
            ...initialState,
            sources: {
                ...initialState.sources,
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
                expect(wrapper.find(ActionsColumn)).toHaveLength(sourcesDataGraphQl.length);
                expect(wrapper.find(RowWrapper).first().props().className).toEqual(ROW_WRAPPER_CLASSNAME);
                done();
            });
        });
    });

    it('renders table when loaded and its not org admin - no action column', async () => {
        const ROW_WRAPPER_CLASSNAME = 'ins-c-sources__row-vertical-centered';
        initialState = {
            user: {
                isOrgAdmin: false
            },
            sources: {
                ...initialState.sources,
                ...loadedProps
            }
        };

        const store = mockStore(initialState);
        let wrapper;

        await act(async () => {
            wrapper = mount(componentWrapperIntl(<SourcesSimpleView { ...initialProps } />, store));
        });
        wrapper.update();

        expect(wrapper.find(PlaceHolderTable)).toHaveLength(0);
        expect(wrapper.find(Table)).toHaveLength(1);
        expect(wrapper.find(TableHeader)).toHaveLength(1);
        expect(wrapper.find(TableBody)).toHaveLength(1);
        expect(wrapper.find(RowWrapper)).toHaveLength(sourcesDataGraphQl.length);
        expect(wrapper.find(ActionsColumn)).toHaveLength(0);
        expect(wrapper.find(RowWrapper).first().props().className).toEqual(ROW_WRAPPER_CLASSNAME);
    });

    it('renders empty state table', async () => {
        initialState = {
            ...initialState,
            sources: {
                ...initialState.sources,
                ...loadedProps,
                entities: [],
                numberOfEntities: 0,
                filterValue: {
                    name: 'not-existing-name'
                }
            }
        };

        const store = mockStore(initialState);
        let wrapper;

        await act(async () => {
            wrapper = mount(componentWrapperIntl(<SourcesSimpleView { ...initialProps } />, store));
        });
        wrapper.update();

        expect(wrapper.find(EmptyStateTable)).toHaveLength(1);
        expect(wrapper.find(Table)).toHaveLength(1);
        expect(wrapper.find(TableHeader)).toHaveLength(1);
        expect(wrapper.find(TableBody)).toHaveLength(1);
        expect(wrapper.find(ActionsColumn)).toHaveLength(0);
    });

    it('re-renders when entities changed', async () => {
        let wrapper;

        initialState = {
            ...initialState,
            sources: {
                ...initialState.sources,
                ...loadedProps
            }
        };

        const initialStateUpdated = ({
            ...initialState,
            sources: {
                ...initialState.sources,
                entities: [sourcesDataGraphQl[0]],
                numberOfEntities: 1
            }
        });

        let mockStoreFn = jest.fn().mockImplementation(() => initialState);
        const store = mockStore(mockStoreFn);

        await act(async () => {
            wrapper = mount(componentWrapperIntl(<SourcesSimpleView { ...initialProps } />, store));
        });

        wrapper.update();
        expect(wrapper.find(RowWrapper)).toHaveLength(sourcesDataGraphQl.length);

        mockStoreFn.mockImplementation(() => initialStateUpdated);

        // trigger render
        await act(async () => {
            wrapper.find('button').first().simulate('click');
        });

        wrapper.update();

        expect(wrapper.find(RowWrapper)).toHaveLength(1);
    });

    describe('actions', () => {
        const MANAGE_APPS_INDEX = 0;
        const EDIT_SOURCE_INDEX = 1;
        const DELETE_SOURCE_INDEX = 2;
        let wrapper;

        beforeEach(() => {
            initialState = {
                ...initialState,
                sources: {
                    ...initialState.sources,
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

                    const expectedPath = replaceRouteId(routes.sourcesEdit.path, sourcesDataGraphQl[0].id);
                    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(expectedPath);
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

                    const expectedPath = replaceRouteId(routes.sourcesRemove.path, sourcesDataGraphQl[0].id);
                    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(expectedPath);
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

                    const expectedPath = replaceRouteId(routes.sourceManageApps.path, sourcesDataGraphQl[0].id);
                    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(expectedPath);
                    done();
                });
            });
        });
    });

    it('calls sortEntities', (done) => {
        const spy = jest.spyOn(actions, 'sortEntities');

        initialState = {
            ...initialState,
            sources: {
                ...initialState.sources,
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

        describe('prepareColumnsCells', () => {
            it('prepares columns cells', () => {
                const columns = [
                    {
                        title: 'name',
                        value: 'name',
                        searchable: true,
                        formatter: 'nameFormatter',
                        sortable: false
                    },
                    {
                        title: 'date',
                        value: 'date',
                        nonsense: true,
                        sortable: true
                    }
                ];

                expect(prepareColumnsCells(columns)).toEqual([{
                    title: 'name',
                    value: 'name'
                }, {
                    title: 'date',
                    value: 'date',
                    transforms: [sortable]
                }]);
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
