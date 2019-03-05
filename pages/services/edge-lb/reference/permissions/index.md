---
layout: layout.pug
navigationTitle: Permissions
title: Permissions
menuWeight: 81
excerpt: Service account and user permissions required to use the Edge-LB package
enterprise: true
---

Because Edge-LB is installed as a DC/OS service, not as a built-in component, you must grant either `superuser` permissions (`dcos:superuser`) or the specific user or group permissions listed in this section to perform administrative tasks when you are running Edge-LB.

In general, you use the DC/OS Enterprise command-line interface to view and modify cluster-related permissions. For information about installing the DC/OS Enterprise command-line interface (CLI) and plug-ins, see [CLI plug-ins](/1.13/cli/plugins/). For more information about how to set and manage permissions, see [managing permissions](/1.13/security/ent/perms-management/) and the DC/OS [permissions reference](/1.13/security/ent/perms-management/).

# General permission requirements

- Superuser permissions allow a user to manage all Edge-LB pools. Use this option if you do not need to configure fine-grained access.
- Grant a user or group the permissions below for finer grained access to the Edge-LB pools. Using this method, you can restrict service accounts to have access to pools you specify.

# Installation permissions

The following permission are required for the user or service account you use to install Edge-LB packages:

- `dcos:adminrouter:package`
- `dcos:adminrouter:service:edgelb`
- `dcos:adminrouter:service:marathon`
- `dcos:service:marathon:marathon:services:/dcos-edgelb`

You can add the permissions required for installation to an account by running a command similar to this:
`dcos security org users grant [OPTIONS] UID RID ACTION`

For example, to grant installation permissions to the user account `patsmith`:
`dcos security org users grant patsmith dcos:adminrouter:package full`

# Service account permissions

The [service account](/services/edge-lb/1.2/installing/#create-a-service-account/) used for Edge-LB operations must be configured with sufficient administrative permissions. For simplicity, you can add the service account principal to the `superusers` group. However, if you are using the principle of least privilege to secure administrative activity for the cluster, you can grant the specific individual permissions necessary. 

If you are using the principle of least privilege, follow the steps for creating a public/private key pair and a service account principal described in [preparing a service account](/services/edge-lb/how-to-tasks/installing), then grant the following permissions to the service account principal:

- `dcos:adminrouter:ops:ca:rw full`
- `dcos:adminrouter:ops:ca:ro full`
- `dcos:adminrouter:service:marathon`
- `dcos:adminrouter:package`
- `dcos:adminrouter:service:edgelb`
- `dcos:service:marathon:marathon:services:/dcos-edgelb full`
- `dcos:mesos:master:endpoint:path:/api/v1 full`
- `dcos:mesos:master:endpoint:path:/api/v1/scheduler full`
- `dcos:mesos:master:framework:principal:edge-lb-principal full`
- `dcos:mesos:master:framework:role full`
- `dcos:mesos:master:reservation:principal:edge-lb-principal full`
- `dcos:mesos:master:reservation:role full`
- `dcos:mesos:master:volume:principal:edge-lb-principal full`
- `dcos:mesos:master:volume:role full`
- `dcos:mesos:master:task:user:root full`
- `dcos:mesos:master:task:app_id full`

- `dcos:secrets:default:/dcos-edgelb/* full`
- `dcos:secrets:list:default:/dcos-edgelb/* full`

Additionally, grant the following permission **for each Edge-LB pool created**:

- `dcos:adminrouter:service:dcos-edgelb/pools/<POOL-NAME>`

## Adding specific permissions for a service principal
You can add the permissions required for the service account by running a command similar to this:
`dcos security org users grant [OPTIONS] UID RID ACTION`

For example, to grant the Edge-LB service account permissions to the `edge-lb-principal` service principal:
`dcos security org users grant edge-lb-principal dcos:adminrouter:service:marathon full`

## Adding a service principal account to the superusers group
If you are not using the least-privilege security model, you can add the Edge-LB service account to the `superusers` group to simplify adding and updating permissions. For example, you can аdd the `edge-lb-principal` service account to the `superusers` group by running a command similar to this:
`dcos security org groups add_user superusers edge-lb-principal`

# Multi-tenant permissions

To grant limited permissions to manage only a single Edge-LB pool, the user must have the following permissions:

- `dcos:adminrouter:package`
- `dcos:adminrouter:service:marathon`
- `dcos:adminrouter:service:dcos-edgelb/pools/<POOL-NAME>`
- `dcos:service:marathon:marathon:services:/dcos-edgelb/pools/<POOL-NAME>`

You can add the permissions required for managing a pool in a multi-tenant environment to an account by running a command similar to this:
`dcos security org users grant [OPTIONS] UID RID ACTION`

For example, to grant the permissions for single pool management in a multi-tenant environment to the `sf-tenant-08` account:
`dcos security org users grant sf-tenant-08 dcos:adminrouter:service:edgelb:/ping full`

# Task-specific endpoint permissions
The following permissions for endpoints are used by the `dcos edgelb` CLI subcommand. Permissions can be granted individually:

- Ping:
    - `dcos:adminrouter:service:edgelb:/ping`
- List Pools:
    - `dcos:adminrouter:service:edgelb:/config`
- Read Pool:
    - `dcos:adminrouter:service:edgelb:/pools/<POOL-NAME>`
- Create V1 Pool:
    - `dcos:adminrouter:service:edgelb:/v1/loadbalancers`
- Update V1 Pool:
    - `dcos:adminrouter:service:edgelb:/v1/loadbalancers/<POOL-NAME>`
    - `dcos:service:marathon:marathon:services:/dcos-edgelb/pools/<POOL-NAME>`
- Create V2 Pool:
    - `dcos:adminrouter:service:edgelb:/v2/pools`
- Update V2 Pool:
    - `dcos:adminrouter:service:edgelb:/v2/pools/<POOL-NAME>`
    - `dcos:service:marathon:marathon:services:/dcos-edgelb/pools/<POOL-NAME>`
- Delete Pool
    - `dcos:adminrouter:service:edgelb:/v2/pools/<POOL-NAME>`
