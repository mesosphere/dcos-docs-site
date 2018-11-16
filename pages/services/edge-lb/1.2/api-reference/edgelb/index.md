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

<p class="message--note"><strong>NOTE: </strong>Edge-LB 1.0 and later supports both the <tt>V1</tt> and <tt>V2</tt> API for backwards compatibility. Therefore clients that were written against Edge-LB versions prior to Edge-LB 1.0 should work without any modifications with Edge-LB 1.0 and later. New setups should use API <tt>V2</tt> as at some point <tt>V1</tt> is going to be deprecated and then removed.</p>

<p class="message--note"><strong>NOTE: </strong> The <tt>apiVersion</tt> field in the pool definition defaults to <tt>V2</tt> if it was not provided. Hence, in order to use the <tt>V1</tt> config, you must explicitly set the <tt>pool.apiVersion</tt> to `"V1"`.</p>

# Routes

Access to the Edge-LB API is proxied through the Admin Router on the master nodes using the following route:

```
/service/edge-lb/
```

To determine the address of your cluster, see [Cluster Access](/1.11/api/access/).

# Auth

All Edge-LB API routes require authentication to use.

To authenticate API requests, see [Obtaining an authentication token](/1.10/security/ent/iam-api/#obtaining-an-authentication-token) and [Passing an authentication token](1.11/security/ent/iam-api/#passing-an-authentication-token).

The Edge-LB API also requires authorization via the following permissions:

| Route | Permission |
|-------|----------|
| `/service/edgelb/` | `dcos:adminrouter:service:edge-lb` |

All routes may also be reached by users with the `dcos:superuser` permission.

To assign permissions to your account, see [Assigning permissions](/1.11/security/ent/perms-reference/).

# API specification

The following resources are available:

[swagger api='/services/api/edge-lb.swagger.yaml']
