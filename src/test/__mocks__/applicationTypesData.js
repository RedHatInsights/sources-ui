export const COSTMANAGEMENT_APP = {
  created_at: '2019-04-30T10:56:21Z',
  display_name: 'Cost Management',
  id: '2',
  name: '/insights/platform/cost-management',
  updated_at: '2019-04-30T10:56:21Z',
  supported_authentication_types: {
    amazon: ['arn'],
    azure: ['tenant_id_client_id_client_secret'],
    openshift: ['token'],
    ibm: ['api_token_account_id'],
  },
  supported_source_types: ['amazon', 'azure', 'openshift', 'ibm'],
  dependent_applications: [],
};

export const CATALOG_APP = {
  created_at: '2019-04-30T10:56:21Z',
  display_name: 'Catalog',
  id: '1',
  name: '/insights/platform/catalog',
  updated_at: '2019-04-30T10:56:21Z',
  supported_authentication_types: {
    'ansible-tower': ['username_password'],
  },
  supported_source_types: ['ansible-tower'],
  dependent_applications: ['/insights/platform/topological-inventory'],
};

export const TOPOLOGICALINVENTORY_APP = {
  created_at: '2019-04-30T10:56:21Z',
  display_name: 'Topological Inventory',
  id: '3',
  name: '/insights/platform/topological-inventory',
  updated_at: '2019-04-30T10:56:21Z',
  supported_authentication_types: {
    amazon: ['access_key_secret_key'],
    'ansible-tower': ['username_password'],
    azure: ['tenant_id_client_id_client_secret'],
    openshift: ['token'],
  },
  supported_source_types: ['amazon', 'ansible-tower', 'azure', 'openshift'],
  dependent_applications: [],
};

export const SUBWATCH_APP = {
  created_at: '2020-02-05T21:08:50Z',
  dependent_applications: [],
  display_name: 'Subscription Watch',
  id: '5',
  name: '/insights/platform/cloud-meter',
  supported_authentication_types: { amazon: ['cloud-meter-arn'] },
  supported_source_types: ['amazon', 'azure'],
  updated_at: '2020-02-18T19:38:52Z',
};

export const applicationTypesData = {
  meta: { count: 3, limit: 100, offset: 0 },
  links: {
    first: '/api/v3.1/application_types?offset=0',
    last: '/api/v3.1/application_types?offset=0',
  },
  data: [CATALOG_APP, COSTMANAGEMENT_APP, TOPOLOGICALINVENTORY_APP],
};

export default applicationTypesData;
