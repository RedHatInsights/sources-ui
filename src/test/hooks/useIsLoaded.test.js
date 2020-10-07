import * as redux from 'react-redux';

import { useIsLoaded } from '../../hooks/useIsLoaded';

describe('useIsLoaded', () => {
  let inputFn;
  let mockStore;

  beforeEach(() => {
    inputFn = expect.any(Function);
  });

  it('returns true when is loaded', () => {
    mockStore = {
      sources: { loaded: 0 },
    };

    redux.useSelector = jest.fn().mockImplementation((fn) => fn(mockStore));

    const result = useIsLoaded();

    expect(result).toEqual(true);
    expect(redux.useSelector).toHaveBeenCalledWith(inputFn);
  });

  it('returns true when is loaded below zero (fallback check)', () => {
    mockStore = {
      sources: { loaded: -15 },
    };

    redux.useSelector = jest.fn().mockImplementation((fn) => fn(mockStore));

    const result = useIsLoaded();

    expect(result).toEqual(true);
    expect(redux.useSelector).toHaveBeenCalledWith(inputFn);
  });

  it('returns false when is not loaded', () => {
    mockStore = {
      sources: { loaded: 1 },
    };

    redux.useSelector = jest.fn().mockImplementation((fn) => fn(mockStore));

    const result = useIsLoaded();

    expect(result).toEqual(false);
    expect(redux.useSelector).toHaveBeenCalledWith(inputFn);
  });
});
