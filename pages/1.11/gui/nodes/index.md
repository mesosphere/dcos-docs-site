---
layout: layout.pug
navigationTitle:  Nodes
title: Nodes
menuWeight: 5
excerpt: Using the Nodes menu
---

The Nodes menu provides a comprehensive view of all of the nodes that are used across your cluster. You can view a graph that shows the allocation percentage rate for CPU, memory, or disk.

![Nodes](/1.11/img/nodes-ee.png)

Figure 1. Nodes list view

By default, all of your nodes are displayed in **List** view, sorted by hostname. You can filter nodes by service type or hostname. You can also sort the nodes by number of tasks or percentage of CPU, memory, or disk space allocated.

You can switch to **Grid** view to see a "donuts" percentage visualization.

![Nodes](/1.11/img/nodes-donuts-ee.png)

Figure 2. Nodes grid view

Clicking on a node opens the Nodes side panel, which provides CPU, memory, and disk usage graphs and lists all tasks on the node. Use the dropdown or a custom filter to sort tasks and click on details for more information. Click on a task listed on the Nodes side panel to see detailed information about the task’s CPU, memory, and disk usage and the task’s files and directory tree.

![Nodes Details](/1.11/img/nodes-details.png)

Figure 3. Nodes > Details
