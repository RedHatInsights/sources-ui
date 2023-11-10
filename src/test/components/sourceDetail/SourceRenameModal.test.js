import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { Route, Routes } from 'react-router-dom';
import { replaceRouteId, routes } from '../../../Routing';
import SourceRenameModal from '../../../components/SourceDetail/SourceRenameModal';
import * as actions from '../../../redux/sources/actions';
import mockStore from '../../__mocks__/mockStore';

jest.mock('../../../components/addSourceWizard/SourceAddSchema', () => ({
  __esModule: true,
  asyncValidatorDebounced: jest.fn(),
}));

describe('SourceRenameModal', () => {
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetailRename.path, sourceId)];

  beforeEach(() => {
    store = mockStore({
      sources: {
        entities: [
          {
            id: sourceId,
            name: 'old-name',
          },
        ],
      },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={`${routes.sourcesDetail.path}/*`} element={<SourceRenameModal />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );
  });

  it('renders correctly', () => {
    expect(screen.getByText('Rename source')).toBeInTheDocument();
    expect(screen.getByText('Enter a new name for your source.')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('close on close icon', async () => {
    const user = userEvent.setup();

    await waitFor(async () => {
      await user.click(screen.getByLabelText('Close'));
    });

    expect(screen.getByTestId('location-display').textContent).toEqual(
      replaceRouteId(`/settings/integrations/${routes.sourcesDetail.path}`, sourceId),
    );
  });

  it('close on cancel', async () => {
    const user = userEvent.setup();

    await waitFor(async () => {
      await user.click(screen.getByText('Cancel'));
    });

    expect(screen.getByTestId('location-display').textContent).toEqual(
      replaceRouteId(`/settings/integrations/${routes.sourcesDetail.path}`, sourceId),
    );
  });

  it('submits', async () => {
    const user = userEvent.setup();

    actions.renameSource = jest.fn().mockImplementation(() => ({ type: 'something' }));

    await waitFor(async () => {
      await user.clear(screen.getByRole('textbox'));
    });
    await waitFor(async () => {
      await user.type(screen.getByRole('textbox'), 'new-name');
    });
    await waitFor(async () => {
      await user.click(screen.getByText('Save'));
    });

    expect(actions.renameSource).toHaveBeenCalledWith(sourceId, 'new-name', 'Renaming was unsuccessful');
    expect(screen.getByTestId('location-display').textContent).toEqual(
      replaceRouteId(`/settings/integrations/${routes.sourcesDetail.path}`, sourceId),
    );
  });
});
