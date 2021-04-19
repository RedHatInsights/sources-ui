import { mount } from 'enzyme';
import { Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { routes, replaceRouteId } from '../../../Routes';
import { sourcesDataGraphQl } from '../../__mocks__/sourcesData';

import { EmptyState, Spinner } from '@patternfly/react-core';

import SubmittingModal from '../../../components/SourceEditForm/SubmittingModal';
import mockStore from '../../__mocks__/mockStore';
import LoadingStep from '../../../components/steps/LoadingStep';

describe('SubmittingModal', () => {
  let store;
  let initialEntry;
  let wrapper;

  beforeEach(async () => {
    initialEntry = [replaceRouteId(routes.sourcesDetail.path, '14')];
    store = mockStore({
      sources: {
        entities: sourcesDataGraphQl,
      },
    });

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <SubmittingModal {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();
  });

  it('renders correctly', async () => {
    expect(wrapper.find(LoadingStep)).toHaveLength(1);

    expect(wrapper.find(Spinner)).toHaveLength(1);
    expect(wrapper.find(EmptyState).text()).toEqual('Validating edited source credentials');
  });
});
