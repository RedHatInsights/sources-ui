import { axiosInstance } from './entities';
import { COST_MANAGEMENT_API_BASE } from './constants';

export const getCmValues = (id) => axiosInstance.get(`${COST_MANAGEMENT_API_BASE}/sources/${id}/`).catch(() => ({}));

export const cmConvertTypes = ['amazon', 'azure'];

export const cmValuesMapper = {
  'billing_source.data_source.bucket': 'bucket',
  'billing_source.data_source.resource_group': 'resource_group',
  'billing_source.data_source.storage_account': 'storage_account',
  'authentication.credentials.subscription_id': 'subscription_id',
};
