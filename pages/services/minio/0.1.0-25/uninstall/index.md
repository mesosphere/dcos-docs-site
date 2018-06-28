---
layout: layout.pug
navigationTitle:  Uninstalling
title: Uninstalling
menuWeight: 40
excerpt: Uninstalling DC/OS Minio Service
featureMaturity:
enterprise: false
---

## DC/OS 1.11

If you are using DC/OS 1.11 :

Uninstall the service from the DC/OS CLI by entering `dcos package uninstall <package_name>`.

### Uninstall workflow

Uninstalling the service consists of the following steps:

The scheduler is relaunched in Marathon with the environment variable `SDK_UNINSTALL` set to “true”. This puts the Scheduler in an uninstall mode.

The scheduler performs the uninstall with the following actions:

  1. All running tasks for the service are terminated so that Mesos will re-offer their resources.
  2. As the task resources are offered by Mesos, they are unreserved by the scheduler.
**Warning:** Any data stored in reserved disk resources will be irretrievably lost.
  3. Once all known resources have been unreserved, the scheduler’s persistent state in ZooKeeper is deleted.

The cluster automatically removes the scheduler task once it advertises the completion of the uninstall process.

**Warning**  Once the uninstall operation has begun, it cannot be cancelled because it may leave the service in an uncertain, half-destroyed state.

### Manual uninstall    

If all else fails, you can manually perform the uninstall yourself. To do this, perform the following steps:

1. Delete the uninstalling scheduler from Marathon.
2. Unregister the service from Mesos using its UUID as follows:

```shell
dcos service --inactive | grep minio
minio     False     3    3.3  6240.0  15768.0  97a0fd27-8f27-4e14-b2f2-fb61c36972d7-0096
dcos service shutdown 97a0fd27-8f27-4e14-b2f2-fb61c36972d7-0096
```
