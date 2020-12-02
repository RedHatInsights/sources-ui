import SourcesEmptyState from '../../components/SourcesTable/SourcesEmptyState';
import { Bullseye, Title, EmptyState, EmptyStateIcon, EmptyStateBody } from '@patternfly/react-core';
import { componentWrapperIntl } from '../../utilities/testsHelpers';

describe('SourcesEmptyState', () => {
  it('renders correctly', () => {
    const wrapper = mount(componentWrapperIntl(<SourcesEmptyState />));

    expect(wrapper.find(EmptyState)).toHaveLength(1);
    expect(wrapper.find(EmptyStateIcon)).toHaveLength(1);
    expect(wrapper.find(EmptyStateBody)).toHaveLength(1);
    expect(wrapper.find(Title)).toHaveLength(1);
    expect(wrapper.find(Bullseye)).toHaveLength(1);
    expect(wrapper.find('br')).toHaveLength(0);
    expect(wrapper.find(EmptyState).props().className).toEqual('ins-c-sources__empty-state');
  });
});
