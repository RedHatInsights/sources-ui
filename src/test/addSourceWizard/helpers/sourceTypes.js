export const OPENSHIFT_TYPE = {
  created_at: '2019-03-26T14:05:45Z',
  icon_url: '/apps/frontend-assets/platform-logos/openshift-container-platform.svg',
  id: '1',
  name: 'openshift',
  product_name: 'OpenShift Container Platform',
  schema: {
    authentication: [
      {
        type: 'token',
        name: 'Token',
        fields: [
          {
            component: 'text-field',
            name: 'authentication.authtype',
            hideField: true,
            initializeOnMount: true,
            initialValue: 'token',
          },
          {
            component: 'text-field',
            name: 'source.source_ref',
            label: 'Cluster ID',
            stepKey: 'usageCollector',
          },
          {
            component: 'text-field',
            name: 'authentication.password',
            label: 'Token',
            type: 'password',
            isRequired: true,
            validate: [
              {
                type: 'required',
              },
            ],
          },
        ],
      },
    ],
    endpoint: {
      title: 'Configure OpenShift endpoint',
      fields: [
        {
          component: 'text-field',
          name: 'endpoint.role',
          hideField: true,
          initialValue: 'kubernetes',
        },
        {
          component: 'text-field',
          name: 'url',
          label: 'URL',
          validate: [
            {
              type: 'url-validator',
            },
          ],
        },
        {
          component: 'checkbox',
          name: 'endpoint.verify_ssl',
          label: 'Verify SSL',
        },
        {
          component: 'text-field',
          name: 'endpoint.certificate_authority',
          label: 'Certificate Authority',
          condition: {
            when: 'endpoint.verify_ssl',
            is: true,
          },
        },
      ],
    },
  },
  updated_at: '2019-09-16T14:03:35Z',
  vendor: 'Red Hat',
  category: 'Red Hat',
};

export const AMAZON_TYPE = {
  created_at: '2019-03-26T14:05:45Z',
  icon_url: '/apps/frontend-assets/partners-icons/aws-long.svg',
  id: '2',
  name: 'amazon',
  product_name: 'Amazon Web Services',
  schema: {
    authentication: [
      {
        type: 'access_key_secret_key',
        name: 'AWS Secret Key',
        is_superkey: true,
        fields: [
          {
            component: 'text-field',
            name: 'authentication.authtype',
            hideField: true,
            initialValue: 'access_key_secret_key',
          },
          {
            component: 'text-field',
            name: 'authentication.username',
            label: 'Access Key',
          },
          {
            component: 'text-field',
            name: 'authentication.password',
            label: 'Secret Key',
            type: 'password',
          },
        ],
      },
      {
        type: 'arn',
        name: 'ARN',
        fields: [
          {
            component: 'text-field',
            name: 'authentication.authtype',
            hideField: true,
            initialValue: 'arn',
          },
          {
            name: 'application.extra.bucket',
            component: 'text-field',
            label: 'S3 bucket name',
            stepKey: 'cost-management',
            isRequired: true,
            validate: [{ type: 'required-validator' }, { type: 'pattern-validator', pattern: '^[A-Za-z0-9]+[A-Za-z0-9_-]*$' }],
          },
          {
            name: 'authentication.username',
            component: 'text-field',
            label: 'ARN',
            stepKey: 'arn',
            isRequired: true,
            validate: [
              { type: 'required-validator' },
              { type: 'pattern-validator', pattern: '^arn:aws:.*' },
              { type: 'length-validator', threshold: 10 },
            ],
          },
        ],
      },
      {
        name: 'Subscription Watch ARN',
        type: 'cloud-meter-arn',
        fields: [
          {
            name: 'authentication.authtype',
            component: 'text-field',
            hideField: true,
            initialValue: 'cloud-meter-arn',
            initializeOnMount: true,
          },
          {
            name: 'authentication.username',
            label: 'ARN',
            validate: [{ type: 'required' }, { type: 'pattern', pattern: '^arn:aws:.*' }, { type: 'min-length', threshold: 10 }],
            component: 'text-field',
            isRequired: true,
          },
        ],
      },
    ],
    endpoint: {
      hidden: true,
      fields: [
        {
          component: 'text-field',
          name: 'endpoint.role',
          hideField: true,
          initialValue: 'aws',
        },
      ],
    },
  },
  updated_at: '2019-09-11T14:03:04Z',
  vendor: 'Amazon',
  category: 'Cloud',
};

