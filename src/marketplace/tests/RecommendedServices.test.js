import { render, waitFor, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as api from '../api';
import RecommendedServices from '../RecommendedServices';
import products from './__mocks__/products';
import { chipFormatters } from '../MarketplaceModal';

describe('<RecommendedServices />', () => {
  const crunchyProduct = products[0];
  const mongoProduct = products[1];

  beforeEach(() => {
    api.getProducts = jest.fn().mockResolvedValue({ data: products });
  });

  it('renders page and loads data', async () => {
    render(<RecommendedServices />);

    expect(screen.getAllByRole('progressbar')).toHaveLength(6);

    await waitFor(() => expect(screen.getByText(mongoProduct.title)).toBeInTheDocument());
    expect(screen.getByText('Database')).toBeInTheDocument();
    expect(screen.getByText(mongoProduct.description_short)).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();

    expect(
      screen.getByText('Not what you’re looking for? Browse the catalog to see more offerings from Red Hat Marketplace.')
    ).toBeInTheDocument();
    expect(screen.getByText('See more databases')).toBeInTheDocument();
  });

  it('renders page and loads data - fallback to the first item', async () => {
    api.getProducts = jest.fn().mockResolvedValue({
      data: [crunchyProduct],
    });

    render(<RecommendedServices />);

    await waitFor(() => expect(screen.getByText(crunchyProduct.title)).toBeInTheDocument());
    expect(screen.getByText('Database')).toBeInTheDocument();
    expect(screen.getByText(crunchyProduct.description_short)).toBeInTheDocument();
  });

  describe('<SeeMoreCard />', () => {
    it('opens modal', async () => {
      render(<RecommendedServices />);
      await waitFor(() => expect(screen.getByText('See more databases')).toBeInTheDocument());

      userEvent.click(screen.getByText('See more databases'));

      expect(screen.getByText('Browse catalog')).toBeInTheDocument();
      expect(screen.getByText('A curated selection of offerings available for purchase from')).toBeInTheDocument();

      products.map((product) => {
        expect(within(screen.getByRole('dialog')).getByText(product.title)).toBeInTheDocument();
        expect(within(screen.getByRole('dialog')).getByText(product.description_short)).toBeInTheDocument();
      });

      expect(within(screen.getByRole('dialog')).getAllByText('Add')).toHaveLength(4);

      userEvent.click(screen.getByLabelText('Close'));

      expect(() => screen.getByRole('dialog')).toThrow();
    });

    it('change perPage', async () => {
      render(<RecommendedServices />);
      await waitFor(() => expect(screen.getByText('See more databases')).toBeInTheDocument());
      userEvent.click(screen.getByText('See more databases'));

      userEvent.click(screen.getByLabelText('Items per page'));

      expect(screen.getByText('10 per page')).toHaveAttribute('class', 'pf-m-selected pf-c-options-menu__menu-item');
      expect(screen.getByText('20 per page')).toHaveAttribute('class', 'pf-c-options-menu__menu-item');

      userEvent.click(screen.getByText('20 per page'));

      userEvent.click(screen.getByLabelText('Items per page'));

      expect(screen.getByText('10 per page')).toHaveAttribute('class', 'pf-c-options-menu__menu-item');
      expect(screen.getByText('20 per page')).toHaveAttribute('class', 'pf-m-selected pf-c-options-menu__menu-item');
    });

    it('change page', async () => {
      api.getProducts = jest.fn().mockResolvedValue({
        data: [...Array(11)].map((_, index) => ({
          ...crunchyProduct,
          id: index,
        })),
      });

      render(<RecommendedServices />);
      await waitFor(() => expect(screen.getByText('See more databases')).toBeInTheDocument());
      userEvent.click(screen.getByText('See more databases'));

      expect(screen.getByTestId('pagination')).toHaveTextContent('1 - 10 of 11 1 - 10 of 11');
      userEvent.click(screen.getByLabelText('Go to next page'));
      expect(screen.getByTestId('pagination')).toHaveTextContent('11 - 11 of 11 11 - 11 of 11');
    });
  });

  describe('utilities', () => {
    describe('chipsFormatters', () => {
      it('default formatter', () => {
        expect(chipFormatters('key', ['some value'])).toEqual({ category: 'key', chips: [{ name: 'some value' }] });
      });
    });
  });
});
