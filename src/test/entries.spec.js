import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { DevEntry, ProdEntry } from '../entries';
import * as app from '../App';
import * as stores from '../Utilities/store';

describe('entries test', () => {
    let store;

    beforeEach(() => {
        store = configureStore()({});
        stores.getDevStore = jest.fn().mockImplementation(() => store);
        stores.getProdStore = jest.fn().mockImplementation(() => store);

        // eslint-disable-next-line react/display-name
        app.default = () => <h1></h1>;
    });

    it('dev is rendered correctly', () => {
        const wrapper = mount(<DevEntry />);

        expect(wrapper.find(Provider)).toHaveLength(1);
        expect(wrapper.find('h1')).toHaveLength(1);
        expect(stores.getDevStore).toHaveBeenCalled();
        expect(stores.getProdStore).not.toHaveBeenCalled();
    });

    it('prod is rendered correctly', () => {
        const wrapper = mount(<ProdEntry />);

        expect(wrapper.find(Provider)).toHaveLength(1);
        expect(wrapper.find('h1')).toHaveLength(1);
        expect(stores.getDevStore).not.toHaveBeenCalled();
        expect(stores.getProdStore).toHaveBeenCalled();
    });
});
