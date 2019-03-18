---
layout: layout.pug
navigationTitle:  Services
title: Services
menuWeight: 2
excerpt: Using the Services menu
---

The Services menu provides a full-featured interface to the native DC/OS Marathon instance. This Services menu provides a comprehensive view of all of the services that you are running. You can filter services by health, status, or service name.

![Services](/1.13/img/services-ee.png)

<p>Figure 1. Services tab</p>

By default, all of your services are displayed, sorted by service name. You can also sort the services by health status, version, region, instances, CPU, memory, disk space or GPU usage.

*   **NAME** The DC/OS service name
*   **STATUS** The [`status`](#service-status) for the service
*   **VERSION** The version for the service
*   **REGION** The region for the service
*   **INSTANCES** The number of instances for the service
*   **CPU** The number of CPUs in use
*   **MEM** The amount of memory used
*   **DISK** The amount of disk space used
*   **GPU** The amount of GPU usage

Click the service name to open the Service Instance page, which lists all tasks using the service and their CPU, memory and GPU usage. For each task, there is also information about its zone, region, status, health and when it was last updated. Click a task to see its complete configuration, working directory and logs.

![Instances](/1.13/img/services-instances-panel.png)

<p>Figure 2. Instances panel</p>

For services with a web interface, hover over the service name and click ![open service](/1.13/img/open-service.png) to view it. You can access the Mesos web interface at `<hostname>/mesos`.

# Service Status

The DC/OS web interface introduces the following concepts to illustrate the possible status of a Service at any point:

## Running

The Service is reported as running and no instances are reported as deploying or recovering.

## Deploying

Whenever you request a change to the Service, DC/OS is performing the required actions, which have not completed yet. If a Service is having difficulty getting to a Running state, a warning icon is displayed. This indicates that the Service is waiting for the resource offers it requires to run, or that too many tasks have failed in a short amount of time. More information can be obtained from the “Debug” section of the Service.

## Recovering

Whenever a change to the Service has been requested by DC/OS, the instance is killed and a new instance is started. Similar to Deploying, DC/OS is performing the required actions, which have not completed yet.

## Stopped

A Service with target instances of 0 and whose running tasks count is 0. This state was previously referred to as “Suspended” in the web interface.
