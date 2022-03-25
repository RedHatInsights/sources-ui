import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import componentWrapperIntl from '../../../utilities/testsHelpers';
import ImageWithPlaceholder from '../../../components/TilesShared/ImageWithPlaceholder';

describe('ImageWithPlaceholder', () => {
  it('hides the loader on onLoad', async () => {
    render(componentWrapperIntl(<ImageWithPlaceholder src="/some-picture.jpg" />));

    expect(screen.getByTestId('ImageWithPlaceholder')).toHaveStyle({ display: 'none' });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    fireEvent(screen.getByTestId('ImageWithPlaceholder'), new Event('load'));

    expect(screen.getByTestId('ImageWithPlaceholder')).toHaveStyle({ display: 'initial' });
    expect(() => screen.getByRole('progressbar')).toThrow();
  });
});
