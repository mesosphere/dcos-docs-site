---
layout: layout.pug
navigationTitle:  Nodes
title: Nodes
menuWeight: 5
excerpt: Using the Nodes page
render: mustache
model: /mesosphere/dcos/1.14/data.yml
---

The **Nodes** section provides a comprehensive view of all of the nodes that are used across your cluster. There are two tabs for this screen, **Agents** and **Masters**. By default, you will see the **Agents** tab.

![Nodes](/mesosphere/dcos/1.14/img/nodes-ee-dcos-1-12.png)

Figure 1 - Agents tab

# Agents tab
This is the default view. Also by default, all of your nodes are displayed in **List** view, sorted by health. You can filter this list by framework or service name.

![Filter list](/mesosphere/dcos/1.14/img/GUI-Nodes-Framework-Filter-Menu.png)

Figure 2 - Filter by framework

If you prefer a more graphical display, click on the icons on the right side of the screen to switch between a list and "donuts" view of the nodes.

![Nodes](/mesosphere/dcos/1.14/img/nodes-donuts-ee-dcos-1-12.png)

Figure 3 - Nodes "donut" view

# Masters tab

The **Masters** tab shows information about the masters in the cluster. You can see the leader and non-leaders in the cluster, with their corresponding IP and port, region, version, started time, and elected time.

![Nodes](/mesosphere/dcos/1.14/img/nodes-masters-ee-dcos-1-12.png)

Figure 4 - Masters tab


# Nodes instance

Clicking on a node opens the **Nodes** instance page, which provides more information about the node. You can use the Search box or the drop down filter to narrow your list. The Nodes instance page has three tabs: [Tasks](#tasks), [Health](#health), and [Details](#details). The **Tasks** tab is displayed by default.

## Tasks

![Tasks tab](/mesosphere/dcos/1.14/img/GUI-Nodes-Tasks-Tab.png)

Figure 5 - Tasks tab

The **Tasks** tab displays the following information:


| Name | Description |
|----------|-----------|
| Name |       |
| Host |       |
| Zone |       |
| Region |       |
| Status |       |
| Health |       |
| Logs |   |
| CPU |       |
| Mem |       |
| GPU |       |

A vertical line of dots in the upper right corner opens a menu which allows you to drain or deactivate a node. 

![Deactivation menu](/mesosphere/dcos/1.14/img/GUI-Nodes-Drain-Menu.png)

Figure 6 - Deactivation menu

For more information on draining nodes, see [Draining a Node](/mesosphere/dcos/1.14/administering-clusters/draining-a-node/). For more information on deactivating a node, see the documentation on how to [Shut Down and Decomission Nodes](/mesosphere/dcos/1.14/administering-clusters/delete-node/).

## Health

The **Health** tab displays the status of your node's health checks.

![Health tab](/mesosphere/dcos/1.14/img/GUI-Nodes-Health-Tab.png)

Figure 6 - **Nodes > Health** tab

You can filter this list using the **All Health Checks** drop down menu.

![All health checks menu](/mesosphere/dcos/1.14/img/GUI-Nodes-Health-Filter.png)

Figure 7 - Health checks filter

## Details

The Nodes > Details tab will show you the identification information for this node, as well as its Status and Resources.

![Details panel](/mesosphere/dcos/1.14/img/GUI-Nodes-Details-Tab.png)

Figure 8 - Nodes details tab

### Service details

If you click on the name of the service, for example, HDFS, you will see the **Nodes > Service Details** page. This will display information about the configuration, labels, Marathon configuration, and health check status.

![Nodes details page](/mesosphere/dcos/1.14/GUI-Nodes-Service-Details.png)
 
Figure 9 - Service details

#### Files tab

The Files tab for your service displays a Working Directory, which will display the Name, Permissions, Owner, Size and last Modification Date for this cluster.

![Files tab](/mesosphere/dcos/1.14/img/GUI-Nodes-Services-Files.png)

#### Logs tab

If you click on the **Logs** tab, you will see the log kept by DC/OS for your cluster. 

![Logs](/mesosphere/dcos/1.14/img/GUI-Nodes-Service-Logs.png)

Figure 8 - Logs

You can filter the results by `stderr` and `stdout` filters. To download a copy of the log, click on the down arrow on the right hand side of the menu.

For complete details on logging, see the [Logging](/mesosphere/dcos/1.14/monitoring/logging/) documentation.

### Host details

If you click on the IP address of the host, you will see the Tasks view by default.

![Nodes tasks]()

Figure 9 - Node tasks

