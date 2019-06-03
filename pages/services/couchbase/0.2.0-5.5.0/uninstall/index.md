---
layout: layout.pug
navigationTitle:  Uninstall
title: Uninstall
menuWeight: 55
excerpt: Uninstalling DC/OS Couchbase Services
featureMaturity:
enterprise: false
model: /services/couchbase/data.yml
render: mustache
---

## DC/OS 1.10

If you are using DC/OS 1.10 or later:

Uninstall the service from the DC/OS CLI with the command `dcos package uninstall <package_name>`. For example, to uninstall the {{ model.techName }} instance named `couchbase-dev`, run:

    ```
    dcos package uninstall couchbase-dev
    ```

### Uninstall procedure

Uninstalling the service consists of the following steps. The Scheduler is relaunched in Marathon with the environment variable SDK_UNINSTALL set to “true”. This puts the Scheduler in uninstall mode.

The Scheduler performs the uninstall with the following actions:

   1. All running tasks for the service are terminated so that Mesos will reoffer their resources.
   1. As the task resources are offered by Mesos, they are unreserved by the Scheduler.
   1. Once all known resources have been unreserved, the Scheduler’s persistent state in ZooKeeper is deleted.

<table class=“table” bgcolor=#ffd000>
<tr> 
  <td align=justify style=color:black><strong>WARNING:</strong> Any data stored in reserved disk resources will be irretrievably lost.</td> 
</tr> 
</table>

The cluster automatically removes the Scheduler task once it advertises the completion of the uninstall process.

<table class=“table” bgcolor=#ffd000>
<tr> 
  <td align=justify style=color:black><strong>Warning:</strong> Once the uninstall operation has begun, it cannot be cancelled. Doing so may leave the service in an uncertain, half-destroyed state.</td> 
</tr> 
</table>


### Debugging an uninstall

In the vast majority of cases, this uninstall process goes off without a hitch. However, in certain situations, there can be snags along the way. For example, perhaps a machine in the cluster has permanently gone away, and the service being uninstalled had some resources allocated on that machine. This can result in the uninstall becoming stuck, because Mesos will never offer those resources to the uninstalling Scheduler. Thus, the uninstalling Scheduler will not be able to successfully unreserve the resources it had reserved on that machine.

This situation is indicated by looking at the deploy plan while the uninstall is proceeding. The deploy plan may be viewed using either of the following methods:

- Running `dcos package install --cli couchbase` (if needed)
- CLI: `dcos couchbase --name=couchbase plan show deploy`
- HTTP: https://yourcluster.com/service/couchbase/v1/plans/deploy

### Manual uninstall    

If all else fails, you can manually perform the uninstall yourself. To do this, perform the following steps:

1. Delete the uninstalling Scheduler from Marathon.
1. Unregister the service from Mesos using its UUID as follows:

```shell
dcos service --inactive | grep couchbase
couchbase     False     3    3.3  6240.0  15768.0  97a0fd27-8f27-4e14-b2f2-fb61c36972d7-0096
dcos service shutdown 97a0fd27-8f27-4e14-b2f2-fb61c36972d7-0096
```
