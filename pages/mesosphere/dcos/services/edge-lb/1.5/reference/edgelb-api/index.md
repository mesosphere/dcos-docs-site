---
layout: layout.pug
navigationTitle: Edge-LB REST API reference
title: REST API reference
menuWeight: 83
excerpt: Provides reference for Edge-LB REST API endpoints
enterprise: true
---

The Edge-LB API enables users to create and manage pools of Edge-LB load balancers. There are two versions of the Edge-LB API, both of which are supported to enable backward compatibility. You can find reference information and examples in the [Pool Configuration Reference](/mesosphere/dcos/services/edge-lb/1.5/reference/pool-configuration-reference) section.

# Routes

Access to the Edge-LB API is proxied through the Admin Router on the master nodes using the following route by default:

```
/service/edgelb/
```

<p class="message--note"><strong>NOTE:  </strong>The path to Edge-LB endpoints might be different if you change the service name. For example, if you changed the default Edge-LB service name to append a geographic location, such as `edgelb-emea`, the path to the service would be `/service/edgelb-emea`.</p>

To determine the address of your cluster, see [Cluster Access](/mesosphere/dcos/2.0/api/access/).

# Authentication

All Edge-LB API routes require authentication to use. To authenticate API requests, see [Obtaining an authentication token](/mesosphere/dcos/2.0/security/ent/iam-api/#obtaining-an-authentication-token) and [Passing an authentication token](/mesosphere/dcos/2.0/security/ent/iam-api/#passing-an-authentication-token).

The Edge-LB API also requires authorization through the following permissions:

| Route | Permission |
|-------|----------|
| `/service/edgelb/` | `dcos:adminrouter:service:edge-lb` |

All routes may also be reached by users with the `dcos:superuser` permission. To assign permissions to your account, see [Assigning permissions](/mesosphere/dcos/2.0/security/ent/perms-reference/).

# API specification

The following resources are available:

***%%%which is the correct link for this specification?***

[swagger api='/mesosphere/dcos/services/api/edge-lb.swagger-1.5.yaml']

or previous graphic was:

[swagger api='/mesosphere/dcos/services/api/edge-lb-v2.yaml']
