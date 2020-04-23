export const sourceTypesData =
{
    meta: { count: 3, limit: 100, offset: 0 },
    links: { first: '/api/v0.1/source_types?offset=0', last: '/api/v0.1/source_types?offset=0' },
    data: [
        {
            created_at: '2019-03-26T14:05:45Z',
            icon_url: '/openshift_logo.png',
            id: '1',
            name: 'openshift',
            product_name: 'OpenShift Container Platform',
            schema: {
                endpoint: {
                    title: 'Configure OpenShift endpoint',
                    fields: [
                        {
                            name: 'endpoint.role',
                            component: 'text-field',
                            hideField: true,
                            initialValue: 'kubernetes',
                            initializeOnMount: true
                        },
                        {
                            name: 'url',
                            label: 'URL',
                            validate: [
                                {
                                    type: 'url-validator'
                                }
                            ],
                            component: 'text-field'
                        },
                        {
                            name: 'endpoint.verify_ssl',
                            label: 'Verify SSL',
                            component: 'switch-field'
                        },
                        {
                            name: 'endpoint.certificate_authority',
                            label: 'Certificate Authority',
                            component: 'text-field',
                            condition: {
                                is: true,
                                when: 'endpoint.verify_ssl'
                            }
                        }
                    ]
                },
                authentication: [
                    {
                        name: 'Token',
                        type: 'token',
                        fields: [
                            {
                                name: 'authentication.authtype',
                                component: 'text-field',
                                hideField: true,
                                initialValue: 'token',
                                initializeOnMount: true
                            },
                            {
                                name: 'source.source_ref',
                                label: 'Cluster ID',
                                stepKey: 'usageCollector',
                                component: 'text-field'
                            },
                            {
                                name: 'authentication.password',
                                type: 'password',
                                label: 'Token',
                                component: 'text-field'
                            }
                        ]
                    }
                ]
            },
            updated_at: '2019-12-03T13:56:50Z',
            vendor: 'Red Hat'
        },
        {
            created_at: '2019-03-26T14:05:45Z',
            icon_url: '/aws_logo.png',
            id: '2',
            name: 'amazon',
            product_name: 'Amazon Web Services',
            schema: {
                endpoint: {
                    fields: [
                        {
                            name: 'endpoint.role',
                            component: 'text-field',
                            hideField: true,
                            initialValue: 'aws',
                            initializeOnMount: true
                        }
                    ],
                    hidden: true
                },
                authentication: [
                    {
                        name: 'AWS Secret Key',
                        type: 'access_key_secret_key',
                        fields: [
                            {
                                name: 'authentication.authtype',
                                component: 'text-field',
                                hideField: true,
                                initialValue: 'access_key_secret_key',
                                initializeOnMount: true
                            },
                            {
                                name: 'authentication.username',
                                label: 'Access Key',
                                component: 'text-field'
                            },
                            {
                                name: 'authentication.password',
                                type: 'password',
                                label: 'Secret Key',
                                component: 'text-field'
                            }
                        ]
                    },
                    {
                        name: 'ARN',
                        type: 'arn',
                        fields: [
                            {
                                name: 'authentication.authtype',
                                component: 'text-field',
                                hideField: true,
                                initialValue: 'arn',
                                initializeOnMount: true
                            },
                            {
                                name: 'billing_source.bucket',
                                label: 'S3 bucket name',
                                stepKey: 'amazon-arn-additional-step',
                                validate: [
                                    {
                                        type: 'required-validator'
                                    },
                                    {
                                        type: 'pattern-validator',
                                        pattern: '^[A-Za-z0-9]+[A-Za-z0-9_-]*$'
                                    }
                                ],
                                component: 'text-field',
                                isRequired: true
                            },
                            {
                                name: 'authentication.password',
                                label: 'ARN',
                                stepKey: 'arn',
                                validate: [
                                    {
                                        type: 'required-validator'
                                    },
                                    {
                                        type: 'pattern-validator',
                                        pattern: '^arn:aws:.*'
                                    },
                                    {
                                        type: 'min-length-validator',
                                        threshold: 10
                                    }
                                ],
                                component: 'text-field',
                                isRequired: true
                            }
                        ]
                    }
                ]
            },
            updated_at: '2019-12-16T14:47:40Z',
            vendor: 'Amazon'
        },
        {
            created_at: '2019-04-05T17:54:38Z',
            icon_url: '/tower.jpg',
            id: '3',
            name: 'ansible-tower',
            product_name: 'Ansible Tower',
            schema: {
                endpoint: {
                    title: 'Configure Ansible Tower endpoint',
                    fields: [
                        {
                            name: 'endpoint.role',
                            component: 'text-field',
                            hideField: true,
                            initialValue: 'ansible',
                            initializeOnMount: true
                        },
                        {
                            name: 'url',
                            label: 'URL',
                            validate: [
                                {
                                    type: 'url-validator'
                                }
                            ],
                            component: 'text-field'
                        },
                        {
                            name: 'endpoint.verify_ssl',
                            label: 'Verify SSL',
                            component: 'switch-field'
                        },
                        {
                            name: 'endpoint.certificate_authority',
                            label: 'Certificate Authority',
                            component: 'text-field',
                            condition: {
                                is: true,
                                when: 'endpoint.verify_ssl'
                            }
                        },
                        {
                            name: 'platform_receptor',
                            label: 'Use Platform Receptor and PKI (?)',
                            component: 'switch-field'
                        },
                        {
                            name: 'endpoint.receptor_node',
                            label: 'Receptor ID',
                            component: 'text-field'
                        }
                    ]
                },
                authentication: [
                    {
                        name: 'Username and password',
                        type: 'username_password',
                        fields: [
                            {
                                name: 'authentication.authtype',
                                component: 'text-field',
                                hideField: true,
                                initialValue: 'username_password',
                                initializeOnMount: true
                            },
                            {
                                name: 'authentication.username',
                                label: 'User name',
                                component: 'text-field'
                            },
                            {
                                name: 'authentication.password',
                                type: 'password',
                                label: 'Secret Key',
                                component: 'text-field'
                            }
                        ]
                    }
                ]
            },
            updated_at: '2019-11-22T15:26:18Z',
            vendor: 'Red Hat'
        },
        {
            created_at: '2019-07-16T13:52:12Z',
            icon_url: '/vsphere_logo.png',
            id: '4',
            name: 'vsphere',
            product_name: 'VMware vSphere',
            updated_at: '2019-08-30T13:52:33Z',
            vendor: 'VMware'
        },
        {
            created_at: '2019-07-16T13:52:12Z',
            icon_url: 'ovirt.jpg',
            id: '5',
            name: 'ovirt',
            product_name: 'Red Hat Virtualization',
            updated_at: '2019-07-16T13:52:12Z',
            vendor: 'Red Hat'
        },
        {
            created_at: '2019-07-16T13:52:12Z',
            id: '6',
            name: 'openstack',
            product_name: 'Red Hat OpenStack',
            updated_at: '2019-07-16T13:52:12Z',
            vendor: 'Red Hat'
        },
        {
            created_at: '2019-07-16T13:52:12Z',
            id: '7',
            name: 'cloudforms',
            product_name: 'Red Hat CloudForms',
            updated_at: '2019-07-16T13:52:12Z',
            vendor: 'Red Hat'
        },
        {
            created_at: '2019-08-19T14:53:02Z',
            id: '8',
            name: 'azure',
            product_name: 'Microsoft Azure',
            schema: {
                endpoint: {
                    fields: [
                        {
                            name: 'endpoint.role',
                            component: 'text-field',
                            hideField: true,
                            initialValue: 'azure',
                            initializeOnMount: true
                        }
                    ],
                    hidden: true
                },
                authentication: [
                    {
                        name: 'Tenant ID, Client ID, Client Secret',
                        type: 'tenant_id_client_id_client_secret',
                        fields: [
                            {
                                name: 'authentication.authtype',
                                component: 'text-field',
                                hideField: true,
                                initialValue: 'tenant_id_client_id_client_secret',
                                initializeOnMount: true
                            },
                            {
                                name: 'billing_source.data_source.resource_group',
                                label: 'Resource group name',
                                stepKey: 'azure-2',
                                component: 'text-field'
                            },
                            {
                                name: 'billing_source.data_source.storage_account',
                                label: 'Storage account name',
                                stepKey: 'azure-2',
                                component: 'text-field'
                            },
                            {
                                name: 'credentials.subscription_id',
                                label: 'Subscription ID',
                                stepKey: 'service-principle',
                                component: 'text-field'
                            },
                            {
                                name: 'authentication.extra.azure.tenant_id',
                                label: 'Tenant ID',
                                component: 'text-field'
                            },
                            {
                                name: 'authentication.username',
                                label: 'Client ID',
                                component: 'text-field'
                            },
                            {
                                name: 'authentication.password',
                                type: 'password',
                                label: 'Client Secret',
                                component: 'text-field'
                            }
                        ]
                    }
                ]
            },
            updated_at: '2019-12-11T12:57:43Z',
            vendor: 'Azure'
        },
        {
            created_at: '2019-11-08T14:43:11Z',
            id: '9',
            name: 'satellite',
            icon_url: 'satellite.jpg',
            product_name: 'Red Hat Satellite',
            schema: {
                endpoint: {
                    title: 'Configure Red Hat Satellite endpoint',
                    fields: [
                        {
                            name: 'endpoint.receptor_node',
                            label: 'Receptor ID',
                            component: 'text-field'
                        },
                        {
                            name: 'endpoint.role',
                            component: 'text-field',
                            hideField: true,
                            initialValue: 'sattelite',
                            initializeOnMount: true
                        }
                    ]
                },
                authentication: [
                    {
                        name: 'Receptore node',
                        type: 'receptor_node',
                        fields: [
                            {
                                name: 'authentication.authtype',
                                component: 'text-field',
                                hideField: true,
                                initialValue: 'receptor_node',
                                initializeOnMount: true
                            },
                            {
                                name: 'source.source_ref',
                                label: 'Satellite ID',
                                validate: [
                                    {
                                        type: 'required-validator'
                                    }
                                ],
                                component: 'text-field',
                                isRequired: true
                            }
                        ]
                    }
                ]
            },
            updated_at: '2019-12-12T20:01:44Z',
            vendor: 'Red Hat'
        }
    ]
};

export const OPENSHIFT_ID = '1';
export const AMAZON_ID = '2';
export const ANSIBLE_TOWER_ID = '3';

export const OPENSHIFT_INDEX = 0;
export const AMAZON_INDEX = 1;
export const ANSIBLE_TOWER_INDEX = 2;

export const OPENSHIFT = sourceTypesData.data[OPENSHIFT_INDEX];
export const AMAZON = sourceTypesData.data[AMAZON_INDEX];
