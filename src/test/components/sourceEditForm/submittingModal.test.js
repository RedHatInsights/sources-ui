import { render, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { replaceRouteId, routes } from '../../../routes';
import { sourcesDataGraphQl } from '../../__mocks__/sourcesData';

import SubmittingModal from '../../../components/SourceEditForm/SubmittingModal';
import mockStore from '../../__mocks__/mockStore';

describe('SubmittingModal', () => {
  let store;
  let initialEntry;

  beforeEach(async () => {
    initialEntry = [replaceRouteId(routes.sourcesDetail.path, '14')];
    store = mockStore({
      sources: {
        entities: sourcesDataGraphQl,
      },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<SubmittingModal />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );
  });

  it('renders correctly', async () => {
    expect(screen.getByText('Validating edited source credentials')).toBeInTheDocument();
    expect(screen.getByLabelText('Contents')).toBeInTheDocument();
  });
});
