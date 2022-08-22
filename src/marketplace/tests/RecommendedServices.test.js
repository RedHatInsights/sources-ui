import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as api from '../api';
import RecommendedServices from '../RecommendedServices';
import products from './__mocks__/products';
import categories from './__mocks__/categories';
import { chipFormatters } from '../MarketplaceModal';

describe('<RecommendedServices />', () => {
  const crunchyProduct = products[0];
  const mongoProduct = products[1];

  const getProductsResponse = { data: products, meta: { count: products.length } };
  const getCategoriesResponse = { data: categories };

  beforeEach(() => {
    api.getProducts = jest.fn().mockResolvedValue({
      data: products,
      meta: { count: products.length },
    });
    api.getCategories = jest.fn().mockResolvedValue({
      data: categories,
    });
  });

  it('renders page and loads data', async () => {
    api.getProducts = mockApi();

    render(<RecommendedServices />);

    expect(screen.getAllByRole('progressbar')).toHaveLength(6);

    api.getProducts.resolve(getProductsResponse);

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
      meta: { count: 1 },
    });

    render(<RecommendedServices />);

    await waitFor(() => expect(screen.getByText(crunchyProduct.title)).toBeInTheDocument());
    expect(screen.getByText('Database')).toBeInTheDocument();
    expect(screen.getByText(crunchyProduct.description_short)).toBeInTheDocument();
  });

  describe('<SeeMoreCard />', () => {
    it('opens modal', async () => {
      const user = userEvent.setup();

      api.getProducts = mockApi();
      api.getCategories = mockApi();

      render(<RecommendedServices />);

      api.getProducts.resolve(getProductsResponse);

      await waitFor(() => expect(screen.getByText('See more databases')).toBeInTheDocument());

      await user.click(screen.getByText('See more databases'));

      expect(screen.getAllByRole('progressbar')).toHaveLength(6);

      api.getCategories.resolve(getCategoriesResponse);

      await waitFor(() => expect(screen.getByText('Filter by product type')).toBeInTheDocument());

      expect(screen.getByText('Browse catalog')).toBeInTheDocument();
      expect(screen.getByText('A curated selection of offerings available for purchase from')).toBeInTheDocument();

      products.map((product) => {
        expect(within(screen.getByRole('dialog')).getByText(product.title)).toBeInTheDocument();
        expect(within(screen.getByRole('dialog')).getByText(product.description_short)).toBeInTheDocument();
      });

      expect(within(screen.getByRole('dialog')).getAllByText('Add')).toHaveLength(4);

      await user.click(screen.getByText('Filter by product type'));

      categories.map((category) => {
        expect(within(screen.getByRole('listbox')).getAllByText(category.display_name)).toBeTruthy();
      });

      await user.click(screen.getByLabelText('Close'));

      expect(() => screen.getByRole('dialog')).toThrow();
    });

    it('change perPage', async () => {
      const user = userEvent.setup();

      api.getProducts = mockApi();

      render(<RecommendedServices />);

      api.getProducts.resolve(getProductsResponse);

      await waitFor(() => expect(screen.getByText('See more databases')).toBeInTheDocument());
      await user.click(screen.getByText('See more databases'));

      await waitFor(() => expect(screen.getByText('Filter by product type')).toBeInTheDocument());

      await user.click(screen.getByLabelText('Items per page'));

      expect(screen.getByText('10 per page')).toHaveAttribute('class', 'pf-m-selected pf-c-options-menu__menu-item');
      expect(screen.getByText('20 per page')).toHaveAttribute('class', 'pf-c-options-menu__menu-item');

      await user.click(screen.getByText('20 per page'));

      expect(screen.getAllByRole('progressbar')).toHaveLength(6);

      api.getProducts.resolve(getProductsResponse);

      await waitFor(() => expect(screen.getAllByRole('progressbar')).toHaveLength(4));
      expect(api.getProducts).toHaveBeenLastCalledWith({ page: 1, perPage: 20 });

      await user.click(screen.getByLabelText('Items per page'));

      expect(screen.getByText('10 per page')).toHaveAttribute('class', 'pf-c-options-menu__menu-item');
      expect(screen.getByText('20 per page')).toHaveAttribute('class', 'pf-m-selected pf-c-options-menu__menu-item');
    });

    it('change page', async () => {
      const user = userEvent.setup();

      api.getProducts = mockApi();

      const response = {
        data: [...Array(11)].map((_, index) => ({
          ...crunchyProduct,
          id: index,
        })),
        meta: {
          count: 11,
        },
      };

      render(<RecommendedServices />);

      api.getProducts.resolve(response);

      await waitFor(() => expect(screen.getByText('See more databases')).toBeInTheDocument());
      await user.click(screen.getByText('See more databases'));
      await waitFor(() => expect(screen.getByText('Filter by product type')).toBeInTheDocument());

      expect(screen.getByTestId('pagination')).toHaveTextContent('1 - 10 of 11 1 - 10 of 11');
      await user.click(screen.getByLabelText('Go to next page'));

      expect(screen.getAllByRole('progressbar')).toHaveLength(6);

      api.getProducts.resolve(response);

      await waitFor(() => expect(screen.getAllByRole('progressbar')).toHaveLength(6));
      expect(api.getProducts).toHaveBeenLastCalledWith({ page: 2, perPage: 10 });

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
