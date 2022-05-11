import { axiosInstance } from '../api/entities';
import { MARKETPLACE_API_BASE } from './constants';

export const getProducts = async (config = { perPage: 10, page: 1 }) =>
  axiosInstance.get(`${MARKETPLACE_API_BASE}/unstable`, {
    params: {
      limit: config.perPage,
      offset: (config.page - 1) * config.perPage,
    },
  });
export const getCategories = async () => axiosInstance.get(`${MARKETPLACE_API_BASE}/categories`);
