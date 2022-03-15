import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route } from 'react-router-dom';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { routes, replaceRouteId } from '../../../Routes';
import { sourcesDataGraphQl } from '../../__mocks__/sourcesData';

import ErroredModal from '../../../components/SourceEditForm/ErroredModal';

import mockStore from '../../__mocks__/mockStore';

describe('ErroredModal', () => {
  let store;
  let initialEntry;
  let onRetry;

  beforeEach(async () => {
    initialEntry = [replaceRouteId(routes.sourcesDetail.path, '14')];
    store = mockStore({
      sources: {
        entities: sourcesDataGraphQl,
      },
    });
    onRetry = jest.fn();

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <ErroredModal {...args} onRetry={onRetry} />} />,
        store,
        initialEntry
      )
    );
  });

  it('renders correctly', async () => {
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText(
        'There was a problem while trying to edit your source. Please try again. If the error persists, open a support case.'
      )
    ).toBeInTheDocument();
  });

  it('calls onRetry', async () => {
    expect(onRetry).not.toHaveBeenCalled();

    userEvent.click(screen.getByText('Retry'));

    expect(onRetry).toHaveBeenCalled();
  });
});
