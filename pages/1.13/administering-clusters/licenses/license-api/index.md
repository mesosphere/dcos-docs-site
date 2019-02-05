---
layout: layout.pug
navigationTitle:  License API
title: License API
menuWeight: 3
enterprise: true
excerpt: Using the License API to manage your DC/OS license
---
# Routes

Access to the License API is proxied through the Admin Router on each master node using the following route:

```
/licensing/v1
```

To determine the URL of your cluster, see [Cluster Access](/1.13/api/access/).

# Format

The License API request and response bodies are formatted in JSON.

Requests must include the accept header:

```
Accept: application/json
```

Responses include the content type header:

```
Content-Type: application/json
```

or

```
Content-Type: application/x-tar
```

# Authentication

All License API routes require authentication to use.

To authenticate API requests, see [Obtaining an authentication token](/1.13/security/ent/iam-api/#obtaining-an-authentication-token) and [Passing an authentication token](/1.13/security/ent/iam-api/#passing-an-authentication-token).

The License API also requires authorization via the following permissions:

| Resource ID | Action |
|-------------|--------|
| `dcos:adminrouter:licensing` | `full` |

All routes can also be reached by users with the `dcos:superuser` permission.

To assign permissions to your account, see the [permissions reference](/1.13/security/ent/perms-reference/).


# API reference

The License API allows you to manage license operations on your DC/OS cluster.

[swagger api='/1.12/api/dcos-licensing-component-spec.yaml']
