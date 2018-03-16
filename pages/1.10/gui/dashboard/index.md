---
layout: layout.pug
navigationTitle:  Dashboard
title: Dashboard
menuWeight: 1
excerpt:
---
The dashboard is the home page of the DC/OS web interface and provides an overview of your DC/OS cluster.

[message type="Info"]The Secrets tab is available only in DC/OS Enterprise.[/message]

![Dashboard](/1.10/img/dashboard-ee.png)


From the dashboard you can easily monitor the health of your cluster.

*   The CPU Allocation panel provides a graph of the current percentage of available general compute units that are being used by your cluster.

*   The Memory Allocation panel provides a graph of the current percentage of available memory that is being used by your cluster.

*   The Disk Allocation panel provides a graph of the current percentage of available disk space that is being used by your cluster.

*   The Services Health panel provides an overview of the health of your services. Each service provides a health check, run at intervals. This indicator shows the current status according to that health check. A maximum of 5 services are displayed, sorted by priority of the most unhealthy. You can click the **View All `<number>` Services** button for detailed information and a complete list of your services.

*   The Tasks panel provides the current number of tasks that are staged and running.

*   The Component Health panel provides an overview of the health of your component. Each component provides a health check, run at intervals. This indicator shows the current status according to that health check. A maximum of 5 components are displayed, sorted by priority of the most unhealthy. You can click the **View All `<number>` Components** button for detailed information and a complete list of your components.

*   The Nodes panel provides a view of the nodes in your cluster.
