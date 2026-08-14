import React from 'react';

import { render, screen } from '@testing-library/react';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import NoApplications from '../../../components/SourceDetail/NoApplications';

describe('NoApplications', () => {
  it('renders correctly', async () => {
    render(componentWrapperIntl(<NoApplications />));

    expect(screen.getByText('No connected applications')).toBeInTheDocument();
    expect(
      screen.getByText(
        'You have not connected any applications to this integration. Use the switches above to add applications.',
      ),
    ).toBeInTheDocument();
  });
});
