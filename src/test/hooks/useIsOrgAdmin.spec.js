import * as redux from 'react-redux';

import { useIsOrgAdmin } from '../../hooks/useIsOrgAdmin';

describe('useIsOrgAdmin', () => {
    let inputFn;
    let mockStore;

    beforeEach(() => {
        inputFn = expect.any(Function);
    });

    it('returns undefined when is not loaded', () => {
        mockStore = {
            user: { isOrgAdmin: undefined }
        };

        redux.useSelector = jest.fn().mockImplementation(fn => fn(mockStore));

        const result = useIsOrgAdmin();

        expect(result).toEqual(undefined);
        expect(redux.useSelector).toHaveBeenCalledWith(inputFn);
    });

    it('returns true when is loaded', () => {
        mockStore = {
            user: { isOrgAdmin: true }
        };

        redux.useSelector = jest.fn().mockImplementation(fn => fn(mockStore));

        const result = useIsOrgAdmin();

        expect(result).toEqual(true);
        expect(redux.useSelector).toHaveBeenCalledWith(inputFn);
    });

    it('returns false when is not loaded', () => {
        mockStore = {
            user: { isOrgAdmin: false }
        };

        redux.useSelector = jest.fn().mockImplementation(fn => fn(mockStore));

        const result = useIsOrgAdmin();

        expect(result).toEqual(false);
        expect(redux.useSelector).toHaveBeenCalledWith(inputFn);
    });
});
