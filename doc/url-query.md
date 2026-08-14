**Table of Contents**

- [URL query](#url-query)
  - [API](#api)
    - [limit](#limit)
    - [offset](#offset)
    - [filter[name] [contains_i]](#filtername-contains_i)
    - [filter[source_type_id] []](#filtersource_type_id-)
    - [filter[applications] [application_type_id] [eq] []](#filterapplications-application_type_id-eq-)
    - [filter[availability_status]](#filteravailability_status)
  - [Custom attributes](#custom-attributes)
    - [sort_by[]](#sort_by)
    - [category](#category)
    - [activeVendor [DEPRECATED]](#activevendor-deprecated)
    - [type](#type)
    - [application](#application)

# URL query

Sources UI accepts several URL query parameters to modify the initial state of the application.

```js
?sort_by[]=created_at:desc&limit=50&offset=0&activeVendor=Cloud&filter[name][contains_i]=dfgdf&filter[source_type_id][]=2&filter[source_type_id][]=1&filter[applications][application_type_id][eq][]=2&filter[availability_status]=available
```

## API

Following attributes follow the same structure and content as the [API](https://github.com/RedHatInsights/insights-api-common-rails#usage).

### limit

Items per page.

```
limit=50
```

### offset

Page (items per page * actual page)

```
offset=0
```

### filter[name] [contains_i]

Filter by name.

```
filter[name][contains_i]=some-name
```

### filter[source_type_id] []

Filter by source type.

```
filter[source_type_id][]=2&filter[source_type_id][]=1
```

### filter[applications] [application_type_id] [eq] []

Shows only sources with attached applications.

```
filter[applications][application_type_id][eq][]=2
```

### filter[availability_status]

Two options: `available` | `unavailable`

```
filter[availability_status]=available
```

## Custom attributes

Following attributes are using similar but modified API structure.

### sort_by[]

`<attribute>:<asc | desc>`

```
sort_by[]=created_at:desc
```

### category

Two options: `Cloud` | `Red Hat`

`Cloud` shows table for cloud providers (Amazon, Google, Azure, ...).

`Red Hat` shows all Red Hat types (Openshift, Satellite, ...).

```
category=Red%20Hat
```

### activeVendor [DEPRECATED]

See [Category](#activevendor-deprecated) above. This option is **deprecated** and it stays to keep backwards compatibility.

```
activeVendor=Red%20Hat
```

### type

Same as `filter[source_type_id][]`, but without needing to know IDs. Use the `source_type.name` attribute.

```
type=amazon&type=azure
```

### application

Same as `filter[applications][application_type_id][eq][]`, but without needing to know IDs. Use the `application_type.name` attribute. This name is matched via `includes` so the name does not have to be the exact value.

```
application=cost&application=topo
```