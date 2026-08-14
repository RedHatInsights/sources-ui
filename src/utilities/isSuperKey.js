import { ACCOUNT_AUTHORIZATION } from '../components/constants';

const isSuperKey = (source) => source?.app_creation_workflow === ACCOUNT_AUTHORIZATION;

export default isSuperKey;
