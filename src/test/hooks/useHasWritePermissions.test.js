import * as redux from 'react-redux';

import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';

describe('useHasWritePermissions', () => {
  let inputFn;
  let mockStore;

  beforeEach(() => {
    inputFn = expect.any(Function);
  });

  it('returns undefined when is not loaded', () => {
    mockStore = {
      user: { isOrgAdmin: undefined },
    };

    redux.useSelector = jest.fn().mockImplementation((fn) => fn(mockStore));

    const result = useHasWritePermissions();

    expect(result).toEqual(undefined);
    expect(redux.useSelector).toHaveBeenCalledWith(inputFn);
  });

  it('returns true when is loaded - has write permissions', () => {
    mockStore = {
      user: { isOrgAdmin: false, writePermissions: true },
    };

    redux.useSelector = jest.fn().mockImplementation((fn) => fn(mockStore));

    const result = useHasWritePermissions();

    expect(result).toEqual(true);
    expect(redux.useSelector).toHaveBeenCalledWith(inputFn);
  });

  it('returns true when is loaded - isOrgAdmin', () => {
    mockStore = {
      user: { isOrgAdmin: true, writePermissions: false },
    };

    redux.useSelector = jest.fn().mockImplementation((fn) => fn(mockStore));

    const result = useHasWritePermissions();

    expect(result).toEqual(true);
    expect(redux.useSelector).toHaveBeenCalledWith(inputFn);
  });

  it('returns true when is loaded - has write permissions and is admin', () => {
    mockStore = {
      user: { isOrgAdmin: true, writePermissions: true },
    };

    redux.useSelector = jest.fn().mockImplementation((fn) => fn(mockStore));

    const result = useHasWritePermissions();

    expect(result).toEqual(true);
    expect(redux.useSelector).toHaveBeenCalledWith(inputFn);
  });

  it('returns false when is loaded', () => {
    mockStore = {
      user: { isOrgAdmin: false, writePermissions: false },
    };

    redux.useSelector = jest.fn().mockImplementation((fn) => fn(mockStore));

    const result = useHasWritePermissions();

    expect(result).toEqual(false);
    expect(redux.useSelector).toHaveBeenCalledWith(inputFn);
  });
});
