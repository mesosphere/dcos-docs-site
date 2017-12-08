---
layout: layout.pug
navigationTitle:  GUI
title: GUI
menuWeight: 40
excerpt:
featureMaturity:
enterprise: true
---

The DC/OS web interface provides a rich graphical view of your DC/OS cluster. With the web interface you can view the current state of your entire cluster and DC/OS services. The web interface is installed as a part of your DC/OS installation.

Additionally, there is a User Menu on the upper-left side of the web interface that includes links for documentation, CLI installation, and user sign out.

# <a name="dashboard"></a>Dashboard

The dashboard is the home page of the DC/OS web interface and provides an overview of your DC/OS cluster.

![Dashboard](/1.10/img/dashboard-ee.png)

From the dashboard you can easily monitor the health of your cluster.

*   The CPU Allocation panel provides a graph of the current percentage of available general compute units that are being used by your cluster.

*   The Memory Allocation panel provides a graph of the current percentage of available memory that is being used by your cluster.

*   The Disk Allocation panel provides a graph of the current percentage of available disk space that is being used by your cluster.

*   The Services Health panel provides an overview of the health of your services. Each service provides a health check, run at intervals. This indicator shows the current status according to that health check. A maximum of 5 services are displayed, sorted by priority of the most unhealthy. You can click the **View All <number> Services** button for detailed information and a complete list of your services.

*   The Tasks panel provides the current number of tasks that are staged and running.

*   The Component Health panel provides an overview of the health of your component. Each component provides a health check, run at intervals. This indicator shows the current status according to that health check. A maximum of 5 components are displayed, sorted by priority of the most unhealthy. You can click the **View All <number> Components** button for detailed information and a complete list of your components.

*   The Nodes panel provides a view of the nodes in your cluster.

# <a name="services"></a>Services

The Services tab provides a full-featured interface to the native DC/OS Marathon instance. This Services tab provides a comprehensive view of all of the services that you are running. You can filter services by health, status, or service name.

![Services](/1.10/img/services-ee.png)

By default, all of your services are displayed, sorted by service name. You can also sort the services by health status, CPU, memory, or disk space allocated.

*   **NAME** The DC/OS service name.
*   **STATUS** The [Marathon health check][3] status for the service.
*   **CPU** The number of CPUs in use.
*   **MEM** The amount of memory used.
*   **DISK** The amount of disk space used.

Click the service name to open the Instances panel, which provides CPU, memory, and disk usage graphs and lists all tasks using the service. Click a task listed on the Instances panel to see detailed information about the task’s CPU, memory, and disk usage and the task’s files and directory tree.

For services with a web interface, hover over the service name and click ![open service](/1.10/img/open-service.png) to view it.

**Tip:** You can access the Mesos web interface at `<hostname>/mesos`.

# <a name="jobs"></a>Jobs

The Jobs tab provides native support for creating and administering scheduled jobs. You can set up jobs with a scheduler by using the cron format. For more information, see the [documentation](/1.10/deploying-jobs/).

![Jobs](/1.10/img/jobs-ee.png)

# <a name="catalog"></a>Catalog

The Catalog tab shows all of the available DC/OS services. You can install packages from the DC/OS Catalog with a single click. The packages can be installed with defaults or customized directly in the web interface.

![Catalog](/1.10/img/catalog-ee.png)

# <a name="secrets"></a>Secrets

The Secrets tab provides secret and certificates management. For more information, see the [secrets](/1.10/security/ent/secrets/) and [certificates](/1.10/networking/tls-ssl/) documentation.

![Secrets](/1.10/img/secrets-ee.png)

# <a name="nodes"></a>Nodes

The Nodes tab provides a comprehensive view of all of the nodes that are used across your cluster. You can view a graph that shows the allocation percentage rate for CPU, memory, or disk.

![Nodes](/1.10/img/nodes-ee.png)

By default all of your nodes are displayed in **List** view, sorted by hostname. You can filter nodes by service type or hostname. You can also sort the nodes by number of tasks or percentage of CPU, memory, or disk space allocated.

You can switch to **Grid** view to see a "donuts" percentage visualization.

![Nodes](/1.10/img/nodes-donuts-ee.png)

Clicking on a node opens the Nodes side panel, which provides CPU, memory, and disk usage graphs and lists all tasks on the node. Use the dropdown or a custom filter to sort tasks and click on details for more information. Click on a task listed on the Nodes side panel to see detailed information about the task’s CPU, memory, and disk usage and the task’s files and directory tree.

# <a name="network"></a>Networking

The Networking tab provides a comprehensive view of the health of your VIPs. For more information, see the [documentation](/1.10/networking/load-balancing-vips/virtual-ip-addresses/).

![Tweeter scaled](/1.10/img/networking-ee.png)

# <a name="overview"></a>Overview

View the cluster details from the **Overview** tab.

![Overview](/1.10/img/overview-ee.png)

# Components
View the system health of your DC/OS components from the **Components** tab.

![Components](/1.10/img/components-ee.png)

# Settings
Manage your DC/OS package repositories, secrets stores, LDAP directories, and identity providers from the **Settings** tab.

![Package repositories](/1.10/img/package-repositories-ee.png)

# Organization
Manage user access from the **Organization** tab.

![All users](/1.10/img/organization-ee.png)
