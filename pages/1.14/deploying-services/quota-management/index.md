---
layout: layout.pug
navigationTitle: Quota Management
title: Quota Management
menuWeight: 90
excerpt: A primer on Quota Management for service groups in DC/OS
render: mustache
model: /1.14/data.yml
---

# Overview
Group is the building block of multi-tenancy in DC/OS. In addition to visual grouping of services, permissions, secrets and quota can be attached to a group. Organizations can map a group to a team or project or Line of Business.

This page discusses quota management using service groups.


## Quota
Quota can be used to specify the maximum amount of resources that services in a group can use. Once the limit is reached, no new services or scaling up of existing services is allowed.

Quota in DCOS is built on top of [Quota Limits](https://mesos.apache.org/documentation/latest/quota/)  primitive in Apache Mesos. Specifically, quota set on a DCOS group (e.g., "/dev") is translated to setting quota limit on the corresponding resource role in Mesos (e.g., "dev"). Additionally, services launched inside a given group are configured to use the resources allocated to the **group role** (e.g., "dev"), so that their resource consumption can be limited by Quota.


### Prerequisites

*   [DC/OS CLI installed and configured](/1.14/cli/).
*   Sufficient [permissions](/1.14/security/ent/perms-reference) to manage quota (Enterprise DC/OS only).


The following quota management operations are typically done by the adminstrator of a cluster.

### Creating a group

It is recommended to set `enforceRole=true` property on a group, to ensure that any new services launched in a group are properly limited by quota.

```
$ dcos marathon group add --id /dev. # If the group doesn't exist
$ dcos marathon group update /dev enforeceRole=true
```

In future versions of DCOS, this property will be set to true automatically.

### Setting Quota

To set quota for the first time on a group, use the following command.

```
$ dcos quota create dev --cpu 10 --mem 1024
```

### Viewing Quota
To view quota limits and consumption of a group, use the following command.

```
$ dcos quota get dev
```

Quota information can also be viewed in the DCOS UI by going to the Quota tab in the "Services" view.


### Updating Quota
For updating existing quota on a group, use the following command.

```
$ dcos quota update dev --cpu 20 --me, 2048
```

### Deleting Quota
To delete existing quota from a group, use the following command.

```
$ dcos quota delete dev
```

Note that deleting quota doesn't affect any running services inside the group. Services will keep running, but they won't be limited by quota anymore.


### Deploying Services
Once quota is set on a group by an administrator, regular users can simply deploy their services in a group as usual. If `enforceRole` property is set on the group, the service will be automatically configured to use the group role and hence limited by the quota. If the property is not set, but a user still wishes that their service be limited by quota, they could configure their service with the group role manually.



### Migrating services

For backwards compatibility with existing deployments, services launched in a group do not use the group role by default but rather use their legacy role as before (the actual legacy role depends on whether the service was launched by native marathon, non-native marathon, catalog service etc).

To migrate a stateless service that uses legacy role to group role, a user can simply reconfigure the role of the service to group role and do an update.

```
$ dcos marathon app update my-app role=dev
```

To migrate a stateful service (e.g., DCOS Kafka, DCOS Cassandra), a user has to update the role of the service and do a `pod replace` of each of the corresponding pods. Note that `pod replace` causes local persistent data to be lost, so this needs to be done extremely carefully (e.g., do a backup first, ensure replication of underlying service can handle data loss of one node at a time).

```
$ dcos kafka --name=/<group>/kafka update start --package-version="<version-supporting-group-role>" 

For each pod:
$ dcos kafka --name=/<group>/kafka pod replace <pod-name>

```


### Limitations

* Quota can only be set on top level groups (e.g., "/dev") but not on nested groups ("/dev/foo").
* Services running in the root group (e..g, /app) are not enforced by quota.
* Not all the Catalog services are enforced by quota. Refer to the specific service documentation for details.
* Jobs are not enforced by quota.
* Migrating stateful services cannot be done without incuring data loss.



# Additional Resources
You can use the following additional resources to learn more about:

- [Mesos API](https://mesos.apache.org/documentation/latest/quota/)


