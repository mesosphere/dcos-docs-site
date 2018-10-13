---
layout: layout.pug
navigationTitle:  Uninstalling
title: Uninstalling
menuWeight: 40
excerpt: Uninstalling DC/OS Percona XtraDB Cluster Service
featureMaturity:
enterprise: false
model: /services/pxc/data.yml
render: mustache
---

# DC/OS 1.10 and later

If you are using DC/OS 1.10 or later:

Uninstall the service from the DC/OS CLI by entering `dcos package uninstall <package_name> --app-id=<app-id>`.

For example, to uninstall the {{ model.techName}} instance named `pxc-dev`, run:

```shell
dcos package uninstall --app-id=pxc-dev {{ model.serviceName}}
```

## Uninstall workflow

Uninstalling the service consists of the following steps:

The scheduler is relaunched in Marathon with the environment variable `SDK_UNINSTALL` set to “true”. This puts the Scheduler in an uninstall mode.

The scheduler performs the uninstall with the following actions:

  1. All running tasks for the service are terminated so that Mesos will re-offer their resources.
  2. As the task resources are offered by Mesos, they are unreserved by the scheduler.
    
  <p class="message--warning"><strong>WARNING: </strong>Any data stored in reserved disk resources will be irretrievably lost.</p>
 
The cluster automatically removes the scheduler task once it advertises the completion of the uninstall process.

  <p class="message--warning"><strong>WARNING: </strong>Once the uninstall operation has begun, it cannot be cancelled because doing so can leave the service in an uncertain, half-destroyed state. Any data stored in reserved disk resources will be irretrievably lost.</p>

### Debugging an uninstall

In the vast majority of cases, this uninstall process goes off without a hitch. However, in certain situations, there can be snags along the way. For example, perhaps a machine in the cluster has permanently gone away, and the service being uninstalled had some resources allocated on that machine. This can result in the uninstall becoming stuck, because Mesos will never offer those resources to the uninstalling scheduler. In that case, the uninstalling scheduler will not be able to successfully unreserve the resources it had reserved on that machine.

This situation is indicated by looking at the Deploy Plan while the uninstall is proceeding. The Deploy Plan may be viewed using either of the following methods:

1. CLI: `dcos {{ model.serviceName}} --name={{ model.serviceName}} plan show deploy` (after running `dcos package install --cli {{ model.serviceName}}` if needed)
2. HTTP: https://yourcluster.com/service/{{ model.serviceName}}/v1/plans/deploy

**Deploy Plan in completion status**

```shell
dcos {{ model.serviceName}} --name={{ model.serviceName}} plan show deploy

├─ proxysql (serial strategy) (COMPLETE)
│  └─ proxysql-0:[psql] (COMPLETE)
├─ node (serial strategy) (COMPLETE)
│  ├─ pxc-0:[init] (COMPLETE)
│  ├─ pxc-0:[node] (COMPLETE)
│  ├─ pxc-1:[node] (COMPLETE)
│  └─ pxc-2:[node] (COMPLETE)
├─ mysqldexporter (serial strategy) (COMPLETE)
│  └─ mysqldexporter-0:[exporterstart] (COMPLETE)
└─ psqlconf (serial strategy) (COMPLETE)
   └─ psqlconf-0:[mysqlcli] (COMPLETE)
 
```       

### Manual uninstall    

If all else fails, you can manually perform the uninstall yourself. To do this, perform the following steps:

1. Delete the uninstalling scheduler from Marathon.
1. Unregister the service from Mesos using its UUID as follows:

```shell
dcos service --inactive | grep {{ model.serviceName}}
{{ model.serviceName}}  True     5    1.0  1420.0  1405.0  6accf43f-6449-4e95-808a-3c5144789074-0004

dcos service shutdown 6accf43f-6449-4e95-808a-3c5144789074-0004
```

### Uninstall operation in DC/OS 1.9

If you are running DC/OS 1.9, follow these steps:

1. Stop the service. From the DC/OS CLI, enter:
```shell
dcos package uninstall --app-id=<service_name>  <package_name>
```    
  For example:
```shell
dcos package uninstall --app-id=/test/{{ model.serviceName}} {{ model.serviceName}}
```                   
 2. Clean up remaining reserved resources with the framework cleaner script, `janitor.py`. See [DC/OS documentation](https://docs.mesosphere.com/latest/deploying-services/uninstall/#framework-cleaner) for more information about the framework cleaner script.

```shell
dcos package uninstall --app-id=/test/{{ model.serviceName}} {{ model.serviceName}}
dcos node ssh --master-proxy --leader "docker run mesosphere/janitor /janitor.py \
-r /test/{{ model.serviceName}}-role \
-z dcos-service-/test/{{ model.serviceName}}"
```      
