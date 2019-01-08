# TopologicalInventory.DefaultApi

All URIs are relative to *https://virtserver.swaggerhub.com/r/insights/platform/topological-inventory/v0.0*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createAuthentication**](DefaultApi.md#createAuthentication) | **POST** /authentications | Create a new Authentication
[**createEndpoint**](DefaultApi.md#createEndpoint) | **POST** /endpoints | Create a new Endpoint
[**createSource**](DefaultApi.md#createSource) | **POST** /sources | Create a new Source
[**createSourceType**](DefaultApi.md#createSourceType) | **POST** /source_types | Create a new SourceType
[**deleteAuthentication**](DefaultApi.md#deleteAuthentication) | **DELETE** /authentications/{id} | Delete an existing Authentication
[**deleteEndpoint**](DefaultApi.md#deleteEndpoint) | **DELETE** /endpoints/{id} | Delete an existing Endpoint
[**deleteSource**](DefaultApi.md#deleteSource) | **DELETE** /sources/{id} | Delete an existing Source
[**listAuthentications**](DefaultApi.md#listAuthentications) | **GET** /authentications | List Authentications
[**listContainerGroupContainers**](DefaultApi.md#listContainerGroupContainers) | **GET** /container_groups/{id}/containers | List Containers for ContainerGroup
[**listContainerGroups**](DefaultApi.md#listContainerGroups) | **GET** /container_groups | List ContainerGroups
[**listContainerImages**](DefaultApi.md#listContainerImages) | **GET** /container_images | List ContainerImages
[**listContainerNodeContainerGroups**](DefaultApi.md#listContainerNodeContainerGroups) | **GET** /container_nodes/{id}/container_groups | List ContainerGroups for ContainerNode
[**listContainerNodes**](DefaultApi.md#listContainerNodes) | **GET** /container_nodes | List ContainerNodes
[**listContainerProjectContainerGroups**](DefaultApi.md#listContainerProjectContainerGroups) | **GET** /container_projects/{id}/container_groups | List ContainerGroups for ContainerProject
[**listContainerProjectContainerTemplates**](DefaultApi.md#listContainerProjectContainerTemplates) | **GET** /container_projects/{id}/container_templates | List ContainerTemplates for ContainerProject
[**listContainerProjects**](DefaultApi.md#listContainerProjects) | **GET** /container_projects | List ContainerProjects
[**listContainerTemplates**](DefaultApi.md#listContainerTemplates) | **GET** /container_templates | List ContainerTemplates
[**listContainers**](DefaultApi.md#listContainers) | **GET** /containers | List Containers
[**listEndpoints**](DefaultApi.md#listEndpoints) | **GET** /endpoints | List Endpoints
[**listFlavors**](DefaultApi.md#listFlavors) | **GET** /flavors | List Flavors
[**listOrchestrationStacks**](DefaultApi.md#listOrchestrationStacks) | **GET** /orchestration_stacks | List OrchestrationStacks
[**listServiceInstances**](DefaultApi.md#listServiceInstances) | **GET** /service_instances | List ServiceInstances
[**listServiceOfferingServiceInstances**](DefaultApi.md#listServiceOfferingServiceInstances) | **GET** /service_offerings/{id}/service_instances | List ServiceInstances for ServiceOffering
[**listServiceOfferingServicePlans**](DefaultApi.md#listServiceOfferingServicePlans) | **GET** /service_offerings/{id}/service_plans | List ServicePlans for ServiceOffering
[**listServiceOfferings**](DefaultApi.md#listServiceOfferings) | **GET** /service_offerings | List ServiceOfferings
[**listServicePlanServiceInstances**](DefaultApi.md#listServicePlanServiceInstances) | **GET** /service_plans/{id}/service_instances | List ServiceInstances for ServicePlan
[**listServicePlans**](DefaultApi.md#listServicePlans) | **GET** /service_plans | List ServicePlans
[**listSourceContainerGroups**](DefaultApi.md#listSourceContainerGroups) | **GET** /sources/{id}/container_groups | List ContainerGroups for Source
[**listSourceContainerImages**](DefaultApi.md#listSourceContainerImages) | **GET** /sources/{id}/container_images | List ContainerImages for Source
[**listSourceContainerNodes**](DefaultApi.md#listSourceContainerNodes) | **GET** /sources/{id}/container_nodes | List ContainerNodes for Source
[**listSourceContainerProjects**](DefaultApi.md#listSourceContainerProjects) | **GET** /sources/{id}/container_projects | List ContainerProjects for Source
[**listSourceContainerTemplates**](DefaultApi.md#listSourceContainerTemplates) | **GET** /sources/{id}/container_templates | List ContainerTemplates for Source
[**listSourceContainers**](DefaultApi.md#listSourceContainers) | **GET** /sources/{id}/containers | List Containers for Source
[**listSourceEndpoints**](DefaultApi.md#listSourceEndpoints) | **GET** /sources/{id}/endpoints | List Endpoints for Source
[**listSourceOrchestrationStacks**](DefaultApi.md#listSourceOrchestrationStacks) | **GET** /sources/{id}/orchestration_stacks | List OrchestrationStacks for Source
[**listSourceServiceInstances**](DefaultApi.md#listSourceServiceInstances) | **GET** /sources/{id}/service_instances | List ServiceInstances for Source
[**listSourceServiceOfferings**](DefaultApi.md#listSourceServiceOfferings) | **GET** /sources/{id}/service_offerings | List ServiceOfferings for Source
[**listSourceServicePlans**](DefaultApi.md#listSourceServicePlans) | **GET** /sources/{id}/service_plans | List ServicePlans for Source
[**listSourceTypeSources**](DefaultApi.md#listSourceTypeSources) | **GET** /source_types/{id}/sources | List Sources for SourceType
[**listSourceTypes**](DefaultApi.md#listSourceTypes) | **GET** /source_types | List SourceTypes
[**listSourceVms**](DefaultApi.md#listSourceVms) | **GET** /sources/{id}/vms | List Vms for Source
[**listSourceVolumeTypes**](DefaultApi.md#listSourceVolumeTypes) | **GET** /sources/{id}/volume_types | List VolumeTypes for Source
[**listSourceVolumes**](DefaultApi.md#listSourceVolumes) | **GET** /sources/{id}/volumes | List Volumes for Source
[**listSources**](DefaultApi.md#listSources) | **GET** /sources | List Sources
[**listTasks**](DefaultApi.md#listTasks) | **GET** /tasks | List Tasks
[**listVmVolumeAttachments**](DefaultApi.md#listVmVolumeAttachments) | **GET** /vms/{id}/volume_attachments | List VolumeAttachments for Vm
[**listVmVolumes**](DefaultApi.md#listVmVolumes) | **GET** /vms/{id}/volumes | List Volumes for Vm
[**listVms**](DefaultApi.md#listVms) | **GET** /vms | List Vms
[**listVolumeAttachments**](DefaultApi.md#listVolumeAttachments) | **GET** /volume_attachments | List VolumeAttachments
[**listVolumeTypes**](DefaultApi.md#listVolumeTypes) | **GET** /volume_types | List VolumeTypes
[**listVolumes**](DefaultApi.md#listVolumes) | **GET** /volumes | List Volumes
[**orderServicePlan**](DefaultApi.md#orderServicePlan) | **POST** /service_plans/{id}/order | Order an existing ServicePlan
[**replaceAuthentication**](DefaultApi.md#replaceAuthentication) | **PUT** /authentications/{id} | Replace an existing Authentication
[**replaceEndpoint**](DefaultApi.md#replaceEndpoint) | **PUT** /endpoints/{id} | Replace an existing Endpoint
[**replaceSource**](DefaultApi.md#replaceSource) | **PUT** /sources/{id} | Replace an existing Source
[**showAuthentication**](DefaultApi.md#showAuthentication) | **GET** /authentications/{id} | Show an existing Authentication
[**showContainer**](DefaultApi.md#showContainer) | **GET** /containers/{id} | Show an existing Container
[**showContainerGroup**](DefaultApi.md#showContainerGroup) | **GET** /container_groups/{id} | Show an existing ContainerGroup
[**showContainerImage**](DefaultApi.md#showContainerImage) | **GET** /container_images/{id} | Show an existing ContainerImage
[**showContainerNode**](DefaultApi.md#showContainerNode) | **GET** /container_nodes/{id} | Show an existing ContainerNode
[**showContainerProject**](DefaultApi.md#showContainerProject) | **GET** /container_projects/{id} | Show an existing ContainerProject
[**showContainerTemplate**](DefaultApi.md#showContainerTemplate) | **GET** /container_templates/{id} | Show an existing ContainerTemplate
[**showEndpoint**](DefaultApi.md#showEndpoint) | **GET** /endpoints/{id} | Show an existing Endpoint
[**showFlavor**](DefaultApi.md#showFlavor) | **GET** /flavors/{id} | Show an existing Flavor
[**showOrchestrationStack**](DefaultApi.md#showOrchestrationStack) | **GET** /orchestration_stacks/{id} | Show an existing OrchestrationStack
[**showServiceInstance**](DefaultApi.md#showServiceInstance) | **GET** /service_instances/{id} | Show an existing ServiceInstance
[**showServiceOffering**](DefaultApi.md#showServiceOffering) | **GET** /service_offerings/{id} | Show an existing ServiceOffering
[**showServicePlan**](DefaultApi.md#showServicePlan) | **GET** /service_plans/{id} | Show an existing ServicePlan
[**showSource**](DefaultApi.md#showSource) | **GET** /sources/{id} | Show an existing Source
[**showSourceType**](DefaultApi.md#showSourceType) | **GET** /source_types/{id} | Show an existing SourceType
[**showTask**](DefaultApi.md#showTask) | **GET** /tasks/{id} | Show an existing Task
[**showVm**](DefaultApi.md#showVm) | **GET** /vms/{id} | Show an existing Vm
[**showVolume**](DefaultApi.md#showVolume) | **GET** /volumes/{id} | Show an existing Volume
[**showVolumeAttachment**](DefaultApi.md#showVolumeAttachment) | **GET** /volume_attachments/{id} | Show an existing VolumeAttachment
[**showVolumeType**](DefaultApi.md#showVolumeType) | **GET** /volume_types/{id} | Show an existing VolumeType
[**updateAuthentication**](DefaultApi.md#updateAuthentication) | **PATCH** /authentications/{id} | Update an existing Authentication
[**updateEndpoint**](DefaultApi.md#updateEndpoint) | **PATCH** /endpoints/{id} | Update an existing Endpoint
[**updateSource**](DefaultApi.md#updateSource) | **PATCH** /sources/{id} | Update an existing Source


<a name="createAuthentication"></a>
# **createAuthentication**
> Object createAuthentication(body)

Create a new Authentication

Creates a Authentication object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let body = new TopologicalInventory.ID(); // ID | 

apiInstance.createAuthentication(body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**ID**](ID.md)|  | 

### Return type

**Object**

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="createEndpoint"></a>
# **createEndpoint**
> Object createEndpoint(body)

Create a new Endpoint

Creates a Endpoint object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let body = new TopologicalInventory.ID(); // ID | 

apiInstance.createEndpoint(body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**ID**](ID.md)|  | 

### Return type

**Object**

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="createSource"></a>
# **createSource**
> Object createSource(body)

Create a new Source

Creates a Source object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let body = new TopologicalInventory.ID(); // ID | 

apiInstance.createSource(body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**ID**](ID.md)|  | 

### Return type

**Object**

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="createSourceType"></a>
# **createSourceType**
> Object createSourceType(body)

Create a new SourceType

Creates a SourceType object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let body = new TopologicalInventory.ID(); // ID | 

apiInstance.createSourceType(body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**ID**](ID.md)|  | 

### Return type

**Object**

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="deleteAuthentication"></a>
# **deleteAuthentication**
> deleteAuthentication(id)

Delete an existing Authentication

Deletes a Authentication object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.deleteAuthentication(id).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

null (empty response body)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deleteEndpoint"></a>
# **deleteEndpoint**
> deleteEndpoint(id)

Delete an existing Endpoint

Deletes a Endpoint object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.deleteEndpoint(id).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

null (empty response body)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deleteSource"></a>
# **deleteSource**
> deleteSource(id)

Delete an existing Source

Deletes a Source object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.deleteSource(id).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

null (empty response body)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listAuthentications"></a>
# **listAuthentications**
> [Authentication] listAuthentications()

List Authentications

Returns an array of Authentication objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listAuthentications().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[Authentication]**](Authentication.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listContainerGroupContainers"></a>
# **listContainerGroupContainers**
> [Container] listContainerGroupContainers(id)

List Containers for ContainerGroup

Returns an array of Container objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listContainerGroupContainers(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[Container]**](Container.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listContainerGroups"></a>
# **listContainerGroups**
> [ContainerGroup] listContainerGroups()

List ContainerGroups

Returns an array of ContainerGroup objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listContainerGroups().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[ContainerGroup]**](ContainerGroup.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listContainerImages"></a>
# **listContainerImages**
> [ContainerImage] listContainerImages()

List ContainerImages

Returns an array of ContainerImage objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listContainerImages().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[ContainerImage]**](ContainerImage.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listContainerNodeContainerGroups"></a>
# **listContainerNodeContainerGroups**
> [ContainerGroup] listContainerNodeContainerGroups(id)

List ContainerGroups for ContainerNode

Returns an array of ContainerGroup objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listContainerNodeContainerGroups(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[ContainerGroup]**](ContainerGroup.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listContainerNodes"></a>
# **listContainerNodes**
> [ContainerNode] listContainerNodes()

List ContainerNodes

Returns an array of ContainerNode objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listContainerNodes().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[ContainerNode]**](ContainerNode.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listContainerProjectContainerGroups"></a>
# **listContainerProjectContainerGroups**
> [ContainerGroup] listContainerProjectContainerGroups(id)

List ContainerGroups for ContainerProject

Returns an array of ContainerGroup objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listContainerProjectContainerGroups(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[ContainerGroup]**](ContainerGroup.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listContainerProjectContainerTemplates"></a>
# **listContainerProjectContainerTemplates**
> [ContainerTemplate] listContainerProjectContainerTemplates(id)

List ContainerTemplates for ContainerProject

Returns an array of ContainerTemplate objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listContainerProjectContainerTemplates(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[ContainerTemplate]**](ContainerTemplate.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listContainerProjects"></a>
# **listContainerProjects**
> [ContainerProject] listContainerProjects()

List ContainerProjects

Returns an array of ContainerProject objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listContainerProjects().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[ContainerProject]**](ContainerProject.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listContainerTemplates"></a>
# **listContainerTemplates**
> [ContainerTemplate] listContainerTemplates()

List ContainerTemplates

Returns an array of ContainerTemplate objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listContainerTemplates().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[ContainerTemplate]**](ContainerTemplate.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listContainers"></a>
# **listContainers**
> [Container] listContainers()

List Containers

Returns an array of Container objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listContainers().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[Container]**](Container.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listEndpoints"></a>
# **listEndpoints**
> [Endpoint] listEndpoints()

List Endpoints

Returns an array of Endpoint objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listEndpoints().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[Endpoint]**](Endpoint.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listFlavors"></a>
# **listFlavors**
> [Flavor] listFlavors()

List Flavors

Returns an array of Flavor objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listFlavors().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[Flavor]**](Flavor.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listOrchestrationStacks"></a>
# **listOrchestrationStacks**
> [OrchestrationStack] listOrchestrationStacks()

List OrchestrationStacks

Returns an array of OrchestrationStack objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listOrchestrationStacks().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[OrchestrationStack]**](OrchestrationStack.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listServiceInstances"></a>
# **listServiceInstances**
> [ServiceInstance] listServiceInstances()

List ServiceInstances

Returns an array of ServiceInstance objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listServiceInstances().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[ServiceInstance]**](ServiceInstance.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listServiceOfferingServiceInstances"></a>
# **listServiceOfferingServiceInstances**
> [ServiceInstance] listServiceOfferingServiceInstances(id)

List ServiceInstances for ServiceOffering

Returns an array of ServiceInstance objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listServiceOfferingServiceInstances(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[ServiceInstance]**](ServiceInstance.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listServiceOfferingServicePlans"></a>
# **listServiceOfferingServicePlans**
> [ServicePlan] listServiceOfferingServicePlans(id)

List ServicePlans for ServiceOffering

Returns an array of ServicePlan objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listServiceOfferingServicePlans(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[ServicePlan]**](ServicePlan.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listServiceOfferings"></a>
# **listServiceOfferings**
> [ServiceOffering] listServiceOfferings()

List ServiceOfferings

Returns an array of ServiceOffering objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listServiceOfferings().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[ServiceOffering]**](ServiceOffering.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listServicePlanServiceInstances"></a>
# **listServicePlanServiceInstances**
> [ServiceInstance] listServicePlanServiceInstances(id)

List ServiceInstances for ServicePlan

Returns an array of ServiceInstance objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listServicePlanServiceInstances(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[ServiceInstance]**](ServiceInstance.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listServicePlans"></a>
# **listServicePlans**
> [ServicePlan] listServicePlans()

List ServicePlans

Returns an array of ServicePlan objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listServicePlans().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[ServicePlan]**](ServicePlan.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listSourceContainerGroups"></a>
# **listSourceContainerGroups**
> [ContainerGroup] listSourceContainerGroups(id)

List ContainerGroups for Source

Returns an array of ContainerGroup objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listSourceContainerGroups(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[ContainerGroup]**](ContainerGroup.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listSourceContainerImages"></a>
# **listSourceContainerImages**
> [ContainerImage] listSourceContainerImages(id)

List ContainerImages for Source

Returns an array of ContainerImage objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listSourceContainerImages(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[ContainerImage]**](ContainerImage.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listSourceContainerNodes"></a>
# **listSourceContainerNodes**
> [ContainerNode] listSourceContainerNodes(id)

List ContainerNodes for Source

Returns an array of ContainerNode objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listSourceContainerNodes(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[ContainerNode]**](ContainerNode.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listSourceContainerProjects"></a>
# **listSourceContainerProjects**
> [ContainerProject] listSourceContainerProjects(id)

List ContainerProjects for Source

Returns an array of ContainerProject objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listSourceContainerProjects(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[ContainerProject]**](ContainerProject.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listSourceContainerTemplates"></a>
# **listSourceContainerTemplates**
> [ContainerTemplate] listSourceContainerTemplates(id)

List ContainerTemplates for Source

Returns an array of ContainerTemplate objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listSourceContainerTemplates(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[ContainerTemplate]**](ContainerTemplate.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listSourceContainers"></a>
# **listSourceContainers**
> [Container] listSourceContainers(id)

List Containers for Source

Returns an array of Container objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listSourceContainers(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[Container]**](Container.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listSourceEndpoints"></a>
# **listSourceEndpoints**
> [Endpoint] listSourceEndpoints(id)

List Endpoints for Source

Returns an array of Endpoint objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listSourceEndpoints(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[Endpoint]**](Endpoint.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listSourceOrchestrationStacks"></a>
# **listSourceOrchestrationStacks**
> [OrchestrationStack] listSourceOrchestrationStacks(id)

List OrchestrationStacks for Source

Returns an array of OrchestrationStack objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listSourceOrchestrationStacks(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[OrchestrationStack]**](OrchestrationStack.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listSourceServiceInstances"></a>
# **listSourceServiceInstances**
> [ServiceInstance] listSourceServiceInstances(id)

List ServiceInstances for Source

Returns an array of ServiceInstance objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listSourceServiceInstances(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[ServiceInstance]**](ServiceInstance.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listSourceServiceOfferings"></a>
# **listSourceServiceOfferings**
> [ServiceOffering] listSourceServiceOfferings(id)

List ServiceOfferings for Source

Returns an array of ServiceOffering objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listSourceServiceOfferings(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[ServiceOffering]**](ServiceOffering.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listSourceServicePlans"></a>
# **listSourceServicePlans**
> [ServicePlan] listSourceServicePlans(id)

List ServicePlans for Source

Returns an array of ServicePlan objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listSourceServicePlans(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[ServicePlan]**](ServicePlan.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listSourceTypeSources"></a>
# **listSourceTypeSources**
> [Source] listSourceTypeSources(id)

List Sources for SourceType

Returns an array of Source objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listSourceTypeSources(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[Source]**](Source.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listSourceTypes"></a>
# **listSourceTypes**
> [SourceType] listSourceTypes()

List SourceTypes

Returns an array of SourceType objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listSourceTypes().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[SourceType]**](SourceType.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listSourceVms"></a>
# **listSourceVms**
> [Vm] listSourceVms(id)

List Vms for Source

Returns an array of Vm objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listSourceVms(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[Vm]**](Vm.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listSourceVolumeTypes"></a>
# **listSourceVolumeTypes**
> [VolumeType] listSourceVolumeTypes(id)

List VolumeTypes for Source

Returns an array of VolumeType objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listSourceVolumeTypes(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[VolumeType]**](VolumeType.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listSourceVolumes"></a>
# **listSourceVolumes**
> [Volume] listSourceVolumes(id)

List Volumes for Source

Returns an array of Volume objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listSourceVolumes(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[Volume]**](Volume.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listSources"></a>
# **listSources**
> [Source] listSources()

List Sources

Returns an array of Source objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listSources().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[Source]**](Source.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listTasks"></a>
# **listTasks**
> [Task] listTasks()

List Tasks

Returns an array of Task objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listTasks().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[Task]**](Task.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listVmVolumeAttachments"></a>
# **listVmVolumeAttachments**
> [VolumeAttachment] listVmVolumeAttachments(id)

List VolumeAttachments for Vm

Returns an array of VolumeAttachment objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listVmVolumeAttachments(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[VolumeAttachment]**](VolumeAttachment.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listVmVolumes"></a>
# **listVmVolumes**
> [Volume] listVmVolumes(id)

List Volumes for Vm

Returns an array of Volume objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.listVmVolumes(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**[Volume]**](Volume.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listVms"></a>
# **listVms**
> [Vm] listVms()

List Vms

Returns an array of Vm objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listVms().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[Vm]**](Vm.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listVolumeAttachments"></a>
# **listVolumeAttachments**
> [VolumeAttachment] listVolumeAttachments()

List VolumeAttachments

Returns an array of VolumeAttachment objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listVolumeAttachments().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[VolumeAttachment]**](VolumeAttachment.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listVolumeTypes"></a>
# **listVolumeTypes**
> [VolumeType] listVolumeTypes()

List VolumeTypes

Returns an array of VolumeType objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listVolumeTypes().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[VolumeType]**](VolumeType.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="listVolumes"></a>
# **listVolumes**
> [Volume] listVolumes()

List Volumes

Returns an array of Volume objects

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();
apiInstance.listVolumes().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[Volume]**](Volume.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="orderServicePlan"></a>
# **orderServicePlan**
> InlineResponse200 orderServicePlan(idparameters)

Order an existing ServicePlan

Returns a Task id

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

let parameters = new TopologicalInventory.OrderParameters(); // OrderParameters | Order parameters defining the service and provider control

apiInstance.orderServicePlan(idparameters).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 
 **parameters** | [**OrderParameters**](OrderParameters.md)| Order parameters defining the service and provider control | 

### Return type

[**InlineResponse200**](InlineResponse200.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

<a name="replaceAuthentication"></a>
# **replaceAuthentication**
> replaceAuthentication(id)

Replace an existing Authentication

Replaces a Authentication object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.replaceAuthentication(id).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

null (empty response body)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="replaceEndpoint"></a>
# **replaceEndpoint**
> replaceEndpoint(id)

Replace an existing Endpoint

Replaces a Endpoint object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.replaceEndpoint(id).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

null (empty response body)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="replaceSource"></a>
# **replaceSource**
> replaceSource(id)

Replace an existing Source

Replaces a Source object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.replaceSource(id).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

null (empty response body)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="showAuthentication"></a>
# **showAuthentication**
> Authentication showAuthentication(id)

Show an existing Authentication

Returns a Authentication object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.showAuthentication(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**Authentication**](Authentication.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showContainer"></a>
# **showContainer**
> Container showContainer(id)

Show an existing Container

Returns a Container object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.showContainer(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**Container**](Container.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showContainerGroup"></a>
# **showContainerGroup**
> ContainerGroup showContainerGroup(id)

Show an existing ContainerGroup

Returns a ContainerGroup object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.showContainerGroup(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**ContainerGroup**](ContainerGroup.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showContainerImage"></a>
# **showContainerImage**
> ContainerImage showContainerImage(id)

Show an existing ContainerImage

Returns a ContainerImage object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.showContainerImage(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**ContainerImage**](ContainerImage.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showContainerNode"></a>
# **showContainerNode**
> ContainerNode showContainerNode(id)

Show an existing ContainerNode

Returns a ContainerNode object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.showContainerNode(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**ContainerNode**](ContainerNode.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showContainerProject"></a>
# **showContainerProject**
> ContainerProject showContainerProject(id)

Show an existing ContainerProject

Returns a ContainerProject object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.showContainerProject(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**ContainerProject**](ContainerProject.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showContainerTemplate"></a>
# **showContainerTemplate**
> ContainerTemplate showContainerTemplate(id)

Show an existing ContainerTemplate

Returns a ContainerTemplate object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.showContainerTemplate(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**ContainerTemplate**](ContainerTemplate.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showEndpoint"></a>
# **showEndpoint**
> Endpoint showEndpoint(id)

Show an existing Endpoint

Returns a Endpoint object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.showEndpoint(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**Endpoint**](Endpoint.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showFlavor"></a>
# **showFlavor**
> Flavor showFlavor(id)

Show an existing Flavor

Returns a Flavor object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.showFlavor(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**Flavor**](Flavor.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showOrchestrationStack"></a>
# **showOrchestrationStack**
> OrchestrationStack showOrchestrationStack(id)

Show an existing OrchestrationStack

Returns a OrchestrationStack object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.showOrchestrationStack(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**OrchestrationStack**](OrchestrationStack.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showServiceInstance"></a>
# **showServiceInstance**
> ServiceInstance showServiceInstance(id)

Show an existing ServiceInstance

Returns a ServiceInstance object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.showServiceInstance(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**ServiceInstance**](ServiceInstance.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showServiceOffering"></a>
# **showServiceOffering**
> ServiceOffering showServiceOffering(id)

Show an existing ServiceOffering

Returns a ServiceOffering object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.showServiceOffering(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**ServiceOffering**](ServiceOffering.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showServicePlan"></a>
# **showServicePlan**
> ServicePlan showServicePlan(id)

Show an existing ServicePlan

Returns a ServicePlan object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.showServicePlan(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**ServicePlan**](ServicePlan.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showSource"></a>
# **showSource**
> Source showSource(id)

Show an existing Source

Returns a Source object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.showSource(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**Source**](Source.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showSourceType"></a>
# **showSourceType**
> SourceType showSourceType(id)

Show an existing SourceType

Returns a SourceType object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.showSourceType(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**SourceType**](SourceType.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showTask"></a>
# **showTask**
> Task showTask(id)

Show an existing Task

Returns a Task object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.showTask(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**Task**](Task.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showVm"></a>
# **showVm**
> Vm showVm(id)

Show an existing Vm

Returns a Vm object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.showVm(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**Vm**](Vm.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showVolume"></a>
# **showVolume**
> Volume showVolume(id)

Show an existing Volume

Returns a Volume object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.showVolume(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**Volume**](Volume.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showVolumeAttachment"></a>
# **showVolumeAttachment**
> VolumeAttachment showVolumeAttachment(id)

Show an existing VolumeAttachment

Returns a VolumeAttachment object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.showVolumeAttachment(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**VolumeAttachment**](VolumeAttachment.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="showVolumeType"></a>
# **showVolumeType**
> VolumeType showVolumeType(id)

Show an existing VolumeType

Returns a VolumeType object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.showVolumeType(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

[**VolumeType**](VolumeType.md)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="updateAuthentication"></a>
# **updateAuthentication**
> updateAuthentication(id)

Update an existing Authentication

Updates a Authentication object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.updateAuthentication(id).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

null (empty response body)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="updateEndpoint"></a>
# **updateEndpoint**
> updateEndpoint(id)

Update an existing Endpoint

Updates a Endpoint object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.updateEndpoint(id).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

null (empty response body)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="updateSource"></a>
# **updateSource**
> updateSource(id)

Update an existing Source

Updates a Source object

### Example
```javascript
import TopologicalInventory from 'topological_inventory';
let defaultClient = TopologicalInventory.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
let UserSecurity = defaultClient.authentications['UserSecurity'];
UserSecurity.username = 'YOUR USERNAME';
UserSecurity.password = 'YOUR PASSWORD';

let apiInstance = new TopologicalInventory.DefaultApi();

let id = "id_example"; // String | ID of the resource

apiInstance.updateSource(id).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| ID of the resource | 

### Return type

null (empty response body)

### Authorization

[UserSecurity](../README.md#UserSecurity)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

