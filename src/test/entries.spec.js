import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { ProdEntry } from '../entries';
import { DevEntry } from '../entries-dev';
import * as app from '../App';
import * as stores from '../Utilities/store';
import * as getDevStore from '../Utilities/getDevStore';
;
describe('entries test', () => {
    let store;
    beforeEach(() => {
        store = configureStore()({});
        getDevStore.getDevStore = jest.fn().mockImplementation(() => store);
        stores.getProdStore = jest.fn().mockImplementation(() => store);

        // eslint-disable-next-line react/display-name
        app.default = () => <h1></h1>;
    });

    it('dev is rendered correctly', () => {
        const wrapper = mount(<DevEntry />);

        expect(wrapper.find(Provider)).toHaveLength(1);
        expect(wrapper.find('h1')).toHaveLength(1);
        expect(getDevStore.getDevStore).toHaveBeenCalled();
        expect(stores.getProdStore).not.toHaveBeenCalled();
    });

    it('prod is rendered correctly', () => {
        const wrapper = mount(<ProdEntry />);

        expect(wrapper.find(Provider)).toHaveLength(1);
        expect(wrapper.find('h1')).toHaveLength(1);
        expect(getDevStore.getDevStore).not.toHaveBeenCalled();
        expect(stores.getProdStore).toHaveBeenCalled();
    });
});
