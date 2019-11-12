import { undoAddSource, clearAddSource, removeMessage } from '../../redux/actions/providers';
import { UNDO_ADD_SOURCE, CLEAR_ADD_SOURCE } from '../../redux/action-types-providers';
import { REMOVE_NOTIFICATION } from '@redhat-cloud-services/frontend-components-notifications';

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
});
