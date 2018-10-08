---
layout: layout.pug
navigationTitle:  V1 API Reference
title: V1 API Reference
menuWeight: 80
excerpt: Endpoints exposed in the V1 API

enterprise: false
---


The Edge-LB API enables you to create and manage pools of load balancers.

# Compatibility

The Edge-LB API was initially released alongside DC/OS 1.10.0 and requires DC/OS Enterprise 1.10.0 or later.

# Routes

Access to the Edge-LB API is proxied through the Admin Router on the master nodes using the following route:

```
/service/edgelb/
```

To determine the address of your cluster, see [Cluster Access](/1.10/api/access/).

# Format

The API request header can be any the following:

- `application/json` request logs in JSON format.
- `application/x-yaml` request logs in YAML format.

# Auth

All Edge-LB API routes require authentication to use.

To authenticate API requests, see [Obtaining an authentication token](/1.10/security/ent/iam-api/#obtaining-an-authentication-token) and [Passing an authentication token](1.10/security/ent/iam-api/#passing-an-authentication-token).

The Edge-LB API also requires authorization via the following permissions:

| Route | Permission |
|-------|----------|
| `/service/edgelb/` | `dcos:adminrouter:service:edgelb` |

All routes may also be reached by users with the `dcos:superuser` permission.

To assign permissions to your account, see [Assigning permissions](/1.10/security/ent/perms-reference/).

# Resources

The following resources are available under both of the above routes:

[swagger api='/services/api/edge-lb-v1.yaml']
