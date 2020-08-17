import SourcesEmptyState from '../../components/SourcesEmptyState';
import {
    Bullseye,
    Title,
    Button,
    EmptyState,
    EmptyStateIcon,
    EmptyStateBody
} from '@patternfly/react-core';
import configureStore from 'redux-mock-store';
import { componentWrapperIntl } from '../../utilities/testsHelpers';

describe('SourcesEmptyState', () => {
    let mockStore;
    let store;

    beforeEach(() => {
        mockStore = configureStore([]);
        store = mockStore({ user: { isOrgAdmin: true } });
    });

    it('renders correctly', () => {
        const wrapper = mount(componentWrapperIntl(<SourcesEmptyState />, store));

        expect(wrapper.find(EmptyState)).toHaveLength(1);
        expect(wrapper.find(EmptyStateIcon)).toHaveLength(1);
        expect(wrapper.find(EmptyStateBody)).toHaveLength(1);
        expect(wrapper.find(Button)).toHaveLength(1);
        expect(wrapper.find(Title)).toHaveLength(1);
        expect(wrapper.find(Bullseye)).toHaveLength(1);
        expect(wrapper.find('br')).toHaveLength(0);
        expect(wrapper.find(EmptyState).props().className).toEqual('ins-c-sources__empty-state');
    });

    it('renders as not org admin', () => {
        store = mockStore({ user: { isOrgAdmin: false } });

        const wrapper = mount(componentWrapperIntl(<SourcesEmptyState />, store));

        expect(wrapper.find(EmptyState)).toHaveLength(1);
        expect(wrapper.find(EmptyStateIcon)).toHaveLength(1);
        expect(wrapper.find(EmptyStateBody)).toHaveLength(1);
        expect(wrapper.find(Button)).toHaveLength(1);
        expect(wrapper.find(Button).props().isDisabled).toEqual(true);
        expect(wrapper.find(Title)).toHaveLength(1);
        expect(wrapper.find(Bullseye)).toHaveLength(1);
        expect(wrapper.find('br')).toHaveLength(1);
        expect(wrapper.find(EmptyState).props().className).toEqual('ins-c-sources__empty-state');
    });
});
