import {
    removeMessage,
    updateSource,
    addHiddenSource,
    pageAndSize,
    loadEntities,
    sortEntities,
    removeSource,
    filterSources,
    clearFilters,
    removeApplication
} from '../../../redux/sources/actions';
import {
    ADD_HIDDEN_SOURCE,
    PAGE_AND_SIZE,
    ACTION_TYPES,
    SET_COUNT,
    SORT_ENTITIES,
    FILTER_SOURCES,
    CLEAR_FILTERS
} from '../../../redux/sources/actionTypes';
import { REMOVE_NOTIFICATION, ADD_NOTIFICATION } from '@redhat-cloud-services/frontend-components-notifications';
import * as updateSourceApi from '../../../api/doUpdateSource';
import * as api from '../../../api/entities';

describe('redux actions', () => {
    let dispatch;

    beforeEach(() => {
        dispatch = jest.fn().mockImplementation((x) => x);
    });

    afterEach(() => {
        dispatch.mockReset();
    });

    it('undoValues creates an object', () => {
        const SOURCE = { name: 'Stuart' };
        expect(addHiddenSource(SOURCE)).toEqual(
            expect.objectContaining({
                type: ADD_HIDDEN_SOURCE,
                payload: {
                    source: SOURCE
                }
            })
        );
    });

    it('removeMessage creates an object', () => {
        const ID = '123456';
        expect(removeMessage(ID)(dispatch)).toEqual(
            expect.objectContaining({
                type: REMOVE_NOTIFICATION,
                payload: ID
            })
        );
    });

    it('filterSources creates an object', async () => {
        const filterValue = { name: 'name' };

        await filterSources(filterValue)(dispatch);

        expect(dispatch.mock.calls).toHaveLength(2);
        expect(dispatch.mock.calls[0][0]).toEqual({
            type: FILTER_SOURCES,
            payload: {
                value: filterValue
            }
        });
        expect(dispatch.mock.calls[1][0]).toEqual(expect.any(Function));
    });

    describe('updateSource', () => {
        const SOURCE = { name: 'aaa' };
        const FORM_DATA = { formadata: true };
        const TITLE = 'title';
        const DESCRIPTION = 'description';
        const ERROR_TTITLES = { titles: 'blabla' };

        it('succesfuly calls doUpdateSource', async () => {
            updateSourceApi.doUpdateSource = jest.fn().mockImplementation(() => Promise.resolve('ok'));

            const result = await updateSource(SOURCE, FORM_DATA, TITLE, DESCRIPTION, ERROR_TTITLES)(dispatch);

            expect(result).toEqual(
                expect.objectContaining({
                    type: ADD_NOTIFICATION,
                    payload: {
                        variant: 'success',
                        title: TITLE,
                        description: DESCRIPTION,
                        dismissable: true
                    }
                })
            );
        });

        it('handle error', async () => {
            const ERROR = { detail: 'blabla' };
            updateSourceApi.doUpdateSource = jest.fn().mockImplementation(() => Promise.reject(ERROR));

            expect.assertions(2);
            try {
                await updateSource(SOURCE, FORM_DATA, TITLE, DESCRIPTION, ERROR_TTITLES)(dispatch);
            } catch (error) {
                expect(dispatch).toHaveBeenCalledWith(
                    expect.objectContaining({
                        type: 'FOOBAR_REJECTED',
                        payload: ERROR
                    })
                );
                expect(error).toEqual(ERROR);
            }
        });
    });

    describe('page and size', () => {
        it('call dispatch with changing size and loading values', async () => {
            const PAGE = 10;
            const SIZE = 15;

            await pageAndSize(PAGE, SIZE)(dispatch);

            expect(dispatch.mock.calls).toHaveLength(2);
            expect(dispatch.mock.calls[0][0]).toEqual({
                type: PAGE_AND_SIZE,
                payload: { page: PAGE, size: SIZE }
            });
            expect(dispatch.mock.calls[1][0]).toEqual(expect.any(Function));
        });
    });

    describe('sort entities', () => {
        it('call dispatch with changing column and direction', async () => {
            const COLUMN = 'type_id';
            const DIRECTION = 'desc';

            await sortEntities(COLUMN, DIRECTION)(dispatch);

            expect(dispatch.mock.calls).toHaveLength(2);
            expect(dispatch.mock.calls[0][0]).toEqual({
                type: SORT_ENTITIES,
                payload: { column: COLUMN, direction: DIRECTION }
            });
            expect(dispatch.mock.calls[1][0]).toEqual(expect.any(Function));
        });
    });

    describe('loadEntities', () => {
        const count = 15124;
        const sources = [{ aa: 'bb' }, { vv: 'ee' }];

        const [pageSize, pageNumber, sortBy, sortDirection, filterValue] = [15, 10, 'name', 'desc', 'pepa'];

        const getState = () => ({
            sources: {
                pageSize, pageNumber, sortBy, sortDirection, filterValue
            }
        });

        beforeEach(() => {
            api.doLoadEntities = jest.fn().mockImplementation(() => Promise.resolve({ sources }));
            api.doLoadCountOfSources = jest.fn().mockImplementation(() => Promise.resolve(
                { meta: { count } }
            ));
        });

        it('loads entities', async () => {
            await loadEntities()(dispatch, getState);

            expect(dispatch.mock.calls).toHaveLength(3);

            expect(dispatch.mock.calls[0][0]).toEqual({
                type: ACTION_TYPES.LOAD_ENTITIES_PENDING,
                options: undefined
            });
            expect(dispatch.mock.calls[1][0]).toEqual({
                type: SET_COUNT,
                payload: { count }
            });
            expect(dispatch.mock.calls[2][0]).toEqual({
                type: ACTION_TYPES.LOAD_ENTITIES_FULFILLED,
                payload: sources
            });
        });

        it('passes options to pending', async () => {
            const options = { custom: 'custom' };

            await loadEntities(options)(dispatch, getState);

            expect(dispatch.mock.calls).toHaveLength(3);

            expect(dispatch.mock.calls[0][0]).toEqual({
                type: ACTION_TYPES.LOAD_ENTITIES_PENDING,
                options
            });
            expect(dispatch.mock.calls[1][0]).toEqual({
                type: SET_COUNT,
                payload: { count }
            });
            expect(dispatch.mock.calls[2][0]).toEqual({
                type: ACTION_TYPES.LOAD_ENTITIES_FULFILLED,
                payload: sources
            });
        });

        it('handles failure', async () => {
            const ERROR_DETAIL = 'aaa';
            const ERROR = { detail: ERROR_DETAIL };

            api.doLoadEntities = jest.fn().mockImplementation(() => Promise.reject(ERROR));

            await loadEntities()(dispatch, getState);

            expect(dispatch.mock.calls).toHaveLength(3);

            expect(dispatch.mock.calls[0][0]).toEqual({
                type: ACTION_TYPES.LOAD_ENTITIES_PENDING,
                options: undefined
            });
            expect(dispatch.mock.calls[2][0]).toEqual({
                type: ACTION_TYPES.LOAD_ENTITIES_REJECTED,
                meta: { noError: true },
                payload: { error: { detail: ERROR_DETAIL, title: expect.any(String) } }
            });
        });

        it('handles failure with custom title', async () => {
            const ERROR_DETAIL = 'aaa';
            const ERROR_TITLE = 'some title';
            const ERROR = { detail: ERROR_DETAIL, title: ERROR_TITLE };

            api.doLoadEntities = jest.fn().mockImplementation(() => Promise.reject(ERROR));

            await loadEntities()(dispatch, getState);

            expect(dispatch.mock.calls).toHaveLength(3);

            expect(dispatch.mock.calls[0][0]).toEqual({
                type: ACTION_TYPES.LOAD_ENTITIES_PENDING,
                options: undefined
            });
            expect(dispatch.mock.calls[2][0]).toEqual({
                type: ACTION_TYPES.LOAD_ENTITIES_REJECTED,
                meta: { noError: true },
                payload: { error: { detail: ERROR_DETAIL, title: ERROR_TITLE } }
            });
        });
    });

    describe('doRemoveSource', () => {
        const sourceId = '12132145';
        const title = 'Some title here';

        it('loads entities', async () => {
            api.doRemoveSource = jest.fn().mockImplementation(() => Promise.resolve('OK'));

            await removeSource(sourceId, title)(dispatch);

            expect(dispatch.mock.calls).toHaveLength(4);

            expect(dispatch.mock.calls[0][0]).toEqual({
                type: ACTION_TYPES.REMOVE_SOURCE_PENDING,
                meta: {
                    sourceId
                }
            });

            expect(dispatch.mock.calls[1][0]).toEqual(expect.any(Function));

            expect(dispatch.mock.calls[2][0]).toEqual({
                type: ACTION_TYPES.REMOVE_SOURCE_FULFILLED,
                meta: {
                    sourceId
                }
            });

            expect(dispatch.mock.calls[3][0]).toEqual(expect.any(Function));
        });

        it('handle failure', async () => {
            api.doRemoveSource = jest.fn().mockImplementation(() => Promise.reject('OK'));

            await removeSource(sourceId, title)(dispatch);

            expect(dispatch.mock.calls).toHaveLength(2);

            expect(dispatch.mock.calls[0][0]).toEqual({
                type: ACTION_TYPES.REMOVE_SOURCE_PENDING,
                meta: {
                    sourceId
                }
            });

            expect(dispatch.mock.calls[1][0]).toEqual({
                type: ACTION_TYPES.REMOVE_SOURCE_REJECTED,
                meta: {
                    sourceId
                }
            });
        });
    });

    it('clearFilters creates an object', async () => {
        await clearFilters()(dispatch);

        expect(dispatch.mock.calls).toHaveLength(2);
        expect(dispatch.mock.calls[0][0]).toEqual({ type: CLEAR_FILTERS });
        expect(dispatch.mock.calls[1][0]).toEqual(expect.any(Function));
    });

    it('removeApplication calls doDeleteApplication (redux-promise)', async () => {
        const appId = '123';
        const sourceId = '54655';
        const successTitle = 'success title';
        const errorTitle = 'errorTitle';

        api.doDeleteApplication = jest.fn().mockImplementation(() => Promise.resolve('OK'));

        await removeApplication(appId, sourceId, successTitle, errorTitle)(dispatch);

        expect(dispatch.mock.calls).toHaveLength(1);

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ACTION_TYPES.REMOVE_APPLICATION,
            payload: expect.any(Function),
            meta: {
                appId,
                sourceId,
                notifications: {
                    fulfilled: {
                        variant: 'success',
                        title: successTitle,
                        dismissable: true
                    }
                }
            }
        });

        const resultObject = dispatch.mock.calls[0][0];

        expect(api.doDeleteApplication).not.toHaveBeenCalled();

        await resultObject.payload();

        expect(api.doDeleteApplication).toHaveBeenCalledWith(appId, errorTitle);
    });
});
