---
layout: layout.pug
navigationTitle:  Metrics API
title: Metrics API
menuWeight: 6
excerpt: Using the Metrics API
render: mustache
model: /1.14/data.yml
beta: false
---
You can use the Metrics API to periodically poll for data about your cluster, hosts, containers, and applications. The Metrics API is one way to get metrics from DC/OS. It is designed for occasional targeted access to specific tasks and hosts. It is not the best way to get a comprehensive picture of all metrics on DC/OS. It is recommended to use the [DC/OS Monitoring service](/services/dcos-monitoring/1.0.0/) to monitor all the metrics on your cluster.

The Metrics API is backed by [Telegraf](/1.14/overview/architecture/components/#telegraf), which runs on all nodes in the cluster.

To get started with the DC/OS metrics component and how to use the Metrics API, see the [Metrics Quick Start Guide](/1.14/metrics/quickstart/).


# Routes

Access to the Metrics API is proxied via Admin Router to each node. Statistics for the current leader are prefixed with:

```
/system/v1/metrics/v0/
```

<p class="message--important"><strong>IMPORTANT: </strong> /system/v1/metrics/v0/ is expected to 404 on masters.</p>

Statistics for an agent are prefixed with:

```
/system/v1/agent/{agent_id}/metrics/v0/
```

To determine the URL of your cluster, see [Cluster Access](/1.14/api/access/). The agent ID of a node is its Mesos ID.


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


# Authentication

All Metrics API routes require authentication to use.

To authenticate API requests, see [Obtaining an authentication token](/1.14/security/ent/iam-api/#obtaining-an-authentication-token) and [Passing an authentication token](/1.14/security/ent/iam-api/#passing-an-authentication-token) documentation. 

The Metrics API also requires authorization via the following permissions:

| Route | Permission |
|-------|----------|
| `/system/v1/metrics/v0/` | `dcos:adminrouter:ops:system-metrics` |
| `/system/v1/agent/{agent_id}/metrics/v0/` | `dcos:adminrouter:system:agent` |

All routes may also be reached by users with the `dcos:superuser` permission.

To assign permissions to your account, see the [permissions reference](/1.14/security/ent/perms-reference/) documentation.


# Resources

The following resources are available under both of the above routes:

[swagger api='/1.14/api/metrics.yaml']
