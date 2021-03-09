import { mount } from 'enzyme';
import { Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { routes, replaceRouteId } from '../../../Routes';
import { sourcesDataGraphQl } from '../../__mocks__/sourcesData';

import ErroredModal from '../../../components/SourceEditForm/ErroredModal';

import { Button } from '@patternfly/react-core/dist/esm/components/Button/Button';
import { EmptyState } from '@patternfly/react-core/dist/esm/components/EmptyState/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/esm/components/EmptyState/EmptyStateBody';
import { Title } from '@patternfly/react-core/dist/esm/components/Title/Title';

import mockStore from '../../__mocks__/mockStore';
import ErroredStep from '../../../components/steps/ErroredStep';

describe('ErroredModal', () => {
  let store;
  let initialEntry;
  let wrapper;
  let onRetry;

  beforeEach(async () => {
    initialEntry = [replaceRouteId(routes.sourcesDetail.path, '14')];
    store = mockStore({
      sources: {
        entities: sourcesDataGraphQl,
      },
    });
    onRetry = jest.fn();

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ErroredModal {...args} onRetry={onRetry} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();
  });

  it('renders correctly', async () => {
    expect(wrapper.find(ErroredStep)).toHaveLength(1);

    expect(wrapper.find(Title).last().text()).toEqual('Something went wrong');
    expect(wrapper.find(EmptyStateBody).text()).toEqual(
      'There was a problem while trying to edit your source. Please try again. If the error persists, open a support case.'
    );
  });

  it('calls onRetry', async () => {
    expect(onRetry).not.toHaveBeenCalled();

    await act(async () => {
      wrapper.find(EmptyState).find(Button).simulate('click');
    });

    expect(onRetry).toHaveBeenCalled();
  });
});
