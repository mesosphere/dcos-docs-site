---
layout: layout.pug
navigationTitle:  Marathon API
title: Marathon API
menuWeight: 40
excerpt: Using the Marathon API to manage long-running containerized services

enterprise: true
---

The Marathon API allows you to manage long-running containerized services (apps and pods). The Marathon API is backed by the [Marathon component](/1.13/overview/architecture/components/#marathon), which runs on the master nodes. One of the Marathon instances is elected as leader, while the rest are hot backups in case of failure. All API requests must go through the Marathon leader. To enforce this, Admin Router proxies requests from any master node to the Marathon leader.

For more information about using Marathon, see [Deploying Services and Pods](/1.13/deploying-services/).

## Routes

Access to the Marathon API is proxied through Admin Router on each master node using the following route:

```
/service/marathon/
```

## Authentication

All Marathon API routes require authentication to use. To authenticate API requests, see [Obtaining an authentication token](/1.13/security/ent/iam-api/#obtaining-an-authentication-token) and [Passing an authentication token](/1.13/security/ent/iam-api/#passing-an-authentication-token). The Marathon API also requires authorization via the following permissions:

| Route | Permission |
|-------|----------|
| `/service/marathon/` | `dcos:adminrouter:service:marathon` |

All routes may also be reached by users with the `dcos:superuser` permission. To assign permissions to your account, see the [permissions reference](/1.13/security/ent/perms-reference/).

## Resources

[swagger api='/1.12/api/marathon.yaml']
