import { render, screen } from '@testing-library/react';

import * as app from '../App';
import * as stores from '../utilities/store';
import * as getDevStore from '../utilities/getDevStore';
import mockStore from './__mocks__/mockStore';

describe('entries test', () => {
  beforeEach(() => {
    const prodStore = mockStore({ sources: { prod: true } });
    const devStore = mockStore({ sources: { dev: true } });

    getDevStore.getDevStore = jest.fn().mockImplementation(() => devStore);
    stores.getProdStore = jest.fn().mockImplementation(() => prodStore);
    app.default = () => <h1>App</h1>;
  });

  it('dev is rendered correctly', async () => {
    const DevEntry = (await import('../DevEntry')).default;

    render(<DevEntry />);

    expect(screen.getByText('App', { selector: 'h1' })).toBeInTheDocument();
    expect(getDevStore.getDevStore).toHaveBeenCalled();
  });

  it('prod is rendered correctly', async () => {
    const AppEntry = (await import('../AppEntry')).default;

    render(<AppEntry />);

    expect(screen.getByText('App', { selector: 'h1' })).toBeInTheDocument();
    expect(stores.getProdStore).toHaveBeenCalled();
  });
});
