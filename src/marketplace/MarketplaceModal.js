import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

import { Modal } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar/PrimaryToolbar';

import MarketplaceCard from './MarketplaceCard';
import { MARKETPLACE_URL } from './constants';
import { getCategories, getProducts } from './api';
import SkeletonMarketplaceCard from './SkeletonMarketplaceCard';

const init = (data) => ({
  page: 1,
  perPage: 10,
  itemCount: data?.length || 0,
  filters: {
    type: ['database'],
  },
  categories: null,
  isLoading: true,
  data,
  loaded: 0,
});

const reducer = (state, { type, payload, meta }) => {
  switch (type) {
    case 'SET_PAGE':
      return { ...state, page: payload };
    case 'SET_PER_PAGE':
      return { ...state, page: 1, perPage: payload };
    case 'LOAD_CATEGORIES':
      return { ...state, categories: payload, isLoading: false };
    case 'SET_LOADING_DATA':
      return { ...state, loaded: state.loaded + 1 };
    case 'LOAD_DATA':
      return { ...state, loaded: Math.max(state.loaded - 1, 0), data: payload, itemCount: meta.count };
  }
};

const valuesMapper = (value) =>
  ({
    database: 'Database',
  })[value] || value;

export const chipFormatters = (key, filter) =>
  ({
    type: {
      category: 'Type',
      chips: filter.map((value) => ({ name: valuesMapper(value) })),
    },
  })[key] || { category: key, chips: filter.map((value) => ({ name: value })) };

const generateChips = (filters) =>
  Object.keys(filters)
    .map((key) => (!filters[key] || filters[key]?.length === 0 ? null : chipFormatters(key, filters[key])))
    .filter(Boolean);

const MarketplaceModal = ({ data, isOpen, onClose }) => {
  const [config, dispatch] = useReducer(reducer, data, init);

  const isLoadingData = config.loaded > 0;

  useEffect(() => {
    isOpen && getCategories().then(({ data }) => dispatch({ type: 'LOAD_CATEGORIES', payload: data }));
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      dispatch({ type: 'SET_LOADING_DATA' });
      getProducts({ perPage: config.perPage, page: config.page }).then(({ data, meta }) =>
        dispatch({ type: 'LOAD_DATA', payload: data, meta }),
      );
    }
  }, [config.page, config.perPage]);

  return (
    <Modal
      className="sources"
      onClose={onClose}
      isOpen={isOpen}
      title="Browse catalog"
      description={
        <span>
          A curated selection of offerings available for purchase from{' '}
          <a href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer">
            Red Hat Marketplace <ExternalLinkAltIcon />
          </a>
        </span>
      }
      variant="large"
    >
      {config.isLoading && (
        <div className="pf-v5-u-mb-md marketplace-flex">
          <SkeletonMarketplaceCard />
          <SkeletonMarketplaceCard />
        </div>
      )}
      {!config.isLoading && (
        <React.Fragment>
          <PrimaryToolbar
            useMobileLayout
            className="marketplace-modal-toolbar"
            pagination={{
              itemCount: config.itemCount,
              page: config.page,
              perPage: config.perPage,
              onSetPage: (_e, page) => dispatch({ type: 'SET_PAGE', payload: page }),
              onPerPageSelect: (_e, perPage) => dispatch({ type: 'SET_PER_PAGE', payload: perPage }),
              'data-testid': 'pagination',
            }}
            filterConfig={{
              items: [
                {
                  label: 'Type',
                  placeholder: 'Filter by product type',
                  type: 'checkbox',
                  filterValues: {
                    //onChange: (_event, value) => console.log(value),
                    value: ['database'],
                    items: config.categories.map((category) => ({
                      label: category.display_name,
                      value: category.page_name,
                      isDisabled: true,
                    })),
                  },
                },
              ],
            }}
            activeFiltersConfig={{
              showDeleteButton: false,
              filters: generateChips(config.filters),
              // onDelete: (_event, chips, deleteAll) => console.log(chips, deleteAll),
            }}
          />
          <div className="pf-v5-u-mb-md marketplace-flex">
            {!isLoadingData && data.map((product) => <MarketplaceCard key={product.id} {...product} />)}
            {isLoadingData && (
              <React.Fragment>
                <SkeletonMarketplaceCard />
                <SkeletonMarketplaceCard />
              </React.Fragment>
            )}
          </div>
        </React.Fragment>
      )}
    </Modal>
  );
};

MarketplaceModal.propTypes = {
  data: PropTypes.array,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default MarketplaceModal;
