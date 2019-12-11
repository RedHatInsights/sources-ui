import { getDevStore, getProdStore } from '../../Utilities/store';
import { defaultProvidersState } from '../../redux/reducers/providers';

describe('store creator', () => {
    const EXPECTED_DEFAULT_STATE = {
        notifications: [],
        providers: defaultProvidersState
    };

    it('creates DevStore', () => {
        const store = getDevStore();

        expect(store.getState()).toEqual(EXPECTED_DEFAULT_STATE);
    });

    it('creates ProdStore', () => {
        const store = getProdStore();

        expect(store.getState()).toEqual(EXPECTED_DEFAULT_STATE);
    });
});
