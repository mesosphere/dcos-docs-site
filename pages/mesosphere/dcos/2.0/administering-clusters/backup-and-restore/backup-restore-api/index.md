---
layout: layout.pug
navigationTitle:  Backup and Restore API
title: Backup and Restore API
menuWeight: 10
excerpt: Backing up and restoring your cluster using the API
enterprise: true
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

You can use the Backup and Restore API to create and restore backups of your cluster.

<p class="message--important"><strong>IMPORTANT: </strong>See the <a href="/mesosphere/dcos/latest/administering-clusters/backup-and-restore/#limitations">Limitations</a> section.</p>


# Routes

Access to the Backup and Restore API is proxied through Admin Router on each master node, using the following route:

```
/system/v1/backup/v1
```

To determine the URL of your cluster, see [Cluster Access](/mesosphere/dcos/latest/api/access/).

# Format

The Backup and Restore API request and response bodies are formatted in JSON. Requests must include the `accept` header:

```
Accept: application/json
```

Responses include the `content type` header:

```
Content-Type: application/json
```

# Authentication

All Backup and Restore API routes require authentication to use.

To authenticate API requests, see [Obtaining an authentication token](/mesosphere/dcos/latest/security/ent/iam-api/#obtaining-an-authentication-token) and [Passing an authentication token](/mesosphere/dcos/latest/security/ent/iam-api/#passing-an-authentication-token).

The Backup and Restore API also requires authorization via the following permissions:

| Resource ID | Action |
|-------------|--------|
| `dcos:adminrouter:ops:system-backup` | `full` |

All routes can also be reached by users with the `dcos:superuser` permission.

To assign permissions to your account, see the [permissions reference](/mesosphere/dcos/latest/security/ent/perms-reference/).


# API reference

The Backup and Restore API allows you to manage backup and restore operations on your DC/OS cluster.

[swagger api='/mesosphere/dcos/2.0/api/backup-restore.yaml']
