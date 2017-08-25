---
layout: layout.pug
title: DC/OS Package Management API
menuWeight: 10
excerpt: ""
featureMaturity: ""
enterprise: 'yes'
navigationTitle:  DC/OS Package Management API
---

You can install DC/OS services by using the Package Management API. DC/OS services are installed from packages that are stored in a package registry, such as the [Mesosphere Universe](/1.9/overview/concepts/#mesosphere-universe).

The [DC/OS Package Manager (Cosmos) component](/1.9/overview/architecture/components/#dcos-package-manager) runs on all master nodes.

For information about managing package repositories, see [Managing Package Repositories](/1.9/administering-clusters/repo/).

For information about managing services, see [Managing Services](/1.9/deploying-services/).


## Routes
s

| Route | Resource |
navigationTitle:  DC/OS Package Management API
|-------|----------|
| `/cosmos/service/` | `/service/` |
| `/package/` | `/package/` |
| `/capabilities` | `/capabilities` |


## Auth

All Package Management API routes require authentication to use.

To authenticate API requests, see [Obtaining an authentication token](/1.9/security/iam-api/#obtaining-an-authentication-token) and [Passing an authentication token](/1.9/security/iam-api/#passing-an-authentication-token).

The Package Management API also requires authorization via the following permissions:

| Route | Permission |
navigationTitle:  DC/OS Package Management API
|-------|----------|
| `/cosmos/service/` | `dcos:adminrouter:package` |
| `/package/` | `dcos:adminrouter:package` |
| `/capabilities` | `dcos:adminrouter:capabilities` |

All routes may also be reached by users with the `dcos:superuser` permission.

To assign permissions to your account, see [Assigning permissions](/1.9/security/perms-reference/).


## Resources

The following resources are available under both of the above routes:

[api-explorer api='/1.9/api/package-manager.yaml']
