import { axiosInstance } from './entities';
import { COST_MANAGEMENT_API_BASE } from './constants';

export const getCmValues = (id) => axiosInstance.get(`${COST_MANAGEMENT_API_BASE}/sources/${id}/`);
