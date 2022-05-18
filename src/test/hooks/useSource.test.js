import * as redux from 'react-redux';

import { useSource } from '../../hooks/useSource';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  useParams: jest.fn().mockImplementation(() => ({ id: '121311231' })),
}));

jest.mock('react-redux', () => ({
  __esModule: true,
  useSelector: jest.fn(),
}));

describe('useSource', () => {
  let INPUT_FN = expect.any(Function);

  const ID = '121311231';
  const ENTITY = { id: ID, additionalInfo: 'abcd' };

  const MOCK_STORE = {
    sources: {
      entities: [ENTITY],
    },
  };

  beforeEach(() => {
    redux.useSelector = jest.fn().mockImplementation((fn) => fn(MOCK_STORE));
  });

  it('call useSelector', () => {
    useSource(ID);

    expect(redux.useSelector).toHaveBeenCalledWith(INPUT_FN);
  });

  it('returns object', () => {
    expect(useSource()).toEqual(ENTITY);
  });
});
