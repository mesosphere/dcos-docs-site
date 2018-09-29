---
layout: layout.pug
navigationTitle:  Uninstall
title: Uninstall
menuWeight: 55
excerpt: Uninstalling DC/OS Spinnaker Services
featureMaturity:
enterprise: false
model: /services/spinnaker/data.yml
render: mustache
---

# DC/OS 1.10

If you are using DC/OS 1.10 or later:

Uninstall the service from the DC/OS CLI with the command `dcos package uninstall <package_name>`. For example, to uninstall the {{ model.techName }} instance named `spinnaker-dev`, run:

    ```
    dcos package uninstall spinnaker-dev
    ```

## Uninstall procedure

Uninstalling the service consists of the following steps. The scheduler is relaunched in Marathon with the environment variable SDK_UNINSTALL set to “true”. This puts the Scheduler in an uninstall mode.

The scheduler performs the uninstall with the following actions:

   1. All running tasks for the service are terminated so that Mesos will reoffer their resources.
   1. As the task resources are offered by Mesos, they are unreserved by the scheduler.
   1. Once all known resources have been unreserved, the scheduler’s persistent state in ZooKeeper is deleted.

<p class="message--warning"><strong>WARNING:</strong> Any data stored in reserved disk resources will be irretrievably lost.</p>

The cluster automatically removes the scheduler task once it advertises the completion of the uninstall process.

<p class="message--warning"><strong>WARNING: </strong> Once the uninstall operation has begun, it cannot be cancelled. Doing so may leave the service in an uncertain, half-destroyed state.</p>


## Debugging an uninstall

In the vast majority of cases, this uninstall process goes off without a hitch. However, in certain situations, there can be snags along the way. For example, perhaps a machine in the cluster has permanently gone away, and the service being uninstalled had some resources allocated on that machine. This can result in the uninstall becoming stuck, because Mesos will never offer those resources to the uninstalling scheduler. Thus, the uninstalling scheduler will not be able to successfully unreserve the resources it had reserved on that machine.

This situation is indicated by looking at the deploy plan while the uninstall is proceeding. The deploy plan may be viewed using either of the following methods:

- CLI: `dcos spinnaker --name=spinnaker plan show deploy` (after running `dcos package install --cli spinnaker` if needed)
- HTTP: https://yourcluster.com/service/couchbase/v1/plans/deploy

## Manual uninstall    

If all else fails, you can manually perform the uninstall yourself. To do this, perform the following steps:

1. Delete the uninstalling scheduler from Marathon.
1. Unregister the service from Mesos using its UUID as follows:

```shell
dcos service --inactive | grep spinnaker
spinnaker     False     3    3.3  6240.0  15768.0  97a0fd27-8f27-4e14-b2f2-fb61c36972d7-0096
dcos service shutdown 97a0fd27-8f27-4e14-b2f2-fb61c36972d7-0096
```
