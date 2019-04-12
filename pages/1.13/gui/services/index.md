---
layout: layout.pug
navigationTitle:  Services
title: Services
menuWeight: 2
excerpt: Using the Services menu
---

The Services menu provides a full-featured interface to the native DC/OS Marathon instance. It provides a comprehensive view of all of the services that you are running. You can filter services by health, status, or service name.

![Services](/1.13/img/services-ee.png)

Figure 1. Services menu

By default, all of your services are displayed, sorted by service name. You can also sort the services by health status, version, region, instances, CPU, memory, disk space or GPU usage.

| Name | Description |
|----------------|------------------|
| Name | The DC/OS service name |of the service |
| Version | The version of the service |
| Region | The region of the service |
| Instances | The number of instances of the service|
| CPU | The number of CPUs in use |
| Mem | The amount of memory in use |
| Disk | The amount of disk space in use |
| GPU | The amount of GPU in use |


Click the service name to open the Services Instance page, which lists all tasks using the service and their CPU, memory and GPU usage. 

![Instances](/1.13/img/services-instances-panel.png)

<p>Figure 2. Instances panel</p>

## Tasks tab

For each task, there is also information about its zone, region, status, health and when it was last updated. Click a task to see its complete configuration, working directory and logs.

## Configuration

## Debug

## Endpoints

## Plans


For services with a UI, hover over the service name and click ![open service](/1.13/img/open-service.png) to view it. You can access the Mesos UI at `<hostname>/mesos`.

# Service Status

The DC/OS UI displays the status of a service:

| Status | Description |
|----------|----------------|
| Running | The Service is reported as running and no instances are reported as deploying or recovering. |
| Deploying | When you request a change to the Service, DC/OS is performing the required actions, which have not completed yet. If a Service is having difficulty getting to a Running state, a warning icon is displayed. This indicates that the Service is waiting for the resource offers it requires to run, or that too many tasks have failed in a short amount of time. More information can be obtained from the “Debug” section of the Service. |
| Recovering| When a change to the Service has been requested by DC/OS, the instance is killed and a new instance is started. Similar to Deploying, DC/OS is performing the required actions, which have not completed yet. |
| Stopped | A Service with target instances of 0 and with a running tasks count of 0. This state was previously referred to as “Suspended” in the UI. |
