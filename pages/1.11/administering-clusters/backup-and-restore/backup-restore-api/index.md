---
layout: layout.pug
navigationTitle:  Backup and Restore API
title: Backup and Restore API
menuWeight: 10
excerpt: Backing up and restoring your cluster using the API

enterprise: true
---

You can use the Backup and Restore API to create and restore backups of your cluster.

<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>Important:</strong> See the <a href="/1.11/administering-clusters/backup-and-restore/#limitations">Limitations</a> of backup and restore.</td> 
</tr> 
</table>

# Routes

Access to the Backup and Restore API is proxied through the Admin Router on each master node using the following route:

```
/system/v1/backup/v1
```

To determine the URL of your cluster, see [Cluster Access](/1.11/api/access/).

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

To authenticate API requests, see [Obtaining an authentication token](/1.11/security/ent/iam-api/#obtaining-an-authentication-token) and [Passing an authentication token](/1.11/security/ent/iam-api/#passing-an-authentication-token).

The Backup and Restore API also requires authorization via the following permissions:

| Resource ID | Action |
|-------------|--------|
| `dcos:adminrouter:ops:system-backup` | `full` |

All routes can also be reached by users with the `dcos:superuser` permission.

To assign permissions to your account, see the [permissions reference](/1.11/security/ent/perms-reference/).


# API reference

The Backup and Restore API allows you to manage backup and restore operations on your DC/OS cluster.

[swagger api='/1.11/api/backup-restore.yaml']
