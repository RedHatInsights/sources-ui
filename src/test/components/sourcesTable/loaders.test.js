import React from 'react';
import { render, screen } from '@testing-library/react';

import { AppPlaceholder, CardLoader, DetailLoader, PlaceHolderTable } from '../../../components/SourcesTable/loaders';
import { IntlProvider } from 'react-intl';

describe('loaders', () => {
  describe('PlaceholderTable', () => {
    it('renders correctly', () => {
      render(<PlaceHolderTable />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByTestId('placeholder-table')).toBeInTheDocument();
    });
  });

  describe('AppPlaceholder', () => {
    it('renders correctly', () => {
      render(
        <IntlProvider locale="en">
          <AppPlaceholder />
        </IntlProvider>,
      );

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByText('Integrations')).toBeInTheDocument();
    });
  });

  describe('DetailLoaders', () => {
    it('CardLoader renders correctly', () => {
      render(<CardLoader />);

      expect(screen.getByRole('progressbar').closest('.pf-v6-c-card')).toBeInTheDocument();
    });

    it('DetailLoader renders correctly', () => {
      render(<DetailLoader />);

      expect(screen.getAllByRole('progressbar')[1].closest('.pf-v6-c-card')).toBeInTheDocument();
    });
  });
});
