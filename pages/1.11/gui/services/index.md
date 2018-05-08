---
layout: layout.pug
navigationTitle:  Services
title: Services
menuWeight: 2
excerpt: Using the Services tab
---

The Services tab provides a full-featured interface to the native DC/OS Marathon instance. This Services tab provides a comprehensive view of all of the services that you are running. You can filter services by health, status, or service name.

![Services](/1.11/img/services-ee.png)

By default, all of your services are displayed, sorted by service name. You can also sort the services by health status, CPU, memory, or disk space allocated.

*   **NAME** The DC/OS service name.
*   **STATUS** The [`status`](#service-status) for the service.
*   **CPU** The number of CPUs in use.
*   **MEM** The amount of memory used.
*   **DISK** The amount of disk space used.

Click the service name to open the Instances panel, which provides CPU, memory, and disk usage graphs and lists all tasks using the service. Click a task listed on the Instances panel to see detailed information about the task’s CPU, memory, and disk usage and the task’s files and directory tree.

For services with a web interface, hover over the service name and click ![open service](/1.11/img/open-service.png) to view it.

**Tip:** You can access the Mesos web interface at `<hostname>/mesos`.

# Service Status

DC/OS UI introduces the following concepts to illustrate the possible status of a Service at any point in time:

## Running
The Service is reported as running and no instances are reported as deploying or recovering.

## Deploying
Whenever the user requests a change to the Service, DC/OS is performing the required actions, which haven’t completed yet.

If a Service is having difficulty getting to a Running state, a warning icon is displayed. This indicates the Service is waiting for the resource offers it requires to run or that too many tasks have failed in a short amount of time. More information can be obtained from the “Debug” section of the Service.

## Recovering
Whenever a change to the Service has been requested by DC/OS, the instance is killed and a new instance is started. Similar to Deploying, DC/OS is performing the required actions, which haven’t completed yet.

## Stopped
A Service with target instances of 0 and who's running tasks count is 0. Previously referred to as “Suspended” in the UI.
