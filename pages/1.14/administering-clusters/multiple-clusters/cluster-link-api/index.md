---
layout: layout.pug
navigationTitle:  Cluster Link API
title: Cluster Link API
menuWeight: 3
excerpt: Managing cluster links with the Cluster Link API
enterprise: true
render: mustache
model: /mesosphere/dcos/1.14/data.yml
---

You can use the Cluster Link API to manage cluster links.

# Routes

Access to the Cluster Link API is proxied through the Admin Router on each master node using the following route:

```
/cluster/v1/links
```

To determine the URL of your cluster, see [Cluster Access](/mesosphere/dcos/1.14/api/access/).

# Format

The Cluster Link API request and response bodies are formatted in JSON.

Requests must include the accept header:

```
Accept: application/json
```

Responses include the content type header:

```
Content-Type: application/json
```

# Authentication

All Cluster Link API routes require authentication to use.

To authenticate API requests, see [Obtaining an authentication token](/mesosphere/dcos/1.14/security/ent/iam-api/#obtaining-an-authentication-token) and [Passing an authentication token](/mesosphere/dcos/1.14/security/ent/iam-api/#passing-an-authentication-token).

The Cluster Link API also requires authorization via the following permissions:

| Resource ID | Action |
|-------------|--------|
| `dcos:adminrouter:ops:cluster-link` | `full` |

All routes can also be reached by users with the `dcos:superuser` permission.

To assign permissions to your account, see the [permissions reference](/mesosphere/dcos/1.14/security/ent/perms-reference/).


# API Reference

The Cluster Link API allows you to manage cluster link operations on your DC/OS cluster.

[swagger api='/mesosphere/dcos/1.14/api/cluster-link.yaml']
