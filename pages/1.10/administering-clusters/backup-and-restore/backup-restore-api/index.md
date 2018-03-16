---
layout: layout.pug
navigationTitle:  Backup and Restore API
title: Backup and Restore API
menuWeight: 10
excerpt:

enterprise: true
---

You can use the Backup and Restore API to create and restore backups of your cluster. 

**Important:** See the [Limitations](/1.10/administering-clusters/backup-and-restore/#limitations) of backup and restore.

# Routes

Access to the Backup and Restore API is proxied through the Admin Router on each master node using the following route:

```
/system/v1/backup/v1
```

To determine the URL of your cluster, see [Cluster Access](/1.10/api/access/).

# Format

The Backup and Restore API request and response bodies are formatted in JSON.

Requests must include the accept header:

```
Accept: application/json
```

Responses include the content type header:

```
Content-Type: application/json
```

# Authentication

All Backup and Restore API routes require authentication to use.

To authenticate API requests, see [Obtaining an authentication token](/1.10/security/ent/iam-api/#obtaining-an-authentication-token) and [Passing an authentication token](/1.10/security/ent/iam-api/#passing-an-authentication-token).

The Backup and Restore API also requires authorization via the following permissions:

| Resource ID | Action |
|-------------|--------|
| `dcos:adminrouter:ops:system-backup` | `full` |

All routes can also be reached by users with the `dcos:superuser` permission.

To assign permissions to your account, see the [permissions reference](/1.10/security/ent/perms-reference/).


# API Reference

The Backup and Restore API allows you to manage backup and restore operations on your DC/OS cluster.

[swagger api='/1.10/api/backup-restore.yaml']
