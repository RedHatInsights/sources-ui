import { useSource } from '../../hooks/useSource';
import { createStore } from 'redux';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

describe('useSource', () => {
  const ID = '121311231';
  const ENTITY = { id: ID, additionalInfo: 'abcd' };

  it('returns object', () => {
    const mockStore = {
      sources: {
        entities: [ENTITY],
      },
    };

    const store = createStore(() => mockStore);

    const { result } = renderHook(() => useSource(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/' + ID]}>
          <Routes>
            <Route path="/:id" element={<Provider store={store}>{children}</Provider>} />
          </Routes>
        </MemoryRouter>
      ),
    });

    expect(result.current).toEqual(ENTITY);
  });
});
