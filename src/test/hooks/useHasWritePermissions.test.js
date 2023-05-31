import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';

import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import { createStore } from 'redux';
describe('useHasWritePermissions', () => {
  let mockStore;

  it('returns undefined when is not loaded', () => {
    const mockStore = {
      user: { writePermissions: undefined },
    };
    const store = createStore(() => mockStore);

    const { result } = renderHook(() => useHasWritePermissions(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current).toEqual(undefined);
  });

  it('returns true when is loaded - has write permissions', () => {
    mockStore = {
      user: { writePermissions: true },
    };

    const store = createStore(() => mockStore);

    const { result } = renderHook(() => useHasWritePermissions(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current).toEqual(true);
  });

  it('returns false when is loaded', () => {
    mockStore = {
      user: { writePermissions: false },
    };

    const store = createStore(() => mockStore);
    const { result } = renderHook(() => useHasWritePermissions(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current).toEqual(false);
  });
});
