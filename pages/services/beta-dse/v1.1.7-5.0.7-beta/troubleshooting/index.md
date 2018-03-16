---
layout: layout.pug
navigationTitle:  Troubleshooting
title: Troubleshooting
menuWeight: 90
excerpt:
featureMaturity:
enterprise: false
---

## Accessing Logs
Logs for the Scheduler, DSE Nodes, OpsCenter instance (if built-in is enabled), and Studio instance may all be browsed via the DC/OS Dashboard.

- Scheduler logs are useful for determining why a task isn't being launched (this is under the purview of the Scheduler).
- OpsCenter logs are useful for examining problems in the OpsCenter dashboard.
- DSE Node logs are useful for examining problems in DSE itself.

In all cases, logs are generally piped to files named `stdout` and/or `stderr`.

To view logs for a given node, perform the following steps:
1. Visit http://yourcluster.com/ to view the DC/OS Dashboard.
1. Navigate to `Services` and click on the service to be examined (default `dse`).
1. In the list of tasks for the service, click on the task to be examined (scheduler is named after the service, OpsCenter is `opscenter-0-node`, DSE nodes are each `dse-#-node`).
1. In the task details, click on the `Logs` tab to go into the log viewer. By default you will see `stdout`, but `stderr` is also useful. Use the pull-down in the upper right to select the file to be examined.

In case of problems with accessing the DC/OS Dashboard, logs may also be accessed via the Mesos UI:
1. Visit http://yourcluster.com/mesos to view the Mesos UI.
1. Click the `Frameworks` tab in the upper left to get a list of services running in the cluster.
1. Navigate into the correct Framework for your needs. The Scheduler runs under `marathon` with a task name matching the service name (default `dse`). Meanwhile DSE nodes and OpsCenter run under a Framework whose name matches the service name (default `dse`).
1. You should now see two lists of tasks. `Active Tasks` are what's currently running, and `Completed Tasks` are what has since exited. Click on the `Sandbox` link for the task you wish to examine.
1. The `Sandbox` view will list files named `stdout` and `stderr`. Click the file names to view the files in the browser, or click `Download` to download them to your system for local examination. Note that very old tasks will have their Sandbox automatically deleted to limit disk space usage.
