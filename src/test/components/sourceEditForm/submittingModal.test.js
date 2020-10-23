import { mount } from 'enzyme';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { routes, replaceRouteId } from '../../../Routes';
import { sourcesDataGraphQl } from '../../__mocks__/sourcesData';

import WrapperModal from '../../../components/SourceEditForm/WrapperModal';

import { EmptyState } from '@patternfly/react-core/dist/js/components/EmptyState';
import { Spinner } from '@patternfly/react-core';

import SubmittingModal from '../../../components/SourceEditForm/SubmittingModal';
import LoadingStep from '@redhat-cloud-services/frontend-components-sources/cjs/LoadingStep';

describe('SubmittingModal', () => {
  let store;
  let mockStore;
  let initialEntry;
  let wrapper;

  const middlewares = [thunk, notificationsMiddleware()];

  beforeEach(async () => {
    initialEntry = [replaceRouteId(routes.sourcesEdit.path, '14')];
    mockStore = configureStore(middlewares);
    store = mockStore({
      sources: {
        entities: sourcesDataGraphQl,
      },
    });

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesEdit.path} render={(...args) => <SubmittingModal {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();
  });

  it('renders correctly', async () => {
    expect(wrapper.find(WrapperModal)).toHaveLength(1);
    expect(wrapper.find(LoadingStep)).toHaveLength(1);

    expect(wrapper.find(Spinner)).toHaveLength(1);
    expect(wrapper.find(EmptyState).text()).toEqual('Validating edited source credentials');
  });
});
