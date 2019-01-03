---
layout: layout.pug
navigationTitle: 
title: Troubleshooting
menuWeight: 50
excerpt:
featureMaturity:
enterprise: false
---

# Accessing Logs

You can find logs for the scheduler and all service pods on the DC/OS web interface.

- Scheduler logs are useful for determining why a pod isn't being launched (this is under the purview of the scheduler).
- Pod logs are useful for examining problems in the service itself.

In all cases, logs are generally piped to files named `stdout` and/or `stderr`.

To view logs for a given pod, perform the following steps:
1. Visit `<dcos-url>` to view the DC/OS Dashboard.
1. Navigate to `Services` and click the service to be examined (default `confluent-kafka`).
1. In the list of tasks for the service, click the task to be examined.
1. In the task details, click the `Logs` tab to go into the log viewer. By default you will see `stdout`, but `stderr` is also useful. Use the pull-down in the upper right to select the file to be examined.

You can also access the logs via the Mesos UI:
1. Visit `<dcos-url>/mesos` to view the Mesos UI.
1. Click the `Frameworks` tab in the upper left to get a list of services running in the cluster.
1. Navigate to the correct framework for your needs. The scheduler runs under `marathon` with a task name matching the service name (default `confluent-kafka`). Service pods run under a framework whose name matches the service name (default `confluent-kafka`).
1. You should see two lists of tasks. `Active Tasks` are tasks currently running and `Completed Tasks` are tasks that have exited. Click the `Sandbox` link for the task you wish to examine.
1. The `Sandbox` view will list files named `stdout` and `stderr`. Click the file names to view the files in the browser, or click `Download` to download them to your system for local examination. Note that very old tasks will have their Sandbox automatically deleted to limit disk space usage.
