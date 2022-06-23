import React from 'react';
import { render, screen } from '@testing-library/react';

import {
  AppPlaceholder,
  CardLoader,
  DetailLoader,
  PlaceHolderTable,
  RowWrapperLoader,
} from '../../../components/SourcesTable/loaders';
import { COLUMN_COUNT } from '../../../views/sourcesViewDefinition';
import { IntlProvider } from 'react-intl';

describe('loaders', () => {
  describe('PlaceholderTable', () => {
    it('renders correctly', () => {
      render(<PlaceHolderTable />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByTestId('placeholder-table')).toBeInTheDocument();
    });
  });

  describe('RowWrapperLoader', () => {
    const row = {
      cells: ['CellText'],
    };

    it('renders loader when item is deleting', () => {
      const { container } = render(
        <table>
          <tbody>
            <RowWrapperLoader row={{ ...row, isDeleting: true }} />
          </tbody>
        </table>
      );

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(container.getElementsByTagName('td')[0]).toHaveAttribute('colspan', String(COLUMN_COUNT));
      expect(() => screen.getByTestId('row')).toThrow();
    });

    it('renders rowWrapper when item is not deleting', () => {
      render(
        <table>
          <tbody>
            <RowWrapperLoader row={row} />
          </tbody>
        </table>
      );

      expect(screen.getByTestId('row')).toBeInTheDocument();
      expect(() => screen.getByRole('progressbar')).toThrow();
    });
  });

  describe('AppPlaceholder', () => {
    it('renders correctly', () => {
      render(
        <IntlProvider locale="en">
          <AppPlaceholder />
        </IntlProvider>
      );

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByText('Sources')).toBeInTheDocument();
    });
  });

  describe('DetailLoaders', () => {
    it('CardLoader renders correctly', () => {
      render(<CardLoader />);

      expect(screen.getByRole('progressbar').closest('.pf-c-card')).toBeInTheDocument();
    });

    it('DetailLoader renders correctly', () => {
      render(<DetailLoader />);

      expect(screen.getAllByRole('progressbar')[1].closest('.pf-c-card')).toBeInTheDocument();
    });
  });
});
