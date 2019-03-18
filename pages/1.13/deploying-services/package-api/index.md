---
layout: layout.pug
title: Package Management API
menuWeight: 10
excerpt: Installing DC/OS services using the Package Management API

enterprise: true
---

You can install DC/OS services by using the Package Management API. DC/OS services are installed from packages that are stored in a package registry, such as the [Mesosphere Universe](/1.13/overview/concepts/#mesosphere-universe).

The [DC/OS Package Manager (Cosmos) component](/1.13/overview/architecture/components/#dcos-package-manager) runs on all master nodes.

For information about managing package repositories, see [Managing Package Repositories](/1.13/administering-clusters/repo/).

For information about managing services, see [Deploying Services and Pods](/1.13/deploying-services/).


## Routes
Admin Router proxies three routes to the DC/OS Package Manager (Cosmos):

| Route | Resource |
|-------|----------|
| `/cosmos/service/` | `/service/` |
| `/package/` | `/package/` |
| `/capabilities` | `/capabilities` |


## Authentication

All Package Management API routes require authentication to use. To authenticate API requests, see [Obtaining an authentication token](/1.13/security/ent/iam-api/#obtaining-an-authentication-token) and [Passing an authentication token](/1.13/security/ent/iam-api/#passing-an-authentication-token). The Package Management API also requires authorization via the following permissions:

| Route | Permission |
|-------|----------|
| `/cosmos/service/` | `dcos:adminrouter:package` |
| `/package/` | `dcos:adminrouter:package` |
| `/capabilities` | `dcos:adminrouter:capabilities` |

All routes may also be reached by users with the `dcos:superuser` permission. To assign permissions to your account, see [Permissions Reference](/1.13/security/ent/perms-reference/).


## Resources

The following resources are available under both of the above routes:

[swagger api='/1.12/api/package-manager.yaml']
