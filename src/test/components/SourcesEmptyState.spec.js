import SourcesEmptyState from '../../components/SourcesEmptyState';
import { mount } from 'enzyme';
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
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

describe('SourcesEmptyState', () => {
    it('renders correctly', () => {
        const wrapper = mount(
            <IntlProvider locale="en" >
                <MemoryRouter >
                    <SourcesEmptyState />
                </MemoryRouter>
            </IntlProvider>
        );

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
        const wrapper = mount(
            <IntlProvider locale="en" >
                <MemoryRouter >
                    <SourcesEmptyState title="Chyba" body="Velmi oskliva chyba"/>
                </MemoryRouter>
            </IntlProvider>
        );

        expect(wrapper.find(Title).text().includes('Chyba')).toEqual(true);
        expect(wrapper.find(EmptyStateBody).text().includes('Velmi oskliva chyba')).toEqual(true);
    });
});
