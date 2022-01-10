import { axiosInstance } from '../api/entities';
import { MARKETPLACE_API_BASE } from './constants';

export const getProducts = async () => axiosInstance.get(`${MARKETPLACE_API_BASE}`);
