import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import EmptyStateTable from '../../../components/SourcesTable/EmptyStateTable';
import * as actions from '../../../redux/sources/actions';

describe('EmptyStateTable', () => {
  it('render correctly', () => {
    render(componentWrapperIntl(<EmptyStateTable />));

    expect(screen.getByText('No sources found')).toBeInTheDocument();
    expect(
      screen.getByText('No sources match the filter criteria. Remove all filters or clear all filters to show sources.')
    ).toBeInTheDocument();
  });

  it('calls clear filters when click on button', async () => {
    const user = userEvent.setup();

    actions.clearFilters = jest.fn().mockImplementation(() => ({ type: 'cosi' }));

    render(componentWrapperIntl(<EmptyStateTable />));

    await user.click(screen.getByText('Clear all filters'));

    expect(actions.clearFilters).toHaveBeenCalled();
  });
});
