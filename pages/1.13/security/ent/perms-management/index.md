---
layout: layout.pug
navigationTitle: Permissions Management
title: Permissions Management
menuWeight: 30
excerpt: Managing permissions

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


The DC/OS Identity and Access Management system is designed to protect resources via fine-grained authorization.
Each protected resource has one associated ACL that declares which principals may perform which actions on a named resource. This is performed according to the whitelisting (deny-by-default) model.

Permissions can be applied to users and groups using either the DC/OS web interface, the [IAM HTTP API](/1.13/security/ent/iam-api/) or the [DC/OS Enterprise CLI](/1.13/cli/enterprise-cli/). Each interface provides a way to manage Access Control Entries (ACEs). Each ACE includes the following pieces of information:

* A principal identifier
* A resource identifier
* An action identifier

These three pieces of information are strings.

Action identifiers must be chosen from a fixed set of actions. The available action identifiers are `create`, `read`, `update`, `delete`, and `full`. By convention, `full` indicates that the permission supports all other action identifiers. The identifier `full` may include actions not supported by any other action identifier.

### Managing permissions from the CLI

There are [four commands](/1.13/cli/command-reference/dcos-security/#dcos-security-org) used for managing permissions from the DC/OS Enterprise CLI.

To manage permissions for **groups** from the DC/OS Enterprise CLI, use the following commands:

* `dcos security org groups grant [OPTIONS] GID RID ACTION`
* `dcos security org groups revoke [OPTIONS] GID RID ACTION`

To manage permissions for **users** from the DC/OS Enterprise CLI, use the following commands:

* `dcos security org users grant [OPTIONS] UID RID ACTION`
* `dcos security org users revoke [OPTIONS] UID RID ACTION`

### Managing permissions using the API

The [IAM HTTP API](/1.13/security/ent/iam-api/) provides operations to manage permissions for users and groups.

Note that all entities must exist when creating a permission.

A typical pattern to create a permission is:

1. call `PUT /acls/{rid}` to create the access control list for the protected resource `{rid}`, ignoring any returned `409` status code (that indicates that it already exists); then
1. call `PUT /acls/{rid}/users/{uid}/{action}`  or `PUT /acls/{rid}/groups/{gid}/{action}` to create the specific user or group access control entry.
