export const viewDefinitions = {
    container_projects: {
        displayName: 'Container Projects',
        //url: 'https://topological-inventory-api-topological-inventory-ci.10.8.96.54.nip.io/api/v0.0/sources/1/container_projects/',
        // FIXME
        url: '/r/insights/platform/topological-inventory/v0.0/1/sources/container_projects/',
        columns: [
            { title: 'ID', value: 'id' },
            { title: null, value: 'source_id' },
            { title: null, value: 'source_ref' },
            { title: 'Resource version', value: 'resource_version' },
            { title: 'Name', value: 'name' },
            { title: null, value: 'display_name' },
            { title: 'Created at', value: 'created_at' },
            { title: 'Updated at', value: 'updated_at' },
            { title: null, value: 'source_deleted_at' },
            { title: null, value: 'tenant_id' },
            { title: null, value: 'source_created_at' },
            { title: 'Archived on', value: 'archived_on' }
        ]
    },
    container_groups: { // test data for pagination?
        //{"id":"725","source_id":1,"source_ref":"0c478b50-babb-11e8-ba7e-d094660d31fb","resource_version":"42398462","name":"my-ruby-project-2-build","container_project_id":19,"ipaddress":null,"created_at":"2018-10-17T15:59:02.689Z","updated_at":"2018-10-17T15:59:02.689Z","source_deleted_at":null,"tenant_id":null,"container_node_id":4,"source_created_at":"2018-09-17T20:48:36.000Z","archived_on":null}
        displayName: 'Container Groups',
        //url: 'https://topological-inventory-api-topological-inventory-ci.10.8.96.54.nip.io/api/v0.0/sources/1/container_groups/',
        url: '/r/insights/platform/topological-inventory/v0.0/sources/1/container_groups/',
        columns: [
            { title: 'ID', value: 'id' },
            { title: null, value: 'source_id' },
            { title: null, value: 'source_ref' },
            { title: 'Resource version', value: 'resource_version' },
            { title: 'Name', value: 'name' },
            { title: 'Container project', value: 'container_project_id' },
            { title: 'IP address', value: 'ipaddress' },
            { title: 'Created at', value: 'created_at' },
            { title: 'Updated at', value: 'updated_at' },
            { title: null, value: 'source_deleted_at' },
            { title: null, value: 'tenant_id' },
            { title: null, value: 'source_created_at' },
            { title: 'Archived on', value: 'archived_on' }
        ]
    },
    container_nodes: {
        displayName: 'Container Nodes',
        //url: 'https://topological-inventory-api-topological-inventory-ci.10.8.96.54.nip.io/api/v0.0/sources/1/container_nodes/',
        url: '/r/insights/platform/topological-inventory/v0.0/sources/1/container_nodes/',
        // {"id":"4","source_id":1,"source_ref":"a03e9454-0d11-11e8-906a-d094660d31fb","resource_version":"51499636","name":"dell-r430-20.cloudforms.lab.eng.rdu2.redhat.com","cpus":48,"memory":134906109952,"tenant_id":null,"created_at":"2018-10-17T15:32:12.633Z","updated_at":"2018-10-24T03:35:19.656Z","source_deleted_at":null,"source_created_at":"2018-02-08T20:49:58.000Z","archived_on":null}
        columns: [
            { title: 'ID', value: 'id' },
            { title: null, value: 'source_id' },
            { title: null, value: 'source_ref' },
            { title: 'Resource version', value: 'resource_version' },
            { title: 'Name', value: 'name' },
            { title: '# of CPUs', value: 'cpus' },
            { title: 'Memory', value: 'memory' },
            { title: 'Created at', value: 'created_at' },
            { title: 'Updated at', value: 'updated_at' },
            { title: null, value: 'source_deleted_at' },
            { title: null, value: 'tenant_id' },
            { title: null, value: 'source_created_at' },
            { title: 'Archived on', value: 'archived_on' }
        ]
    },
    container_templates: {
        displayName: 'Container Templates',
        //url: 'https://topological-inventory-api-topological-inventory-ci.10.8.96.54.nip.io/api/v0.0/sources/1/container_templates/',
        url: '/r/insights/platform/topological-inventory/v0.0/1/sources/container_templates/',
        // {"id":"131","source_id":1,"source_ref":"1e443dec-594a-11e8-ba7e-d094660d31fb","resource_version":"1689429","container_project_id":null,"created_at":"2018-10-17T15:32:12.764Z","updated_at":"2018-10-24T03:24:50.980Z","source_deleted_at":null,"tenant_id":null,"source_created_at":"2018-05-16T20:45:50.000Z","name":"nginx-example","archived_on":null}
        columns: [
            { title: 'ID', value: 'id' },
            { title: null, value: 'source_id' },
            { title: null, value: 'source_ref' },
            { title: 'Resource version', value: 'resource_version' },
            { title: 'Name', value: 'name' },
            { title: 'Container project', value: 'container_project_id' },
            { title: '# of CPUs', value: 'cpus' },
            { title: 'Memory', value: 'memory' },
            { title: 'Created at', value: 'created_at' },
            { title: 'Updated at', value: 'updated_at' },
            { title: null, value: 'source_deleted_at' },
            { title: null, value: 'tenant_id' },
            { title: null, value: 'source_created_at' },
            { title: 'Archived on', value: 'archived_on' }
        ]
    }
};
