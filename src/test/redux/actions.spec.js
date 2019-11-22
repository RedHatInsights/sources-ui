import { undoAddSource, clearAddSource, removeMessage, updateSource } from '../../redux/actions/providers';
import { UNDO_ADD_SOURCE, CLEAR_ADD_SOURCE } from '../../redux/action-types-providers';
import { REMOVE_NOTIFICATION, ADD_NOTIFICATION } from '@redhat-cloud-services/frontend-components-notifications';
import * as updateSourceApi from '../../api/doUpdateSource';

describe('redux actions', () => {
    const dispatch = (x) => x;

    it('undoAddSource creates an object', () => {
        const VALUES = { name: 'Stuart' };
        expect(undoAddSource(VALUES)).toEqual(
            expect.objectContaining({
                type: UNDO_ADD_SOURCE,
                payload: {
                    values: VALUES
                }
            })
        );
    });

    it('clearAddSource creates an object', () => {
        expect(clearAddSource()).toEqual(
            expect.objectContaining({
                type: CLEAR_ADD_SOURCE
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

            const result = await updateSource(SOURCE, FORM_DATA, TITLE, DESCRIPTION, ERROR_TTITLES)(dispatch);

            expect(result).toEqual(
                expect.objectContaining({
                    type: 'FOOBAR_REJECTED',
                    payload: ERROR
                })
            );
        });
    });
});
