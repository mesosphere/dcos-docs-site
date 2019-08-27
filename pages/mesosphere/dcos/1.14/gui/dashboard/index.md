---
layout: layout.pug
navigationTitle:  Dashboard
title: Dashboard
menuWeight: 1
excerpt: Using the Dashboard
render: mustache
model: /mesosphere/dcos/1.14/data.yml
---
The Dashboard is the home page of the DC/OS UI. It provides a high-level overview of your DC/OS cluster.

![Dashboard](/mesosphere/dcos/1.14/img/GUI-Dashboard.png)

Figure 1 - Dashboard


From the Dashboard you can easily monitor the health of your cluster. The following list of panels may not exactly match the order in which yours are displayed on your Dashboard.

*   The **CPU Allocation** panel displays a graph of the current percentage of available general compute units that are being used by your cluster.

*   The **Memory Allocation** panel displays a graph of the current percentage of available memory that is being used by your cluster.

*   The **Disk Allocation** panel displays a graph of the current percentage of available disk space that is being used by your cluster.

*   The **GPU Allocation** panel displays a graph of the percentage of cores dedicated to GPU displays.

*   The **Nodes** panel displays the number of connected nodes.

*   The **Services Status** panel displays an overview of the health of your services. Each service displays a health check, run at intervals. This indicator shows the current status according to that health check. A maximum of 5 services are displayed, sorted by priority of the most unhealthy. You can click the **View All Services** button for detailed information and a complete list of your services.

*   The **Tasks** panel displays the current number of tasks that are staged and running.

*   The **Components Health** panel displays an overview of the health of your component. Each component provides a health check, run at intervals. This indicator shows the current status according to that health check. A maximum of 5 components are displayed, sorted by priority of the most unhealthy. You can click the **View All `<number>` Components** button for detailed information and a complete list of your components.

![Components list](/mesosphere/dcos/1.14/img/GUI-Components-Main_View.png)

Figure 2 - List of Components with Health status