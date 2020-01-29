import { loadOrgAdmin } from '../../../redux/user/actions';
import * as sourcesActions from '../../../redux/sources/actions';
import { ACTION_TYPES } from '../../../redux/user/actions-types';

describe('user reducer actions', () => {
    const TITLE = 'TIIITLE';
    const DESCRIPTION = 'DEEESCRIPTION';
    const MESSAGE_TYPE = ({ type: 'message blabla' });

    let getUserSpy;
    let dispatch;

    let _insights;

    beforeEach(() => {
        _insights = insights;

        dispatch = jest.fn();

        sourcesActions.addMessage = jest.fn().mockImplementation(() => MESSAGE_TYPE);
    });

    afterEach(() => {
        insights = _insights;
    });

    describe('loadOrgAdmin', () => {
        it('is org admin', async () => {
            const isOrgAdmin = true;

            getUserSpy = jest.fn().mockImplementation(() => Promise.resolve({
                identity: {
                    user: {
                        is_org_admin: isOrgAdmin
                    }
                }
            }));

            insights = {
                chrome: {
                    auth: {
                        getUser: getUserSpy
                    }
                }
            };

            await loadOrgAdmin(TITLE, DESCRIPTION)(dispatch);

            expect(sourcesActions.addMessage).not.toHaveBeenCalled();

            expect(dispatch.mock.calls.length).toEqual(2);

            expect(dispatch.mock.calls[0][0]).toEqual({ type: ACTION_TYPES.SET_ORG_ADMIN_PENDING });
            expect(dispatch.mock.calls[1][0]).toEqual({
                type: ACTION_TYPES.SET_ORG_ADMIN_FULFILLED,
                payload: isOrgAdmin
            });
        });

        it('is not org admin', async () => {
            const isOrgAdmin = false;

            getUserSpy = jest.fn().mockImplementation(() => Promise.resolve({
                identity: {
                    user: {
                        is_org_admin: isOrgAdmin
                    }
                }
            }));

            insights = {
                chrome: {
                    auth: {
                        getUser: getUserSpy
                    }
                }
            };

            await loadOrgAdmin(TITLE, DESCRIPTION)(dispatch);

            expect(sourcesActions.addMessage).toHaveBeenCalledWith(TITLE, 'info', DESCRIPTION);

            expect(dispatch.mock.calls.length).toEqual(3);

            expect(dispatch.mock.calls[0][0]).toEqual({ type: ACTION_TYPES.SET_ORG_ADMIN_PENDING });
            expect(dispatch.mock.calls[1][0]).toEqual({
                type: ACTION_TYPES.SET_ORG_ADMIN_FULFILLED,
                payload: isOrgAdmin
            });
            expect(dispatch.mock.calls[2][0]).toEqual(MESSAGE_TYPE);
        });

        it('rejected', async () => {
            const ERROR = {
                detail: 'detail'
            };

            getUserSpy = jest.fn().mockImplementation(() => Promise.reject(ERROR));

            insights = {
                chrome: {
                    auth: {
                        getUser: getUserSpy
                    }
                }
            };

            await loadOrgAdmin(TITLE, DESCRIPTION)(dispatch);

            expect(sourcesActions.addMessage).not.toHaveBeenCalled();

            expect(dispatch.mock.calls.length).toEqual(2);

            expect(dispatch.mock.calls[0][0]).toEqual({ type: ACTION_TYPES.SET_ORG_ADMIN_PENDING });
            expect(dispatch.mock.calls[1][0]).toEqual({
                type: ACTION_TYPES.SET_ORG_ADMIN_REJECTED,
                payload: { error: { detail: ERROR.detail, title: expect.any(String) } }
            });
        });

        it('rejected with data', async () => {
            const ERROR = {
                data: 'detail'
            };

            getUserSpy = jest.fn().mockImplementation(() => Promise.reject(ERROR));

            insights = {
                chrome: {
                    auth: {
                        getUser: getUserSpy
                    }
                }
            };

            await loadOrgAdmin(TITLE, DESCRIPTION)(dispatch);

            expect(sourcesActions.addMessage).not.toHaveBeenCalled();

            expect(dispatch.mock.calls.length).toEqual(2);

            expect(dispatch.mock.calls[0][0]).toEqual({ type: ACTION_TYPES.SET_ORG_ADMIN_PENDING });
            expect(dispatch.mock.calls[1][0]).toEqual({
                type: ACTION_TYPES.SET_ORG_ADMIN_REJECTED,
                payload: { error: { detail: ERROR.data, title: expect.any(String) } }
            });
        });
    });
});
