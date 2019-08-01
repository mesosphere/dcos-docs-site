---
layout: layout.pug
navigationTitle: Preparing to use quotas
title: Preparing to use quotas
menuWeight: 5
render: mustache
model: /1.14/data.yml
excerpt: Preparing to use groups and quotas for multi-tenancy
---
Groups enable you to use logical collections to allocate and restrict resource consumption for a specific team, project, or Line of Business.

You can define a **quota** to specify the maximum resources that the services in a group can use.
Once the limit is reached, no new services or scaling up of existing services is allowed.

# Quotas and roles

Quota in DC/OS is built on top of the [Quota Limits](https://mesos.apache.org/documentation/latest/quota/) primitive in Apache Mesos.
Specifically, the quota set on a DC/OS group (for example, "/dev") is translated to setting the quota limit on the corresponding resource role in Mesos (for example, "dev").
Additionally, services launched inside a given group are configured to use the resources allocated to the **group role** (for example, "dev"), so that their resource consumption can be limited by the quota defined.

# Prerequisites

* [DC/OS CLI installed and configured](/1.14/cli/).
* Sufficient [permissions](/1.14/security/ent/perms-reference) to manage quota (Enterprise DC/OS only).

    Quota management operations are typically done by the cluster administrator.

# Creating a group

You should set the `enforceRole=true` property on a group to ensure that any new services launched in a group are properly limited by quota.

```bash
dcos marathon group add --id /dev. # If the group doesn't exist
dcos marathon group update /dev enforeceRole=true
```

In future versions of DC/OS, this property will be set to `true` automatically.

# Setting a quota

To set quota for the first time on a group, use the following command:

```bash
dcos quota create dev --cpu 10 --mem 1024
```