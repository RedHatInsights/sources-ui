import { renderHook } from '@testing-library/react-hooks';
import { useIsLoaded } from '../../hooks/useIsLoaded';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

describe('useIsLoaded', () => {
  let mockStore;

  it('returns true when is loaded', () => {
    mockStore = {
      sources: { loaded: 0 },
    };
    const store = createStore(() => mockStore);

    const { result } = renderHook(() => useIsLoaded(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current).toEqual(true);
  });

  it('returns true when is loaded below zero (fallback check)', () => {
    mockStore = {
      sources: { loaded: -15 },
    };

    const store = createStore(() => mockStore);

    const { result } = renderHook(() => useIsLoaded(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current).toEqual(true);
  });

  it('returns false when is not loaded', () => {
    mockStore = {
      sources: { loaded: 1 },
    };

    const store = createStore(() => mockStore);

    const { result } = renderHook(() => useIsLoaded(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current).toEqual(false);
  });
});
