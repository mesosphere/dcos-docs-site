---
layout: layout.pug
navigationTitle:  Services
title: Services
menuWeight: 2
excerpt: Using the Services menu
render: mustache
model: /mesosphere/dcos/1.14/data.yml
---

The Services page provides a full-featured interface to the native DC/OS Marathon instance. It provides a comprehensive view of all of the services that you are running. You can filter services by health, status, or service name.

![Services](/mesosphere/dcos/1.14/img/services-ee.png)

Figure 1 - Services page

By default, all of your services are displayed, sorted by service name. You can also sort the services by health status, version, region, instances, CPU, memory, disk space or GPU usage.

| Name | Description |
|----------------|------------------|
| Name | The DC/OS service name of the service |
| [Status](#service-status) | The status of the service. See details in the following table.|
| Version | The version of the service |
| Region | The region of the service |
| Instances | The number of instances of the service|
| CPU | The number of CPUs in use |
| Mem | The amount of memory in use |
| Disk | The amount of disk space in use |
| GPU | The amount of GPU in use |

## Service Status

| Status | Description |
|----------|----------------|
| Running | The Service is reported as running and no instances are reported as deploying or recovering. |
| Deploying | When you request a change to the Service, DC/OS is performing the required actions, which have not completed yet. If a Service is having difficulty getting to a Running state, a warning icon is displayed. This indicates that the Service is waiting for the resource offers it requires to run, or that too many tasks have failed in a short amount of time. More information can be obtained from the [Debug](#debug) tab. |
| Recovering| When a change to the Service has been requested by DC/OS, the instance is killed and a new instance is started. Similar to Deploying, DC/OS is performing the required actions, which have not completed yet. |
| Stopped | A Service with target instances of 0 and with a running tasks count of 0. This state was previously referred to as “Suspended” in the UI. |

## SDK Service Status

Scheduler tasks based on the [DC/OS SDK](https://mesosphere.github.io/dcos-commons/) are leveraging Mesos native checks in order to provide more detailed information about their status than the above [Service Status](#service-status). These status are specific to SDK based schedulers and their lifecycle.

| Status | Description |
|----------|----------------|
| Initializing | Scheduler is initializing. |
| Running | All monitored Plans are complete. |
| Error Creating Service | Scheduler encountered an error creating the service. |
| Deploying (Awaiting Resources) | One or more monitored plans are deploying (awaiting resources). |
| Deploying | One or more monitored plans are deploying. |
| Deploying (Awaiting User Input) | One or more monitored plans are awaiting user input. |
| Degraded (Awaiting Resources) | One or more monitored plans are degraded (awaiting resources). |
| Degraded (Recovering) | One or more monitored plans are degraded (recovering). |
| Backing up | One or more monitored backup plans is in-progress. |
| Restoring | One or more monitored restore plans is in-progress. |
| Service Unavailable | Scheduler encountered an error with one or more monitored plans. |

## Tabs

Click the service name to open the Services Instance page. The Services Instance page organizes information about services under five tabs. Each tab lists information in an easy to review listing of the configuration and performance of the service.

![Instances](/mesosphere/dcos/1.14/img/services-instances-panel.png)

Figure 2 - Services instances 



| Tab | Description |
|------------------|----------------|
| Tasks | For each task, there is information about its zone, region, status, health and when it was last updated. Click a task to see its complete configuration, working directory and logs.  |
| Configuration |  Service and Networking configuration variables. |
| <a name="debug"></a>Debug |  Displays task statistics to help you troubleshoot issues with your cluster. |
| Endpoints |  Service configuration variables such as container images, container runtime, and advanced networking settings. |
| Plans | Displays all of a service's Deployment Plans so that you can track the status of a currently running or finished service. A drop-down menu lets you switch between plans. |

For services with a UI, hover over the service name and click ![open service](/mesosphere/dcos/1.14/img/open-service.png) to view it. You can access the Mesos UI at `<hostname>/mesos`.

