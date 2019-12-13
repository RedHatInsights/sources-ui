import { axiosInstance } from './entities';
import { COST_MANAGEMENT_API_BASE } from './constants';

export const patchCmValues = (id, data) => axiosInstance.patch(`${COST_MANAGEMENT_API_BASE}/sources/${id}/`, data);
