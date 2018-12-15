---
layout: layout.pug
navigationTitle:  Uninstalling
title: Uninstalling
menuWeight: 39
excerpt: Uninstalling DC/OS Percona XtraDB Cluster Service
featureMaturity:
enterprise: false
model: /services/pxc/data.yml
render: mustache
---
This section will explain how you can uninstall the {{ model.techName }} service. 

<p class="message--warning"><strong>WARNING:</strong>  Once the uninstall operation has begun, it cannot be cancelled, because it may leave the service in an uncertain, half-destroyed state. Any data stored in reserved disk resources will be irretrievably lost when the service is uninstalled.</p>

# Uninstalling {{ model.techName }} service

Relaunch the scheduler in Marathon with the environment variable `SDK_UNINSTALL` set to `true`. This puts the Scheduler in `uninstall` mode. The scheduler performs the uninstall with the following actions:

- All running tasks for the service are terminated so that Mesos will re-offer their resources.
- As the task resources are offered by Mesos, they are unreserved by the scheduler.
- The cluster automatically removes the scheduler task once it advertises the completion of the uninstall process.


# Debugging an uninstall

In the vast majority of cases, the uninstall process succeeds without a problem. However, in certain situations, there can be obstacles. For example, a machine in the cluster may have permanently gone away, and the service being uninstalled had some resources allocated on that machine. This can result in the uninstall becoming stuck, because Mesos will never offer those resources to the uninstalling scheduler. In that case, the uninstalling scheduler will not be able to successfully unreserve the resources it had reserved on that machine.

This situation is revealed by looking at the Deploy Plan while the uninstall is proceeding. The Deploy Plan may be viewed using either of the following methods:

## From the CLI
1. If necessary, first run 
   ```
    dcos package install --cli {{ model.serviceName}}
    ```
2. From the CLI, run:
    ```
    dcos {{ model.serviceName }} --name={{ model.serviceName }} plan show deploy
   ``` 
## From the web interface
From HTTP: <a href="https://yourcluster.com/service/{{ model.serviceName }}/v1/plans/deploy">https://yourcluster.com/service/{{ model.serviceName }}/v1/plans/deploy</a>

**Deploy Plan in completion status**

```
{{ model.operations.complete-deploy }}
```

# Manual uninstall    

You can manually perform the uninstall yourself. To do this, perform the following steps:

1. Delete the uninstalling scheduler from Marathon.
1. Obtain the service's UUID from Mesos:

    ```shell
    dcos service --inactive | grep {{ model.serviceName }}
    {{ model.serviceName }}  True     5    1.0  1420.0  1405.0  6accf43f-6449-4e95-808a-3c5144789074-0004
    ```
1. Unregister the service from Mesos using its UUID:
    ```
    dcos service shutdown 6accf43f-6449-4e95-808a-3c5144789074-0004
    ```

# Un-install operation in DC/OS 1.10

If you are running DC/OS 1.9, follow these steps:

1. Stop the service. From the DC/OS CLI, enter:

   ```
   dcos package uninstall -app-id=<service_name>  <package_name>
   ```    
   For example:

    ```
    dcos package uninstall --app-id=/test/{{ model.serviceName }} {{ model.serviceName }}
    ``` 

 1. Clean up remaining reserved resources with the framework cleaner script, `janitor.py`. See the [DC/OS documentation](https://docs.mesosphere.com/1.11/deploying-services/uninstall/#framework-cleaner) for more information about the framework cleaner script.

       ```
       dcos package uninstall --app-id=/test/{{ model.serviceName }} {{ model.serviceName }}
       ```

       ```
       dcos node ssh --master-proxy --leader "docker run mesosphere/janitor /janitor.py \
              -r /test/{{ model.serviceName }}-role \
              -z dcos-service-/test/{{ model.serviceName }}"
       ```      

## DC/OS 1.10

If you are using DC/OS 1.10 :

Uninstall the service from the DC/OS CLI by entering `dcos package uninstall <package_name> --app-id=<app-id>`.

For example, to uninstall the {{ model.techName }} instance named `pxc-dev`, run:

```shell
dcos package uninstall --app-id=pxc-dev {{ model.serviceName }}
```