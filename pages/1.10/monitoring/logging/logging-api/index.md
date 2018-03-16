---
layout: layout.pug
navigationTitle:  Logging API
title: Logging API
menuWeight: 3
excerpt:
preview: true
enterprise: false
---

The Logging API exposes node, component, and container (task) logs.

The Logging API is backed by the [DC/OS Log component](/1.10/overview/architecture/components/#dcos-log), which runs on all nodes in the cluster.

For more information about using the Logging API, see [Logging](/1.10/monitoring/logging/).

For usage examples, see [Logging API Examples](/1.10/monitoring/logging/logging-api-examples/).


# Compatibility

The Logging API was added in DC/OS 1.9.0. Prior to DC/OS 1.9.0, all node, component, and container logs were managed by Logrotate.

In DC/OS 1.9.0 and later, node and component logs are managed by journald. However, the [Mesos task journald log sink was disabled](https://github.com/dcos/dcos/pull/1269) due to [journald performance issues](https://github.com/systemd/systemd/issues/5102). So container log files are still accessible via the [Mesos task sandbox files API](http://mesos.apache.org/documentation/latest/sandbox/).


# Routes

Access to the Logging API is proxied through the Admin Router on each node using the following route:

```
/system/v1/logs/v1/
```

Access to the Logging API of the agent nodes is also proxied through the master nodes:

```
/system/v1/agent/{agent_id}/logs/v1/
```

To determine the address of your cluster, see [Cluster Access](/1.10/api/access/).


# Format

The API request header can be any the following:

- `text/plain`, `text/html`, `*/*` request logs in text format, ending with `\n`.
- `application/json` request logs in JSON format.
- `text/event-stream` request logs in Server-Sent-Events format.


# Auth

All Logging API routes require authentication to use.

To authenticate API requests, see [Obtaining an authentication token](/1.10/security/ent/iam-api/#obtaining-an-authentication-token) and [Passing an authentication token](/1.10/security/ent/iam-api/#passing-an-authentication-token).

The Logging API also requires authorization via the following permissions:

| Route | Permission |
|-------|----------|
| `/system/v1/logs/v0/` | `dcos:adminrouter:ops:system-logs` |
| `/system/v1/agent/{agent_id}/logs/v0/` | `dcos:adminrouter:system:agent` |

All routes may also be reached by users with the `dcos:superuser` permission.

To assign permissions to your account, see [Permissions Reference](/1.10/security/ent/perms-reference/).


# Resources

The following resources are available under both of the above routes:

[swagger api='/1.10/api/logs.yaml']
