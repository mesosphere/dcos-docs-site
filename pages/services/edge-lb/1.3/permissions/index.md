---
layout: layout.pug
navigationTitle: Permissions
title: Permissions
menuWeight: 50
excerpt: Service account and user permissions required to use the Edge-LB package

enterprise: false
---


Due to the fact that Edge-LB is installed as a DC/OS service, not as a built-in component, superuser permissions (`dcos:superuser`) or the user or group permissions listed below are required to use Edge-LB.

# Permission Considerations

- Superuser permissions allow a user to manage all Edge-LB pools. Use this option if you do not need to configure fine-grained access.
- Grant a user or group the permissions below for finer grained access to the Edge-LB pools. Using this method, you can restrict service accounts to have access to pools you specify.

# Install Permissions

In order to install Edge-LB, the user must have the following permissions:

- `dcos:adminrouter:package`
- `dcos:adminrouter:service:edgelb`
- `dcos:adminrouter:service:marathon`
- `dcos:service:marathon:marathon:services:/dcos-edgelb`

# Service Account Permissions

In order for Edge-LB to operate, it must be configured to use a [service account](/services/edge-lb/1.2/installing/#create-a-service-account/).

For easier administration, add the service account principal to the `superusers` group.

Or, if you prefer to grant only the individual permissions necessary, grant the following permissions to the service account principal:

- `dcos:adminrouter:service:marathon`
- `dcos:adminrouter:package`
- `dcos:adminrouter:service:edgelb`
- `dcos:service:marathon:marathon:services:/dcos-edgelb`
- `dcos:mesos:master:endpoint:path:/api/v1`
- `dcos:mesos:master:endpoint:path:/api/v1/scheduler`
- `dcos:mesos:master:framework:principal:edge-lb-principal`
- `dcos:mesos:master:framework:role`
- `dcos:mesos:master:reservation:principal:edge-lb-principal`
- `dcos:mesos:master:reservation:role`
- `dcos:mesos:master:volume:principal:edge-lb-principal`
- `dcos:mesos:master:volume:role`
- `dcos:mesos:master:task:user:root`
- `dcos:mesos:master:task:app_id`

Additionally, this permission must be granted **for each Edge-LB pool created**:

- `dcos:adminrouter:service:dcos-edgelb/pools/<POOL-NAME>`

# Multitenant Usage Permissions

To grant limited permission to manage only a single Edge-LB pool, the user must have the following permissions:

- `dcos:adminrouter:package`
- `dcos:adminrouter:service:marathon`
- `dcos:adminrouter:service:dcos-edgelb/pools/<POOL-NAME>`
- `dcos:service:marathon:marathon:services:/dcos-edgelb/pools/<POOL-NAME>`

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
