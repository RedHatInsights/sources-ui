import React from 'react';

import { render, screen } from '@testing-library/react';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import NoPermissions from '../../../components/SourceDetail/NoPermissions';

describe('NoPermissions', () => {
  it('renders correctly', async () => {
    render(componentWrapperIntl(<NoPermissions />));

    expect(screen.getByText('Missing permissions')).toBeInTheDocument();
    expect(
      screen.getByText('To perform this action, your Organization Administrator must grant you Cloud Administrator permissions.'),
    ).toBeInTheDocument();
  });
});
