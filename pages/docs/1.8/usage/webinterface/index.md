---
layout: layout.pug
title: GUI
menuWeight: 0
excerpt:
enterprise: false
featureMaturity:
navigationTitle:  GUI
---








The DC/OS web interface provides a rich graphical view of your DC/OS cluster. With the web interface you can view the current state of your entire cluster and DC/OS services. The web interface is installed as a part of your DC/OS installation.

There main tabs in the DC/OS UI are:

- [Dashboard](#dashboard)
- [Services](#services)
- [Jobs](#jobs)
- [Network](#network)
- [Nodes](#nodes)
- [Universe](#universe)
- [System](#system)

Additionally, there is a User Menu on the lower-left side of the web interface that includes links for documentation, CLI installation, and user sign out.

# <a name="dashboard"></a>Dashboard

The dashboard is the home page of the DC/OS web interface and provides an overview of your DC/OS cluster.

![Dashboard](../img/dashboard-ee.gif)

From the dashboard you can easily monitor the health of your cluster.

*   The CPU Allocation panel provides a graph of the current percentage of available general compute units that are being used by your cluster.

*   The Memory Allocation panel provides a graph of the current percentage of available memory that is being used by your cluster.

*   The Task Failure Rate panel provides a graph of the current percentage of tasks that are failing in your cluster.

*   The Services Health panel provides an overview of the health of your services. Each service provides a healthcheck, run at intervals. This indicator shows the current status according to that healthcheck. A maximum of 5 services are displayed, sorted by priority of the most unhealthy. You can click the View all Services button for detailed information and a complete list of your services.

*   The Tasks panel provides the current number of tasks that are staged and running.

*   The Nodes panel provides a view of the nodes in your cluster.

# <a name="services"></a>Services

The Services tab provides a full featured interface to the native DC/OS Marathon instance.

![Services](../img/services-ee.gif)

You can click the **Deployments** tab to view all active Marathon deployments.

**Tip:** You can access the Mesos web interface at `<hostname>/mesos`.

# <a name="jobs"></a>Jobs

The Jobs tab provides native support for creating and administering scheduled jobs. You can set up jobs with a scheduler by using the cron format. For more information, see the [documentation](/docs/1.8/usage/jobs/). 

![Jobs](../img/jobs-ee.png)

# <a name="nodes"></a>Nodes

The Nodes page provides a comprehensive view of all of the nodes that are used across your cluster. You can view a graph that shows the allocation percentage rate for CPU, memory, or disk.

![Nodes](../img/nodes-ee.gif)

By default all of your nodes are displayed in **List** view, sorted by hostname. You can filter nodes by service type or hostname. You can also sort the nodes by number of tasks or percentage of CPU, memory, or disk space allocated.

You can switch to **Grid** view to see a "donuts" percentage visualization.

    ![Nodes](../img/nodes-donuts-ee.gif)

Clicking on a node opens the Nodes side panel, which provides CPU, memory, and disk usage graphs and lists all tasks on the node. Use the dropdown or a custom filter to sort tasks and click on details for more information. Click on a task listed on the Nodes side panel to see detailed information about the task’s CPU, memory, and disk usage and the task’s files and directory tree.

# <a name="network"></a>Network

The Network page provides a comprehensive view of the health of your VIPs. For more information, see the [documentation](/docs/1.8/usage/service-discovery/load-balancing-vips/virtual-ip-addresses/).

![UI Network](../img/network-2.png)

# <a name="universe"></a>Universe

The Universe page shows all of the available DC/OS services. You can install packages from the DC/OS Universe with a single click. The packages can be installed with defaults or customized directly in the web interface. 

![universe](../img/ui-universe-ee.gif)

# <a name="system"></a>System

The System page provides access to the administration controls of DC/OS. From this page you can:
 
- View the system health of your DC/OS components
- Manage your DC/OS package repositories
- Manage user access 

![system](../img/ui-system-health-ee.gif)