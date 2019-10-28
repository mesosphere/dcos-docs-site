---
layout: layout.pug
navigationTitle:  Components
title: Components
menuWeight: 9
excerpt: Using the Components menu
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

The Components tab shows you a snapshot of your DC/OS components. It displays the name and health status of your components. 

![Components](/mesosphere/dcos/2.0/img/GUI-Components-Main_View.png)

Figure 1 - Components tab

## Health checks

This screen displays the name and the health status of each component. You can filter the list by Healthy or Unhealthy components. For more information about Health Checks, see the [Health Checks documentation](/mesosphere/dcos/2.0/deploying-services/creating-services/health-checks/).

### Health report

From the Components screen, click the **Download Snapshot** button to download a health report.

## Details 

If you click on the name of one of the components in the list, you can view the details in the Components Details screen. This screen will display the health status, node, and role of each node in that componenent.

![Components detail](/mesosphere/dcos/2.0/img/GUI-Components-Detail.png)

Figure 2 - Components detail

If you click on the Node ID, you can see a summary of the node's task, and the Output status.

![Node detail](/mesosphere/dcos/2.0/img/GUI-Components-Detail-2.png)

Figure 3 - Node detail

For more information about your system components, see the [Component Management documentation](/mesosphere/dcos/2.0/administering-clusters/component-management/).