export const ANSIBLE_TOWER_TYPE = {
  created_at: '2019-04-05T17:54:38Z',
  id: '3',
  name: 'ansible-tower',
  product_name: 'Ansible Tower',
  icon_url: '/apps/frontend-assets/platform-logos/ansible-automation-platform.svg',
  schema: {
    authentication: [
      {
        type: 'username_password',
        name: 'Username and password',
        fields: [
          {
            component: 'text-field',
            name: 'authentication.authtype',
            hideField: true,
            initialValue: 'username_password',
          },
          {
            component: 'text-field',
            name: 'authentication.username',
            label: 'User name',
          },
          {
            component: 'text-field',
            name: 'authentication.password',
            label: 'Secret Key',
            type: 'password',
          },
        ],
      },
      {
        name: 'Receptor node',
        type: 'receptor_node',
        fields: [
          {
            name: 'authentication.authtype',
            component: 'text-field',
            hideField: true,
            initialValue: 'receptor_node',
            initializeOnMount: true,
          },
          {
            name: 'source.source_ref',
            label: 'Ansible Tower ID',
            validate: [
              {
                type: 'required',
              },
            ],
            component: 'text-field',
            isRequired: true,
          },
          {
            name: 'endpoint.receptor_node',
            label: 'Receptor ID',
            component: 'text-field',
            isRequired: true,
            validate: [
              {
                type: 'required',
              },
            ],
          },
          {
            name: 'endpoint.role',
            component: 'text-field',
            hideField: true,
            initialValue: 'ansible',
            initializeOnMount: true,
          },
        ],
      },
    ],
    endpoint: {
      title: 'Configure Ansible Tower endpoint',
      fields: [
        {
          component: 'text-field',
          name: 'endpoint.role',
          hideField: true,
          initialValue: 'ansible',
        },
        {
          component: 'text-field',
          name: 'url',
          label: 'URL',
          validate: [
            {
              type: 'url-validator',
            },
          ],
        },
        {
          component: 'checkbox',
          name: 'endpoint.verify_ssl',
          label: 'Verify SSL',
        },
        {
          component: 'text-field',
          name: 'endpoint.certificate_authority',
          label: 'Certificate Authority',
          condition: {
            when: 'endpoint.verify_ssl',
            is: true,
          },
        },
      ],
    },
  },
  updated_at: '2019-09-16T14:03:35Z',
  vendor: 'Red Hat',
  category: 'Red Hat',
};

export const AZURE_TYPE = {
  created_at: '2019-08-19T14:53:02Z',
  id: '8',
  name: 'azure',
  product_name: 'Microsoft Azure',
  icon_url: '/apps/chrome/assets/images/partners-icons/microsoft-azure.svg',
  schema: {
    authentication: [
      {
        type: 'tenant_id_client_id_client_secret',
        name: 'Tenant ID, Client ID, Client Secret',
        fields: [
          {
            component: 'text-field',
            name: 'authentication.authtype',
            hideField: true,
            initialValue: 'tenant_id_client_id_client_secret',
          },
          {
            component: 'text-field',
            name: 'authentication.extra.azure.tenant_id',
            label: 'Tenant ID',
          },
          {
            component: 'text-field',
            name: 'authentication.username',
            label: 'Client ID',
          },
          {
            component: 'text-field',
            name: 'authentication.password',
            label: 'Client Secret',
            type: 'password',
          },
        ],
      },
    ],
    endpoint: {
      hidden: true,
      fields: [
        {
          component: 'text-field',
          name: 'endpoint.role',
          hideField: true,
          initialValue: 'azure',
        },
      ],
    },
  },
  updated_at: '2019-09-11T14:03:04Z',
  vendor: 'Azure',
  category: 'Cloud',
};

export const GOOGLE_TYPE = {
  created_at: '2019-08-19T14:53:02Z',
  id: '9',
  name: 'google',
  product_name: 'Google Cloud',
  schema: {
    authentication: [
      {
        type: 'project_id_service_account_json',
        name: 'Project ID and Service Account JSON',
        fields: [
          {
            component: 'text-field',
            name: 'authentication.authtype',
            hideField: true,
            initialValue: 'project_id_service_account_json',
            initializeOnMount: true,
          },
          {
            component: 'text-field',
            name: 'authentication.username',
            label: 'Project ID',
          },
          {
            component: 'textarea',
            name: 'authentication.password',
            label: 'Service Account JSON',
          },
          {
            component: 'text-field',
            name: 'application.extra.dataset',
            label: 'Dataset name',
            stepKey: 'cost-management',
            isRequired: true,
            validate: [
              {
                type: 'required',
              },
            ],
          },
        ],
      },
    ],
    endpoint: {
      hidden: true,
      fields: [
        {
          component: 'text-field',
          name: 'endpoint.role',
          hideField: true,
          initialValue: 'google',
          initializeOnMount: true,
        },
      ],
    },
  },
  updated_at: '2019-09-11T14:03:04Z',
  vendor: 'Google',
  category: 'Cloud',
  icon_url: '/apps/frontend-assets/partners-icons/google-cloud.svg',
};

const sourceTypes = [OPENSHIFT_TYPE, AMAZON_TYPE, ANSIBLE_TOWER_TYPE, AZURE_TYPE, GOOGLE_TYPE];

export default sourceTypes;
