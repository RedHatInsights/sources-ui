// export const sourcesData = [
//     { id: '1', source_type_id: '', name: 'dev-openshift', uid: 'f74d797c-dace-4c04-86ad-e44036202b4a', tenant_id: '1' },
//     { id: '3', source_type_id: '', name: 'agrare-source', uid: '6038ea33-7048-4810-868d-760c62abd960', tenant_id: '1' },
//     { id: '4', source_type_id: '1', name: 'Public OpenShift', uid: '4c4e4a93-4a3d-4013-98af-1afc40586fbc', tenant_id: '1' },
//     { id: '5', source_type_id: '2', name: 'Amazon', uid: '24c05a2a-441a-4a68-86cf-3f689153c81c', tenant_id: '1' },
//     { id: '6', source_type_id: '1', uid: '897da451-6396-402e-a031-96eae7f88a62', tenant_id: '1' },
//     { id: '7', source_type_id: '1', uid: 'd9e306ab-74cd-466b-a267-15e088769666', tenant_id: '1' },
//     { id: '8', source_type_id: '1', uid: '9b1766db-e0c0-4c74-829b-51b13d610d09', tenant_id: '1' },
//     { id: '9', source_type_id: '1', uid: 'd356e3fa-4cc2-41f0-8dad-25a330d54b4d', tenant_id: '1' },
//     { id: '10', source_type_id: '1', uid: '379c0e7e-a349-4172-a667-b84ae27ffe5a', tenant_id: '1' },
//     { id: '11', source_type_id: '1', uid: '1367cfe1-b21f-490d-83d2-531e1e304687', tenant_id: '1' }
// ];
export const sourcesData =
{
    meta: { count: 1, limit: 100, offset: 0 },
    links: { first: '/api/v0.1/sources/?offset=0', last: '/api/v0.1/sources/?offset=0' },
    data: [
        { created_at: '2019-04-05T05:03:08Z', id: '19', name: 'number one 1!', source_type_id: '3', tenant_id: '1', uid: 'd8db7e98-70b3-4534-9a7c-57f78787dbbb', updated_at: '2019-04-05T07:28:43Z' }
    ]
};

export const sourcesDataGraphQl = [
    {
        id: '14',
        created_at: '2019-04-23T18:21:07.081Z',
        source_type_id: '5',
        name: 'MPTEST3214411',
        tenant: '1234567',
        uid: '00273be5-9fb9-43ea-b4d2-db6002b3a3e9',
        updated_at: '2019-07-25T09:40:36.432Z',
        applications: [

        ],
        endpoints: [
            {
                id: '8',
                scheme: null,
                host: null,
                port: null,
                path: null
            }
        ]
    },
    {
        id: '23',
        created_at: '2019-05-03T15:01:42.732Z',
        source_type_id: '4',
        name: 'AWStest2x',
        tenant: '1234567',
        uid: '60aab23f-5456-4338-a802-a49ac5143fd4',
        updated_at: '2019-07-25T09:14:16.439Z',
        applications: [

        ],
        endpoints: [
            {
                id: '11',
                scheme: null,
                host: null,
                port: null,
                path: null
            }
        ]
    },
    {
        id: '44',
        created_at: '2019-05-27T14:13:45.773Z',
        source_type_id: '4',
        name: 'adf',
        tenant: '1234567',
        uid: '1a6eec2e-0f97-4c67-94a5-20d97e0f6f81',
        updated_at: '2019-05-27T14:13:45.773Z',
        applications: [

        ],
        endpoints: [
            {
                id: '32',
                scheme: null,
                host: null,
                port: null,
                path: null
            }
        ]
    },
    {
        id: '406',
        created_at: '2019-08-06T12:18:25.410Z',
        source_type_id: '3',
        name: 'Test123456',
        tenant: '1234567',
        uid: '9d6677e9-dd0b-4dbe-a663-4dc8c34c647c',
        updated_at: '2019-08-06T12:18:25.410Z',
        applications: [
            {
                application_type_id: '1',
                id: '888'
            }
        ],
        endpoints: [
            {
                id: '212',
                scheme: 'https',
                host: 'myopenshiftcluster.mycompany.com',
                port: null,
                path: '/'
            }
        ]
    },
    {
        id: '407',
        created_at: '2019-08-06T12:47:11.917Z',
        source_type_id: '3',
        name: 'TestWithoutApp',
        tenant: '1234567',
        uid: '36ff09fa-9f0a-4994-abe5-d9865e891195',
        updated_at: '2019-08-06T12:47:11.917Z',
        applications: [

        ],
        endpoints: [
            {
                id: '213',
                scheme: 'https',
                host: 'myopenshiftcluster.mycompany.com',
                port: null,
                path: '/'
            }
        ]
    },
    {
        id: '408',
        created_at: '2019-08-06T12:54:07.119Z',
        source_type_id: '4',
        name: 'Test178794546',
        tenant: '1234567',
        uid: 'a19aeba7-81af-42e3-9729-a57a5012303f',
        updated_at: '2019-08-06T12:54:07.119Z',
        applications: [
            {
                application_type_id: '1',
                id: '78'
            },
            {
                application_type_id: '2',
                id: '104551278'
            },
            {
                application_type_id: '3',
                id: '1'
            }
        ],
        endpoints: [
            {
                id: '214',
                scheme: null,
                host: null,
                port: null,
                path: null
            }
        ]
    }
];

export const OPENSHIFT_SOURCE_ID = '3';
export const SOURCE_ALL_APS_INDEX = 5;
export const SOURCE_NO_APS_INDEX = 4;
export const SOURCE_NO_APS_ID = '23';
export const SOURCE_ENDPOINT_URL_INDEX = 3;
export const SOURCE_CATALOGAPP_INDEX = 3;
export const SOURCE_ALL_APS_ID = '408';
