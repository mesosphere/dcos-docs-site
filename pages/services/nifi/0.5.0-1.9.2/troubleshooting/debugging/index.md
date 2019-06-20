---
layout: layout.pug
navigationTitle: Debugging
title: Debugging
menuWeight: 101
excerpt: Some common errors you might find
featureMaturity:
enterprise: false
model: ../../../data.yml
render: mustache
---

# Configuration update errors

After a configuration change, the service may enter an unhealthy state. This commonly occurs when an invalid configuration change was made by the user. Certain configuration values may not be changed, or may not be decreased. To verify whether this is the case, check the service’s deploy plan for any errors.

```shell
dcos {{ model.serviceName }} --name={{ model.serviceName }}-dev plan show deploy
```

# Accessing Logs

Logs for the Scheduler and all service nodes can be viewed from the DC/OS UI.

- Scheduler logs are useful for determining why a node is not being launched (this is under the purview of the Scheduler).
- Node logs are useful for examining problems in the service itself.

In all cases, logs are generally piped to files named `stdout` and/or `stderr`.

To view logs for a given node, perform the following steps:

  1. Visit `<dcos-rl>` to access the DC/OS UI.
  2. Navigate to Services and click on the service to be examined (default {{ model.serviceName }}).
  3. In the list of tasks for the service, click on the task to be examined (Scheduler is named after the service, nodes are each named for instance, node-<#>-server depending on their type).
  4. In the task details, click on the Logs tab to go into the log viewer. By default, you will see `stdout`, but `stderr` is also useful. Use the pull-down in the upper right to select the file to be examined.

You can also access the logs via the Mesos UI:

  1. Visit `<dcos-url>/mesos` to view the Mesos UI.
  2. Click the Frameworks tab in the upper left to get a list of services running in the cluster.
  3. Navigate into the correct framework for your needs. The Scheduler runs under marathon with a task name matching the service name (default {{ model.serviceName }}). Service nodes run under a framework whose name matches the service name (default {{ model.serviceName }}).
  4. You should now see two lists of tasks. Active Tasks are tasks currently running, and Completed Tasks are tasks that have exited. Click the Sandbox link for the task you wish to examine.
  5. The Sandbox view will list files named `stdout` and `stderr`. Click the file names to view the files in the browser, or click **Download** to download them to your system for local examination. Note that very old tasks will have their Sandbox automatically deleted to limit disk space usage.

# Replacing a Permanently Failed Node

The DC/OS {{model.techName }} is resilient to temporary pod failures, automatically relaunching them in-place if they stop running. However, if a machine hosting a pod is permanently lost, manual intervention is required to discard the downed pod and reconstruct it on a new machine.

1. The following command should be used to get a list of available pods. In this example we are querying a service named `{{ model.serviceName }}-dev`.

    ```shell
     dcos {{ model.serviceName }} --name={{ model.serviceName }}-dev pod list
    ```
1. The following command should then be used to replace the pod residing on the failed machine, using the appropriate `pod_name` provided in the above list.

    ```shell
    dcos {{ model.serviceName }} --name={{ model.serviceName }}-dev pod replace <pod_name>
    ```
1. The pod recovery may then be monitored via the recovery plan.

    ```shell
    dcos {{ model.serviceName }} --name={{ model.serviceName }}-dev plan show recovery
    ```

# Restarting a Node

If you must forcibly restart a pod’s processes but do not wish to clear that pod’s data, use the following command to restart the pod on the same agent machine where it currently resides. This will not result in an outage or loss of data.

1. The following command should be used to get a list of available pods. In this example we are querying a service named `{{ model.serviceName }}-dev`.

    ```shell
    dcos {{ model.serviceName }} --name={{ model.serviceName }}-dev pod list
    ```

1. The following command should then be used to restart the pod, using the appropriate `pod_name` provided in the above list.

    ```shell
    dcos {{ model.serviceName }} --name={{ model.serviceName }}-dev pod restart <pod_name>
    ```

1. The pod recovery may then be monitored via the recovery plan.

    ```shell
    dcos {{ model.serviceName }} --name={{ model.serviceName }}-dev plan show recovery
    ```

# Accidentally deleted Marathon task but not service

A common mistake is to remove the Scheduler task from Marathon, which does not uninstall the service tasks themselves. To correct this, you have two options:

## Uninstall the rest of the service

If you really want to uninstall the service, you must complete the normal package uninstall steps described under [Uninstall](/services/nifi/0.5.0-1.9.2/uninstall/).

## Recover the Scheduler

If you want to bring the Scheduler back, you can perform a `dcos package install` using the options that you had configured before. This will re-install a new Scheduler that should match the previous one (assuming you set your options correctly), and will resume where it left off. 

To ensure that you do not forget the options your services are configured with, we recommend keeping a copy of your service’s `options.json` file in source control so that you can easily recover it later.

# ‘Framework has been removed’

If you forgot to run `janitor.py` the last time you ran the service, see [Uninstall](/services/nifi/0.5.0-1.9.2/uninstall/) for the procedure. For reference, here is what happened:

1. You ran `dcos package {{ model.serviceName }} --app-id {{ model.serviceName }}`. This destroyed the Scheduler and its associated tasks, but did not clean up its reserved resources.
1. Later on, you tried to reinstall the service. The Scheduler came up and found an entry in ZooKeeper with the previous framework ID, which would have been cleaned up by `janitor.py`. The Scheduler tried to re-register using that framework ID.
1. Mesos returned an error because the framework ID is no longer valid. Hence the confusing ‘Framework has been removed’ error.

# Stuck deployments

You can sometimes get into situations where a deployment is being blocked by a repair operation or vice versa. For example, assume you are rolling out an update to a 500 node NiFi cluster. The deployment pauses at node #394 because it is failing to come back, and, for whatever reason, you do not have the time to perform `pod replace` and wait for it to come back.

The following example shows how steps in the deployment Plan (or any other Plan) can be manually retriggered or forced to a completed state by querying the Scheduler. This does not come up often, but it can be a useful tool in certain situations.


In this case, we can use Plan commands to force the Scheduler to skip node #394 and proceed with the rest of the deployment:   

  ```shell
  dcos {{ model.serviceName }} plan status deploy
  {
    "phases": [
      {
        "id": "aefd33e3-af78-425e-ad2e-6cc4b0bc1907",
        "name": "{{ model.serviceName }}-phase",
        "steps": [
          ...
          { "id": "f108a6a8-d41f-4c49-a1c0-4a8540876f6f", "name": "node-393:[node]", "status": "COMPLETE" },
          { "id": "83a7f8bc-f593-452a-9ceb-627d101da545", "name": "node-394:[node]", "status": "PENDING" }, # stuck here
          { "id": "61ce9d7d-b023-4a8a-9191-bfa261ace064", "name": "node-395:[node]", "status": "PENDING" },
          ...
        ],
        "status": "IN_PROGRESS"
      },
      ...
    ],
    "errors": [],
    "status": "IN_PROGRESS"
  }
  dcos plan force deploy {{ model.serviceName }}-phase node-394:[node]
  {
  "message": "Received cmd: forceComplete"
  }
  ```
After forcing the node-394:[node] step, we can then see that the Plan shows it in a COMPLETE state, and that the Plan is proceeding with node-395:

  ```shell
  dcos {{ model.serviceName }} plan status deploy
  {
    "phases": [
      {
        "id": "aefd33e3-af78-425e-ad2e-6cc4b0bc1907",
        "name": "{{ model.serviceName }}-phase",
        "steps": [
          ...
          { "id": "f108a6a8-d41f-4c49-a1c0-4a8540876f6f", "name": "node-393:[node]", "status": "COMPLETE" },
          { "id": "83a7f8bc-f593-452a-9ceb-627d101da545", "name": "node-394:[node]", "status": "COMPLETE" },
          { "id": "61ce9d7d-b023-4a8a-9191-bfa261ace064", "name": "node-395:[node]", "status": "PENDING" },
          ...
        ],
        "status": "IN_PROGRESS"
      },
      ...
    ],
    "errors": [],
    "status": "IN_PROGRESS"
  }

  ```

If you want to go back and fix the deployment of that node, you can force the Scheduler to treat it as a pending operation again:

  ```shell  
  dcos plan restart deploy {{ model.serviceName }}-phase node-394:[node]
  {
    "message": "Received cmd: restart"
  }
  ```
You can see that the step is again marked as PENDING as the Scheduler again attempts to redeploy that node:

  ```shell  
  dcos {{ model.serviceName }} plan status deploy
  {
    "phases": [
      {
        "id": "aefd33e3-af78-425e-ad2e-6cc4b0bc1907",
        "name": "{{ model.serviceName }}-phase",
        "steps": [
          ...
          { "id": "f108a6a8-d41f-4c49-a1c0-4a8540876f6f", "name": "node-393:[node]", "status": "COMPLETE" },
          { "id": "83a7f8bc-f593-452a-9ceb-627d101da545", "name": "node-394:[node]", "status": "PENDING" },
          { "id": "61ce9d7d-b023-4a8a-9191-bfa261ace064", "name": "node-395:[node]", "status": "COMPLETE" },
          ...
        ],
        "status": "IN_PROGRESS"
      },
      ...
    ],
    "errors": [],
    "status": "IN_PROGRESS"
  }

  ```

<p class="message--note"><strong>NOTE: </strong>The <tt>dcos plan</tt> commands will also accept UUID ID values instead of the name values for the phase and step arguments. Providing UUIDs avoids the possibility of a race condition where we view the plan, then it changes structure, then we change a plan step that is not the same one we were expecting (but which had the same name).</p>
