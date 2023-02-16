export const CATALOG_APP = {
  created_at: '2019-04-05T17:54:38Z',
  dependent_applications: ['/insights/platform/topological-inventory'],
  display_name: 'Catalog',
  id: '1',
  name: '/insights/platform/catalog',
  supported_authentication_types: {
    'ansible-tower': ['username_password', 'receptor_node'],
  },
  supported_source_types: ['ansible-tower'],
  updated_at: '2019-09-23T14:04:02Z',
};

export const COST_MANAGEMENT_APP = {
  created_at: '2019-04-05T17:54:38Z',
  dependent_applications: [],
  display_name: 'Cost Management',
  id: '2',
  name: '/insights/platform/cost-management',
  supported_authentication_types: {
    azure: ['tenant_id_client_id_client_secret'],
    amazon: ['arn'],
    openshift: ['token'],
    google: ['project_id_service_account_json'],
    ibm: ['api_token_account_id'],
    'oracle-cloud-infrastructure': ['ocid'],
  },
  supported_source_types: ['amazon', 'azure', 'openshift', 'google', 'ibm', 'oracle-cloud-infrastructure'],
  updated_at: '2019-09-16T19:56:12Z',
};

export const TOPOLOGY_INV_APP = {
  created_at: '2019-04-05T17:54:38Z',
  dependent_applications: [],
  display_name: 'Topological Inventory',
  id: '3',
  name: '/insights/platform/topological-inventory',
  supported_authentication_types: {
    azure: ['tenant_id_client_id_client_secret'],
    amazon: ['access_key_secret_key'],
    openshift: ['token'],
    'ansible-tower': ['username_password'],
  },
  supported_source_types: ['amazon', 'ansible-tower', 'azure', 'openshift'],
  updated_at: '2019-09-23T14:04:02Z',
};

export const SUB_WATCH_APP = {
  created_at: '2020-02-05T21:08:50Z',
  dependent_applications: [],
  display_name: 'RHEL management',
  id: '5',
  name: '/insights/platform/cloud-meter',
  supported_authentication_types: { amazon: ['cloud-meter-arn'], azure: ['lighthouse_subscription_id'] },
  supported_source_types: ['amazon', 'azure', 'google'],
  updated_at: '2020-02-18T19:38:52Z',
};

const applicationTypes = [CATALOG_APP, COST_MANAGEMENT_APP, TOPOLOGY_INV_APP, SUB_WATCH_APP];

export default applicationTypes;
