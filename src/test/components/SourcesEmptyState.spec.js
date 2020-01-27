import SourcesEmptyState from '../../components/SourcesEmptyState';
import {
    Bullseye,
    Card,
    CardBody,
    Title,
    Button,
    EmptyState,
    EmptyStateIcon,
    EmptyStateBody
} from '@patternfly/react-core';
import configureStore from 'redux-mock-store';
import { componentWrapperIntl } from '../../Utilities/testsHelpers';

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
        expect(wrapper.find(Card)).toHaveLength(1);
        expect(wrapper.find(EmptyStateIcon)).toHaveLength(1);
        expect(wrapper.find(EmptyStateBody)).toHaveLength(1);
        expect(wrapper.find(Button)).toHaveLength(1);
        expect(wrapper.find(Title)).toHaveLength(1);
        expect(wrapper.find(CardBody)).toHaveLength(1);
        expect(wrapper.find(Bullseye)).toHaveLength(1);
    });

    it('renders correctly with custom props', () => {
        const wrapper = mount(componentWrapperIntl(<SourcesEmptyState title="Chyba" body="Velmi oskliva chyba"/>, store));

        expect(wrapper.find(Title).text().includes('Chyba')).toEqual(true);
        expect(wrapper.find(EmptyStateBody).text().includes('Velmi oskliva chyba')).toEqual(true);
    });

    it('renders as not org admin', () => {
        store = mockStore({ user: { isOrgAdmin: false } });

        const wrapper = mount(componentWrapperIntl(<SourcesEmptyState />, store));

        expect(wrapper.find(EmptyState)).toHaveLength(1);
        expect(wrapper.find(Card)).toHaveLength(1);
        expect(wrapper.find(EmptyStateIcon)).toHaveLength(1);
        expect(wrapper.find(EmptyStateBody)).toHaveLength(1);
        expect(wrapper.find(Button)).toHaveLength(0);
        expect(wrapper.find(Title)).toHaveLength(1);
        expect(wrapper.find(CardBody)).toHaveLength(1);
        expect(wrapper.find(Bullseye)).toHaveLength(1);
    });
});
