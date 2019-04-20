---
layout: layout.pug
navigationTitle:  Edge-LB API Reference
title: Edge-LB API Reference
menuWeight: 90
excerpt: Reference for all API endpoints exposed by the Edge-LB package

enterprise: false
---

The Edge-LB API enables users to create and manage pools of load balancers.

# Compatibility

The Edge-LB API was initially released alongside DC/OS 1.10.0 and requires DC/OS Enterprise 1.10.0 or later.

# API Versions

A new top level configuration field named `apiVersion` was introduced in Edge-LB v1.0.0. The two models are almost identical, with one important difference: `pool.haproxy.backends.servers` (in apiVersion `V1`) has been replaced with `pool.haproxy.backends.services`, with a more intuitive way to select services/backends for HAProxy.

The V1 and V2 specifications were merged into a single spec; however, there are still separate [v1](/pool-configuration/v1-examples/) and [v2](/pool-configuration/v2-examples/) docs for reference configs, pool examples, etc.

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

To assign permissions to your account, see [Assigning permissions](/1.12/security/ent/perms-reference/).

# API specification

The following resources are available:

[swagger api='/services/api/edge-lb.swagger-1.2.yaml']
