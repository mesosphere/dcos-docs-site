---
layout: layout.pug
navigationTitle:  Services
title: Services
menuWeight: 2
excerpt:
---

The Services tab provides a full-featured interface to the native DC/OS Marathon instance. This Services tab provides a comprehensive view of all of the services that you are running. You can filter services by health, status, or service name.

![Services](/1.9/img/services-ee.gif)

By default, all of your services are displayed, sorted by service name. You can also sort the services by health status, CPU, memory, or disk space allocated.

*   **NAME** The DC/OS service name.
*   **STATUS** The [Marathon health check](/1.9/deploying-services/creating-services/health-checks/) status for the service.
*   **CPU** The number of CPUs in use.
*   **MEM** The amount of memory used.
*   **DISK** The amount of disk space used.

Click the service name to open the Instances panel, which provides CPU, memory, and disk usage graphs and lists all tasks using the service. Click a task listed on the Instances panel to see detailed information about the task’s CPU, memory, and disk usage and the task’s files and directory tree.

For services with a web interface, hover over the service name and click ![open service](/1.9/img/open-service.png) to view it.

**Tip:** You can access the Mesos web interface at `<hostname>/mesos`.
