import SourcesEmptyState from '../../../components/SourcesTable/SourcesEmptyState';
import { Bullseye, Title, EmptyState, EmptyStateIcon, EmptyStateBody } from '@patternfly/react-core';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { CLOUD_VENDOR, REDHAT_VENDOR } from '../../../utilities/constants';
import mockStore from '../../__mocks__/mockStore';

describe('SourcesEmptyState', () => {
  let store;

  it('renders correctly on cloud vendor', () => {
    store = mockStore({
      sources: {
        activeVendor: CLOUD_VENDOR,
      },
    });

    const wrapper = mount(componentWrapperIntl(<SourcesEmptyState />, store));

    expect(wrapper.find(EmptyState)).toHaveLength(1);
    expect(wrapper.find(EmptyStateIcon)).toHaveLength(1);
    expect(wrapper.find(EmptyStateBody)).toHaveLength(1);
    expect(wrapper.find(Title)).toHaveLength(1);
    expect(wrapper.find(Bullseye)).toHaveLength(1);
    expect(wrapper.find('br')).toHaveLength(0);
    expect(wrapper.find(EmptyState).props().className).toEqual('ins-c-sources__empty-state');
    expect(wrapper.find(EmptyStateBody).text()).toEqual(
      'You don’t have any cloud sources configured. Add a source to connect to your Red Hat applications.'
    );
  });

  it('renders correctly on Red Hat vendor', () => {
    store = mockStore({
      sources: {
        activeVendor: REDHAT_VENDOR,
      },
    });

    const wrapper = mount(componentWrapperIntl(<SourcesEmptyState />, store));

    expect(wrapper.find(EmptyState)).toHaveLength(1);
    expect(wrapper.find(EmptyStateIcon)).toHaveLength(1);
    expect(wrapper.find(EmptyStateBody)).toHaveLength(1);
    expect(wrapper.find(Title)).toHaveLength(1);
    expect(wrapper.find(Bullseye)).toHaveLength(1);
    expect(wrapper.find('br')).toHaveLength(0);
    expect(wrapper.find(EmptyState).props().className).toEqual('ins-c-sources__empty-state');
    expect(wrapper.find(EmptyStateBody).text()).toEqual(
      'You don’t have any Red Hat sources configured. Add a source to connect to your Red Hat applications.'
    );
  });
});
