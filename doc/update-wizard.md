**Table of Contents**

- [Updating Add Source Wizard](#updating-add-source-wizard)
  - [Source types](#source-types)
    - [Authentication type](#authentication-type)
  - [Application types](#application-types)
- [Custom steps](#custom-steps)
  - [Example](#example)
  - [Custom API endpoint](#custom-api-endpoint)
  - [Available prefixes](#available-prefixes)
- [Quick check-list](#quick-check-list)

# Updating Add Source Wizard

The Add Source Wizard is using several repositories as sources for information. Firstly, all source and application types are strictly defined in [Sources API repository](https://github.com/RedHatInsights/sources-api/tree/master/db/seeds).

## [Source types](https://github.com/RedHatInsights/sources-api/blob/master/db/seeds/source_types.yml)

This YAML file defines source types for both backend and frontend.

Each type is identified by name (`amazon`), this name has to be unique. (Please, don't rely on source types' `id`s as they can be changed and depends only on the order of their creation.)

`product_name` defines the name for the UI.

There is also `vendor` key for the identification of the type's vendor. This value is not shown in the UI, but is used to split the UI to two sections: **Cloud sources** and **Red Hat sources**. Red Hat sources are sources of type with vendor = `Red Hat`. Cloud sources are all other types. The wizard determines what Sources to show depending on a URL query: `?activeVendor=Red Hat|Cloud`.

`icon_url` is a URL leading to images in [Insights Frontend Assets](https://github.com/RedHatInsights/frontend-assets) repository. If you need to add/change/remove some icon, please do it there. The UI has no hardcoded images.

The most important attribute for the UI is `schema`. This attribute defines:

1. available authentication types
2. endpoint

A source type without schema cannot be added by the UI.

### Authentication type

Each authentication type is defined by three attributes: `type`, `name`, `fields`.

`type` is a unique identifier, similar in use to source types' names, should correspond to `authtype` value stored in the API.

`name` is the identifier used in UI.

`fields` define inputs for each required/optional value. This attribute follows [Data Driven Forms](https://data-driven-forms.org/) schema. Please, firstly take a look at its documentation to get more information on how to defined fields. Data Driven Forms is a library that renders data definitions into fully functional forms, so that way we can store the whole source type configuration in the API. Each change in the API is immediately passed to the UI. Data Driven Forms takes care of the form state, validation, conditional fields and others. There is no need to manually program any functionality.

Quick guide:

```yaml
:component         => ... # type of the input: text-field, textarea, switch...
:name              => ... # name consists of two parts: prefix and the actual name.
                          # Prefix is one of 'authentication', 'endpoint' (or application-specific prefixes, currently implemented only by cost management) and the name is the rest of the name.
                          # In prefix, you choose which entity will receive the value. For example, all values with the prefix 'authentication' are sent to the authentication entity.
                          # With using this, the UI does not need to know anything about fields and can dynamically send values to the right places.
                          # Nested names are parsed, so authentication.extra.name is sent to authentication's API endpoint as { extra: { name: 'value' } }
:label             => ... # label shown in the UI
:initialValue      => ... # initial value
:initializeOnMount => true || false # initialValue is set only the first time the field is shown
:hideField         => true || false # user cannot see the field, set initializeOnMount to true, when this is a true
:stepKey           => ... # identifier of steps, where the field should be shown
                          # (mostly application-specific)
```

For more information (conditional fields, validation, etc.), see the [documentation page](https://data-driven-forms.org/).

How to setup predefined values? Each authentication type needs at least one pre-defined value: `authtype`. You can set it by setting a field like this:

```yaml
:name              => 'authentication.authtype',
:initialValue      => 'token',
:initializeOnMount => true,
:hideField         => true,
:component         => 'text-field' # each fields in DDF needs to have :component defined
```

Each time this 'hidden' field is used in the UI, the value 'authtype' is set to 'token'. Users cannot see this value, they cannot edit it.

*Notes: Topological Inventory is now **hidden** in the UI.*

## [Application types](https://github.com/RedHatInsights/sources-api/blob/master/db/seeds/application_types.yml)

An application type is defined by several basic attributes:

`name` unique identifier.

`diplay_name` label shown in the UI.

`dependent_applications` array of applications, that is needed for the correct setup of this application.

`supported_source_types` array of source types to which this application can be attached.

`supported_authentication_types` a hash with an array of supported authentication types for each source type. Be aware that the UI isn't supporting multiple authentication types for one source and application.

# Custom steps

With using the two mentioned configuration files, you can easily add a new application or a source type with all needed configuration. All these files are directly transformed into Add source wizard, Add application wizard and Edit source forms. However, all these fields can be enhanced and modified in the UI to comply with our UX vision and design.

All changes are made in `hardcodedSchemas` file (link [here](https://github.com/RedHatInsights/sources-ui/blob/master/src/components/addSourceWizard/hardcodedSchemas.js)).

This file is a similar config to the following structure:

```js
{
    [source_type.name]: {
        authentication: {
            [authentication.type]: {
                [applicatio_type.name]: {
                    additionalFields: [ ... ],
                    skipSelection: true || false,
                    skipEndpoint: true || false,
                    additionalSteps: [ ... ],
                    customSteps: true || false,
                    useApplicationAuth: true || false,
                    ...enhancedFields,
                }
            },
            'generic': { ... }
        },
        endpoint: {
            additionalFields: [ ... ],
            additionalSteps: [ ... ],
            ...enhancedFields,
        }
    }
}
```

`additionalFields` use to add additional fields to simple API fields. These fields are added to the beginning of the step. Used to add text guides.

`skipSelection` select to true, if you need to skip the authentication selection page. (Applications support only one type, so it should be set always to true.)

`skipEndpoint` set to true, if you want to skip the endpoint step. Endpoint fields will not be shown in the wizard summary.

`additionalSteps` use this array to add additional steps in the wizard. Please take a look on DDF documentation page or other examples in the hardcoded schemas file.

*Notes: The first step should not contain any `name`, all `name`s have to be unique in the whole file otherwise users could be directed to the wrong steps!*

`customSteps` set to true, if you want to replace the endpoint implementation with your own. Just add endpoint steps to `additionalSteps` and config them here.

`useApplicationAuth` if it is set to true, the authentication record will be linked to a application, not endpoint. Use if you want to avoid using topology for checking sources statuses.

`enhancedFields` you can enhance all fields by using their name as a key here and then follow the DDF standard.

`generic` applications without their own steps will use configuration for this name.

## Example

```jsx
{
    openshift: { // openshift source type selected
        authentication: {
            'insights/topological-inventory': { // topological inventory app selected
                skipSelection: true, // only one available
                'authentication.password': {
                    label: <LabelPassword>,  // enhances the label of password field
                    'aria-label': 'Password' // if you set a custom label (component, node)
                                             // define aria-label as a string
                                             // this string will be used in the summary
                },
                additionalSteps: [{ // adds two steps and overwrites fields from the API
                    // do not set up name for the first step
                    nextStep: 'step-2',
                    fields: [{
                        name: 'authentication.password', // sets position of the field
                        component: 'text-field'          // do not enhance the field here
                                                         // but use the top level key
                                                         // (it's simpler to traverse
                                                         // this structure than going
                                                         // over an array)
                    }, {
                        name: 'authentication.authtype',
                        component: 'text-field',
                        initializeOnMount: true,
                        initialValue: 'token',
                        hideField: true,
                    }]
                }, {
                    name: 'step-2', // has to be unique (for the whole file)
                    fields: [{
                        name: 'summary-description',
                        component: 'description', // custom component, renders a component from Content
                        Content: OpenShiftSummary
                    }]
                }]
            }
        },
        endpoint: {
            url: { // enhance the URL field with custom label
                label: 'This is URL'
            },
            additionalFields: [{
                name: 'url-description', // puts a description above the URL field
                component: 'description',
                Content: UrlDescription
            }]
        }
    }
}
```

For more examples, look at the file itself. There are many different uses.

## Custom API endpoint

If you want to add an additional API endpoint for application-specific values, please take a look at how the cost management is implemented. (Choose a unique prefix.)

## Available prefixes

`authentication.` will be sent to createAuthentication (`authentication.password`, `authentication.username`, ...)

*Notes: don't forget to always set `authentication.authtype`*

`source.` will be sent to createSource (`source.ref`, ...)

`endpoint.` will be sent to createEndpoint (`endoint.port`, `endpoint.verify_ssl`, ...)

`application.` will be sent to createApplication endpoint (please, do not use `application.application_type_id` otherwise you will rewrite user's selection.)

# Quick check-list

- [ ] Check API definition - [Sources API](https://github.com/RedHatInsights/sources-api/tree/master/db/seeds)
- [ ] Update [hardcoded schemas](https://github.com/RedHatInsights/sources-ui/blob/master/src/components/addSourceWizard/hardcodedSchemas.js)
  - [ ] Authtype is always selected
  - [ ] Users can switch between source/app types and the wizard should always work
  - [ ] Summary shows correct labels (see `aria-label`, otherwise the summary works automatically)
  - [ ] Custom components are tested (100% coverage)
- [ ] Integration with Sources UI
  - [ ] Wizard works, the source is successfully created with all needed values
  - [ ] Edit form works (should be automatic, otherwise there is a bug in the implementation)
  - [ ] Add application works (should be automatic, otherwise there is a bug in the implementation)
