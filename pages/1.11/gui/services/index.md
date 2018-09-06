---
layout: layout.pug
navigationTitle:  Services
title: Services
menuWeight: 2
excerpt: Using the Services menu
---

The Services menu provides a full-featured interface to the native DC/OS Marathon instance. This Services men provides a comprehensive view of all of the services that you are running. You can filter services by health, status, or service name.

![Services](/1.11/img/services-ee.png)

Figure 1. Services menu

By default, all of your services are displayed, sorted by service name. You can also sort the services by health status, CPU, memory, or disk space allocated.

- Name - The DC/OS service name
- Status - The [`status`](#service-status) for the service
- CPU - The number of CPUs in use
- Mem - The amount of memory used
- Disk - The amount of disk space used

Click the service name to open the Instances menu, which provides CPU, memory, and disk usage graphs, and lists all tasks using the service. Click a task listed on the Instances menu to see detailed information about the task’s CPU, memory, and disk usage, and the task’s files and directory tree.

For services with a web interface, hover over the service name and click ![open service](/1.11/img/open-service.png) to view it.

**Note:** You can access the Mesos web interface at `<hostname>/mesos`.

# Service Status

DC/OS UI introduces the following concepts to illustrate the possible status of a Service at any point in time:

- Running - The Service is reported as running and no instances are reported as deploying or recovering.
- Deploying - DC/OS has not yet finished performing a requested change to the Service. If a Service is having difficulty getting to a Running state, a warning icon is displayed. This indicates the Service is waiting for the resource offers it requires to run or that too many tasks have failed in a short amount of time. More information can be obtained from the “Debug” section of the Service.
- Recovering - Whenever a change to the Service has is requested by DC/OS, the instance is killed and a new instance is started. Similar to Deploying, the Recovering status indicates that DC/OS is performing the required actions, which haven’t completed yet.
- Stopped - A Service with target instances of 0 and a running tasks count of 0. Previously referred to as “Suspended” in the UI.
