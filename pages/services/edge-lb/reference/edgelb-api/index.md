---
layout: layout.pug
navigationTitle: Edge-LB REST API reference
title: REST API reference
menuWeight: 83
excerpt: Provides reference for Edge-LB REST API endpoints
enterprise: true
---

The Edge-LB API enables users to create and manage pools of Edge-LB load balancers. There are two versions of the Edge-LB API. The two models are almost identical, with one important difference: the `pool.haproxy.backends.servers` configuration setting has been replaced with [`pool.haproxy.backends.services`](/services/edge-lb/api-reference/pool-configuration-reference/#pool.haproxy.backends.services) in the latest version of the Edge-LB API. This change provides a more intuitive way to select services and backends for HAProxy. In addition, the Edge-LB API includes a top-level `apiVersion` configuration field to specify which version of an API call you want to use. 

Because of the similarity between the Edge-LB API version 1 (`V1`) and version 2 (`V2`), the configuration reference information and examples reflect the Edge-LB API V2 specification. If you require documentation specifically for the Edge-LB API V1 specification, see [Edge-LB API v1](/services/edge-lb/reference/v1-reference/#api-v1).

# Routes

Access to the Edge-LB API is proxied through the Admin Router on the master nodes using the following route:

```
/service/edge-lb/
```

To determine the address of your cluster, see [Cluster Access](/1.11/api/access/).

# Auth

All Edge-LB API routes require authentication to use.

To authenticate API requests, see [Obtaining an authentication token](/1.12/security/ent/iam-api/#obtaining-an-authentication-token) and [Passing an authentication token](1.12/security/ent/iam-api/#passing-an-authentication-token).

The Edge-LB API also requires authorization via the following permissions:

| Route | Permission |
|-------|----------|
| `/service/edgelb/` | `dcos:adminrouter:service:edge-lb` |

All routes may also be reached by users with the `dcos:superuser` permission.

To assign permissions to your account, see [Assigning permissions](/1.13/security/ent/perms-reference/).

# API specification

The following resources are available:

[swagger api='/services/api/edge-lb-v2.yaml']
