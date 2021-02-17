import { Provider } from 'react-redux';

import * as app from '../App';
import * as stores from '../utilities/store';
import * as getDevStore from '../utilities/getDevStore';
import mockStore from './__mocks__/mockStore';
import AppEntry from '../AppEntry';

describe('entries test', () => {
  let store;
  beforeEach(() => {
    store = mockStore({});
    getDevStore.getDevStore = jest.fn().mockImplementation(() => store);
    stores.getProdStore = jest.fn().mockImplementation(() => store);
    app.default = () => <h1></h1>;
  });

  it('dev is rendered correctly', () => {
    const wrapper = mount(<AppEntry store={getDevStore.getDevStore()} />);

    expect(wrapper.find(Provider)).toHaveLength(1);
    expect(wrapper.find('h1')).toHaveLength(1);
    expect(getDevStore.getDevStore).toHaveBeenCalled();
    expect(stores.getProdStore).not.toHaveBeenCalled();
  });

  it('prod is rendered correctly', () => {
    const wrapper = mount(<AppEntry />);

    expect(wrapper.find(Provider)).toHaveLength(1);
    expect(wrapper.find('h1')).toHaveLength(1);
    expect(getDevStore.getDevStore).not.toHaveBeenCalled();
    expect(stores.getProdStore).toHaveBeenCalled();
  });
});
