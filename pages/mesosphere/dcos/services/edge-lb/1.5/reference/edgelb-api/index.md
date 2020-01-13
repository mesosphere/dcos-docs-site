---
layout: layout.pug
navigationTitle: Edge-LB REST API reference
title: REST API reference
menuWeight: 83
excerpt: Provides reference for Edge-LB REST API endpoints
enterprise: true
---

The Edge-LB API enables users to create and manage pools of Edge-LB load balancers. There are two versions of the Edge-LB API. The two models are almost identical, with one important difference: the `pool.haproxy.backends.servers` configuration setting was replaced with [`pool.haproxy.backend.service`](/mesosphere/dcos/services/edge-lb/1.5/reference/pool-configuration-reference/#poolhaproxybackendservice) in the Edge-LB API. This change provides a more intuitive way to select services and backends for HAProxy. In addition, the Edge-LB API includes a top-level `apiVersion` configuration field to specify which version of an API call you want to use.

Because of the similarity between the Edge-LB API version 1 (`V1`) and version 2 (`V2`), the configuration reference information and examples reflect the Edge-LB API V2 specification. If you require documentation specifically for the Edge-LB API V1 specification, see [Edge-LB API v1](/mesosphere/dcos/services/edge-lb/1.5/reference/v1-reference/#api-v1).  ***%%% this info is missing and will have to be restored from the original ELB 15...***

# Routes

Access to the Edge-LB API is proxied through the Admin Router on the master nodes using the following route by default:

```
/service/edgelb/
```

Note that the path to Edge-LB endpoints might be different if you change the service name. For example, if you changed the default Edge-LB service name to append a geographic location, such as `edgelb-emea`, the path to the service would be `/service/edgelb-emea`.

To determine the address of your cluster, see [Cluster Access](/mesosphere/dcos/2.0/api/access/).

# Authentication
All Edge-LB API routes require authentication to use.

To authenticate API requests, see [Obtaining an authentication token](/mesosphere/dcos/2.0/security/ent/iam-api/#obtaining-an-authentication-token) and [Passing an authentication token](/mesosphere/dcos/2.0/security/ent/iam-api/#passing-an-authentication-token).

The Edge-LB API also requires authorization through the following permissions:

| Route | Permission |
|-------|----------|
| `/service/edgelb/` | `dcos:adminrouter:service:edge-lb` |

All routes may also be reached by users with the `dcos:superuser` permission.

To assign permissions to your account, see [Assigning permissions](/mesosphere/dcos/2.0/security/ent/perms-reference/).

# API specification

The following resources are available:

[swagger api='/mesosphere/dcos/services/api/edge-lb-v2.yaml']
