import { axiosInstance } from './entities';

export const getSubWatchConfig = () => axiosInstance.get('/api/cloudigrade/v2/sysconfig/');
