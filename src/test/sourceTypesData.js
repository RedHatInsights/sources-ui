export const sourceTypesData =
{
    meta: { count: 3, limit: 100, offset: 0 },
    links: { first: '/api/v0.1/source_types?offset=0', last: '/api/v0.1/source_types?offset=0' },
    data: [
        { created_at: '2019-02-27T20:51:01Z', id: '3', name: 'openshift', product_name: 'OpenShift', schema: { title: 'Configure OpenShift', fields: [{ name: 'role', type: 'hidden', component: 'text-field', initialValue: 'kubernetes' }, { name: 'url', label: 'URL', component: 'text-field' }, { name: 'verify_ssl', label: 'Verify SSL', component: 'checkbox' }, { name: 'certificate_authority', label: 'Certificate Authority', component: 'text-field', condition: { is: true, when: 'verify_ssl' } }, { name: 'token', type: 'password', label: 'Token', component: 'text-field' }] }, updated_at: '2019-03-29T13:24:45Z', vendor: 'Red Hat' },
        { created_at: '2019-02-27T20:51:01Z', id: '4', name: 'amazon', product_name: 'AWS', schema: { title: 'Configure AWS', fields: [{ name: 'role', type: 'hidden', component: 'text-field', initialValue: 'aws' }, { name: 'user_name', label: 'Access Key', component: 'text-field' }, { name: 'password', type: 'password', label: 'Secret Key', component: 'text-field' }] }, updated_at: '2019-03-29T13:24:45Z', vendor: 'Amazon' },
        { created_at: '2019-03-11T22:50:16Z', id: '5', name: 'ansible-tower', product_name: 'Ansible Tower', schema: { title: 'Configure AnsibleTower', fields: [{ name: 'role', type: 'hidden', component: 'text-field', initialValue: 'ansible' }, { name: 'url', label: 'URL', component: 'text-field' }, { name: 'verify_ssl', label: 'Verify SSL', component: 'checkbox' }, { name: 'certificate_authority', label: 'Certificate Authority', component: 'text-field', condition: { is: true, when: 'verify_ssl' } }, { name: 'user', label: 'User name', component: 'text-field' }, { name: 'password', type: 'password', label: 'Secret Key', component: 'text-field' }] }, updated_at: '2019-03-29T13:24:45Z', vendor: 'Red Hat' }
    ]
};

export const OPENSHIFT_ID = '3';
export const AMAZON_ID = '4';
export const ANSIBLE_TOWER_ID = '5';

export const OPENSHIFT_INDEX = 0;
export const AMAZON_INDEX = 1;
export const ANSIBLE_TOWER_INDEX = 2;
