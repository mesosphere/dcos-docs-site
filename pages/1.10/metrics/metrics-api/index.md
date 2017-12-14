---
layout: layout.pug
navigationTitle:  Metrics API
title: Metrics API
menuWeight: 1
excerpt: >
  You can use the Metrics API to
  periodically poll for data about your
  cluster, hosts, containers, and
  applications. You can then pass this
  data to a third party service of your
  choice to achieve informative charts,
  dashboards, and alerts.
preview: true
enterprise: true
---

You can use the Metrics API to periodically poll for data about your cluster, hosts, containers, and applications.
You can then pass this data to a third party service of your choice to achieve informative charts, dashboards, and alerts.

The Metrics API is backed by the [DC/OS Metrics component](/1.10/overview/architecture/components/#dcos-metrics), which runs on all nodes in the cluster.

For examples of how to use the Metrics API, see the [Metrics Quick Start Guide](/1.10/metrics/quickstart/).


# Routes

Access to the Metrics API is proxied through the Admin Router on each node using the following route:

```
/system/v1/metrics/v0/
```

Access to the Metrics API of the agent nodes is also proxied through the master nodes:

```
/system/v1/agent/{agent_id}/metrics/v0/
```

To determine the URL of your cluster, see [Cluster Access](/1.10/api/access/).


# Format

The Metrics API request and response bodies are formatted in JSON.

Requests must include the accept header:

```
Accept: application/json
```

Responses will include the content type header:

```
Content-Type: application/json
```


# Auth

All Metrics API routes require authentication to use.

To authenticate API requests, see [Obtaining an authentication token](/1.10/security/ent/iam-api/#obtaining-an-authentication-token) and [Passing an authentication token](/1.10/security/ent/iam-api/#passing-an-authentication-token).

The Metrics API also requires authorization via the following permissions:

| Route | Permission |
|-------|----------|
| `/system/v1/metrics/v0/` | `dcos:adminrouter:ops:system-metrics` |
| `/system/v1/agent/{agent_id}/metrics/v0/` | `dcos:adminrouter:system:agent` |

All routes may also be reached by users with the `dcos:superuser` permission.

To assign permissions to your account, see the [permissions reference](/1.10/security/ent/perms-reference/).


# Resources

The following resources are available under both of the above routes:

[swagger api='/1.10/api/metrics.yaml']
