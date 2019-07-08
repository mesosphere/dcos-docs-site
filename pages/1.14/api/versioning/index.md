---
layout: layout.pug
navigationTitle:  API Versioning
title: API Versioning
menuWeight: 2
excerpt: Understanding component, resource, and route versioning
enterprise: false
render: mustache
model: /1.14/data.yml
---

The DC/OS API is backed by many loosely coupled components; some are standalone projects and others are designed exclusively for DC/OS. Because of this, a variety of versioning mechanisms are supported: component, route, and resource versioning.

To learn how to formulate a specific API call, see the component API reference documentation for that route.

# Component Versioning

Components with their own open source communities, like Mesos, Marathon, and Mesos DNS, have routes that are based on their well known component name. These routes delegate versioning to the backend component service.

For example, the [Marathon component](/1.14/overview/architecture/components/#marathon) serves the [Marathon API](/1.14/deploying-services/marathon-api/) under the route `/service/marathon` and one of its resource paths is `/v2/apps`, so the full path to that resource is `/service/marathon/v2/apps`.

# Route Versioning

Components that have been specifically designed for DC/OS generally follow another versioning pattern, where the name of the component is less important than the name of the feature set. These routes often include a version to make it easier to support renaming or replacing components over time.

For example, the [DC/OS Diagnostics component](/1.14/overview/architecture/components/#dcos-diagnostics) serves the [System Health API](/1.14/monitoring/#system-health-http-api-endpoint) under the route `/system/health/v1` and one of its resource paths is `/report`, so the full path to that resource is `/system/health/v1/report`.

# Resource Versioning

Some components avoid path versioning altogether and use content negotiation at the resource level to simultaneously support multiple versions of an API at the same path.

For example, the [DC/OS Package Manager (Cosmos) component](/1.14/overview/architecture/components/#dcos-package-manager) serves the [Package API](/1.14/deploying-services/package-api/) under the route `/package` and one of its resource paths is `/list`, so the full path to that resource is `/package/list`. The version of the request and desired version of the response are specified respectively by the `Content-Type` and `Accept` HTTP headers:

```
Content-Type: application/vnd.dcos.package.list-request+json;charset=utf-8;version=v1
Accept:       application/vnd.dcos.package.list-response+json;charset=utf-8;version=v1
```
