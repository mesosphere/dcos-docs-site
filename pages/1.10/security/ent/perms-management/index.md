---
layout: layout.pug
navigationTitle: Permissions Management
title: Permissions Management
menuWeight: 30
excerpt:

enterprise: true
---


The DC/OS Identity and Access Management system is designed to protect resources via fine-grained authorization.
Each protected resource has one associated ACL that declares which principals may perform which actions on a named resource.
This is performed according to the whitelisting (deny-by-default) model.

Permissions can be applied to users and groups using either the DC/OS GUI, the [IAM HTTP API](/1.10/security/ent/iam-api/) or the [DC/OS Enterprise CLI](/1.10/cli/enterprise-cli/).
Each interface provides a way to manage Access Control Entries (ACEs).
Each ACE includes the following pieces of information:

* A principal identifier.
* A resource identifier.
* An action identifier.

These three pieces of information are strings.

Action identifiers must be chosen from a fixed set of actions.
The available action identifiers are `create`, `read`, `update`, `delete`, and `full`.
By convention, `full` indicates that the permission supports all other action identifiers.
`full` may include actions not supported by any other action identifier.

There are four commands used for managing permissions with the DC/OS Enterprise CLI.

To manage permissions for groups with the DC/OS Enterprise CLI, use the following commands:

* `dcos security org groups grant [OPTIONS] GID RID ACTION`
* `dcos security org groups revoke [OPTIONS] GID RID ACTION`

To manage permissions for users with the DC/OS Enterprise CLI, use the following commands:

* `dcos security org users grant [OPTIONS] UID RID ACTION`
* `dcos security org users revoke [OPTIONS] UID RID ACTION`
