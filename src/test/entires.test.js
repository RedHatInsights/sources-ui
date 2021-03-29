import { Provider } from 'react-redux';

import * as app from '../App';
import * as stores from '../utilities/store';
import * as getDevStore from '../utilities/getDevStore';
import mockStore from './__mocks__/mockStore';

describe('entries test', () => {
  let wrapper;

  beforeEach(() => {
    const prodStore = mockStore({ sources: { prod: true } });
    const devStore = mockStore({ sources: { dev: true } });

    getDevStore.getDevStore = jest.fn().mockImplementation(() => devStore);
    stores.getProdStore = jest.fn().mockImplementation(() => prodStore);
    app.default = () => <h1></h1>;
  });

  it('dev is rendered correctly', async () => {
    const DevEntry = (await import('../DevEntry')).default;

    wrapper = mount(<DevEntry />);

    expect(wrapper.find(Provider)).toHaveLength(1);
    expect(wrapper.find('h1')).toHaveLength(1);

    expect(wrapper.find(Provider).props().store.getState().sources.dev).toEqual(true);
  });

  it('prod is rendered correctly', async () => {
    const AppEntry = (await import('../AppEntry')).default;

    wrapper = mount(<AppEntry />);

    expect(wrapper.find(Provider)).toHaveLength(1);
    expect(wrapper.find('h1')).toHaveLength(1);

    expect(wrapper.find(Provider).props().store.getState().sources.prod).toEqual(true);
  });
});
