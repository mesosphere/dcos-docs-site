---
layout: layout.pug
navigationTitle:  V2 API Reference
title: V2 API Reference
menuWeight: 85
excerpt:

enterprise: false
---

Endpoints exposed in the V2 API.

The Edge-LB API enables users to create and manage pools of load balancers.

# Compatibility

The Edge-LB API was initially released alongside DC/OS 1.10.0 and requires DC/OS Enterprise 1.10.0 or newer.

# Routes

Access to the Edge-LB API is proxied through the Admin Router on the master nodes using the following route:

```
/services/edge-lb/
```

To determine the address of your cluster, see [Cluster Access](/1.10/api/access/).

# Format

The API request header can be any the following:

- `application/json` request logs in JSON format.
- `application/x-yaml` request logs in YAML format.

# Auth

All Edge-LB API routes require authentication to use.

To authenticate API requests, see [Obtaining an authentication token](/1.10/security/iam-api/#obtaining-an-authentication-token) and [Passing an authentication token](/1.10/security/iam-api/#passing-an-authentication-token).

The Edge-LB API also requires authorization via the following permissions:

| Route | Permission |
|-------|----------|
| `/services/edge-lb/` | `dcos:adminrouter:service:edge-lb` |

All routes may also be reached by users with the `dcos:superuser` permission.

To assign permissions to your account, see [Assigning permissions](/1.10/security/perms-reference/).

# Common Resources

These base level routes were added along with V2 and can be used to read data from V1 or V2 pool configurations.

[swagger api='/services/api/edge-lb-common.yaml']

# V2 Resources

The following resources are available under both of the above routes:

[swagger api='/services/api/edge-lb-v2.yaml']
