export const CSV_FILE = `Name,Type,Connected applications,Date added,Status
MPTEST3214411,Red Hat Virtualization,,2019-04-23T18:21:07.081Z,available
AWStest2x,VMware vSphere,,2019-05-03T15:01:42.732Z,
adf,VMware vSphere,,2019-05-27T14:13:45.773Z,
Test123456,Ansible Tower,Catalog,2019-08-06T12:18:25.410Z,unavailable
TestWithoutApp,Ansible Tower,,2019-08-06T12:47:11.917Z,
Test178794546,VMware vSphere,"Catalog,Cost Management,Topological Inventory",2019-08-06T12:54:07.119Z,partially_available`;

export const JSON_FILE_STRING = `[
  {
    "Name": "MPTEST3214411",
    "Type": "Red Hat Virtualization",
    "Connected applications": "",
    "Date added": "2019-04-23T18:21:07.081Z",
    "Status": "available"
  },
  {
    "Name": "AWStest2x",
    "Type": "VMware vSphere",
    "Connected applications": "",
    "Date added": "2019-05-03T15:01:42.732Z"
  },
  {
    "Name": "adf",
    "Type": "VMware vSphere",
    "Connected applications": "",
    "Date added": "2019-05-27T14:13:45.773Z",
    "Status": null
  },
  {
    "Name": "Test123456",
    "Type": "Ansible Tower",
    "Connected applications": "Catalog",
    "Date added": "2019-08-06T12:18:25.410Z",
    "Status": "unavailable"
  },
  {
    "Name": "TestWithoutApp",
    "Type": "Ansible Tower",
    "Connected applications": "",
    "Date added": "2019-08-06T12:47:11.917Z"
  },
  {
    "Name": "Test178794546",
    "Type": "VMware vSphere",
    "Connected applications": "Catalog,Cost Management,Topological Inventory",
    "Date added": "2019-08-06T12:54:07.119Z",
    "Status": "partially_available"
  }
]`;

export const JSON_FILE = [
  {
    'Connected applications': '',
    'Date added': '2019-04-23T18:21:07.081Z',
    Name: 'MPTEST3214411',
    Status: 'available',
    Type: 'Red Hat Virtualization',
  },
  { 'Connected applications': '', 'Date added': '2019-05-03T15:01:42.732Z', Name: 'AWStest2x', Type: 'VMware vSphere' },
  {
    'Connected applications': '',
    'Date added': '2019-05-27T14:13:45.773Z',
    Name: 'adf',
    Status: null,
    Type: 'VMware vSphere',
  },
  {
    'Connected applications': 'Catalog',
    'Date added': '2019-08-06T12:18:25.410Z',
    Name: 'Test123456',
    Status: 'unavailable',
    Type: 'Ansible Tower',
  },
  { 'Connected applications': '', 'Date added': '2019-08-06T12:47:11.917Z', Name: 'TestWithoutApp', Type: 'Ansible Tower' },
  {
    'Connected applications': 'Catalog,Cost Management,Topological Inventory',
    'Date added': '2019-08-06T12:54:07.119Z',
    Name: 'Test178794546',
    Status: 'partially_available',
    Type: 'VMware vSphere',
  },
];
