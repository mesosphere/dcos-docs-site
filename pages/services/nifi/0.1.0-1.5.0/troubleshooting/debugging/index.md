---
layout: layout.pug
navigationTitle:  Debugging
title: Debugging
menuWeight: 102
excerpt: Some common errors you might find
featureMaturity:
enterprise: false
---

The following topics address some common errors you may encounter while configuring or managing your DC/OS Apache NiFi Service.

# Configuration update errors

After a configuration change, the service may enter an unhealthy state. This commonly occurs when an invalid configuration change was made by the user. Certain configuration values may not be changed, or may not be decreased. To determine whether this is the case, check the service’s Deploy Plan for any errors.

```shell
dcos nifi --name=nifi-dev plan show deploy
```

# Accessing Logs

Logs for the Scheduler and all service nodes can be viewed from the DC/OS UI.

- Scheduler logs are useful for determining why a node isn’t being launched (this is under the purview of the Scheduler).
- Node logs are useful for examining problems in the service itself.

In all cases, logs are generally piped to files named `stdout` and/or `stderr`.

To view logs for a given node, perform the following steps:

  1. Access the DC/OS UI.
  2. Navigate to **Services** and click on the service to be examined (default NiFi).
  3. In the list of tasks for the service, click on the task to be examined (Scheduler is named after the service, nodes are each named, for example  `node-<#>-server` depending on the type).
  4. In the task details, click on the Logs tab to go into the log viewer. By default, you will see `stdout`, but `stderr` is also useful. Use the pull-down in the upper right to select the file to be examined.

You can also access the logs via the Mesos UI:

  1. Visit `<dcos-url>/mesos` to view the Mesos UI.
  2. Click the **Frameworks** tab in the upper left to get a list of services running in the cluster.
  3. Navigate into the correct framework for your needs. The Scheduler runs under Marathon with a task name matching the service name (default NiFi). Service nodes run under a framework whose name matches the service name (default NiFi).
  4. You should now see two lists of tasks. Active Tasks are tasks currently running, and Completed Tasks are tasks that have exited. Click the **Sandbox** link for the task you wish to examine.
  5. The Sandbox view will list files named `stdout` and `stderr`. Click the file names to view the files in the browser, or click **Download** to download them to your system for local examination. Note that very old tasks will have their Sandbox automatically deleted to limit disk space usage.

# Replacing a Permanently Failed Node

The DC/OS Elastic Service is resilient to temporary pod failures, automatically relaunching them in-place if they stop running. However, if a machine hosting a pod is permanently lost, manual intervention is required to discard the downed pod and reconstruct it on a new machine.

  1. The following command should be used to get a list of available pods. In this example we are querying a service named `nifi-dev`.

    ```shell
     dcos nifi --name=nifi-dev pod list
    ```
  2. The following command should then be used to replace the pod residing on the failed machine, using the appropriate `pod_name` provided in the above list.

    ```shell
    dcos nifi --name=nifi-dev pod replace <pod_name>
    ```
  3. The pod recovery may then be monitored via the Recovery Plan.

    ```shell
    dcos nifi --name=nifi-dev plan show recovery
    ```

# Restarting a Node

If you must forcibly restart a pod’s processes but do not wish to clear that pod’s data, use the following command to restart the pod on the same agent machine where it currently resides. This will not result in an outage or loss of data.

  1. The following command should be used to get a list of available pods. In this example we are querying a service named `nifi-dev`.

    ```shell
    dcos nifi --name=nifi-dev pod list
    ```

  2. The following command should then be used to restart the pod, using the appropriate `pod_name` provided in the above list.

    ```shell
    dcos nifi --name=nifi-dev pod restart <pod_name>
    ```

  3. The pod recovery may then be monitored via the Recovery Plan.

    ```shell
    dcos nifi --name=nifi-dev plan show recovery
    ```

# Accidentally deleted Marathon task but not service

A common user mistake is to remove the Scheduler task from Marathon, which does not uninstall the service tasks themselves. If you do this, you have two options:

## Uninstall the rest of the service

If you really want to uninstall the service, you must complete the normal package uninstall steps described under [Uninstall](/services/nifi/0.5.0-1.9.2/uninstall).

## Recover the Scheduler

If you want to bring the Scheduler back, you can do a `dcos package install` using the options that you had configured before. This will re-install a new Scheduler that should match the previous one, and it will resume where it left off. To ensure that you do not forget the options your services are configured with, we recommend keeping a copy of your service’s `options.json` file in source control so that you can easily recover it later.

# ‘Framework has been removed’

If you forgot to run `janitor.py` the last time you ran the service, you may see the error message 'Framework has been removed'. See [Uninstall](/services/nifi/0.5.0-1.9.2/uninstall) for steps on doing that. In case you are curious, here is what happened:

1. You ran `dcos package nifi --app-id nifi`. This destroyed the Scheduler and its associated tasks, but did not clean up its reserved resources.
2. Later on, you tried to reinstall the service. The Scheduler came up and found an entry in ZooKeeper with the previous framework ID, which would have been cleaned up by `janitor.py`. The Scheduler tried to re-register using that framework ID.
3. Mesos returned an error because it knows that framework ID is no longer valid. Hence the confusing ‘Framework has been removed’ error.

# Stuck deployments

You can sometimes get into valid situations where a deployment is being blocked by a repair operation or vice versa. For example, say you were rolling out an update to a 500 node NiFi cluster. The deployment gets paused at node #394 because it is failing to come back. In this case, you can use plan commands to force the Scheduler to skip node #394 and proceed with the rest of the deployment:   

  ```shell
  dcos nifi plan status deploy
  {
    "phases": [
      {
        "id": "aefd33e3-af78-425e-ad2e-6cc4b0bc1907",
        "name": "nifi-phase",
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
  dcos plan force deploy nifi-phase node-394:[node]
  {
  "message": "Received cmd: forceComplete"
  }
  ```
After forcing the `node-394:[node]` step, you can then see that the Plan shows it in a COMPLETE state, and that the Plan is proceeding with `node-395`:

  ```shell
  dcos nifi plan status deploy
  {
    "phases": [
      {
        "id": "aefd33e3-af78-425e-ad2e-6cc4b0bc1907",
        "name": "nifi-phase",
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
  dcos plan restart deploy nifi-phase node-394:[node]
  {
    "message": "Received cmd: restart"
  }
  ```
Now the step is again marked as PENDING, as the Scheduler again attempts to redeploy that node:

  ```shell  
  dcos nifi plan status deploy
  {
    "phases": [
      {
        "id": "aefd33e3-af78-425e-ad2e-6cc4b0bc1907",
        "name": "nifi-phase",
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
This example shows how steps in the Deployment Plan (or any other Plan) can be manually retriggered or forced to a completed state by querying the Scheduler. This does not come up often, but it can be a useful tool in certain situations.

**Note:** The `dcos plan` commands will also accept UUID id values instead of the name values for the phase and step arguments. Providing UUIDs avoids the possibility of a race condition where you view the plan, then it changes structure, then you change a plan step that is not the same one you were expecting (but which had the same name).</p>
