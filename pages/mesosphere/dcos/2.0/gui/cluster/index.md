---
layout: layout.pug
navigationTitle:  Cluster
title: Cluster
menuWeight: 8
excerpt: Using the Cluster menu
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

From the UI, you can view a summary of the statistics for a single cluster or for [linked clusters](/mesosphere/dcos/2.0/administering-clusters/multiple-clusters/cluster-links/).

# Overview

To see a display of the details of your cluster configuration, click on **Cluster > Overview**.  

![Cluster Overview](/mesosphere/dcos/2.0/img/GUI-Cluster-Overview.png)

Figure 1 - Cluster Overview

This view displays General details, Mesos details, Marathon details, and information about your Bootstrap configuration. 

You can see the IP address of your cluster from the drop down menu in the upper right corner.

![Cluster menu](/mesosphere/dcos/2.0/img/GUI-Cluster-Menu.png)

Figure 2 - Cluster menu

# Linked clusters [enterprise type="inline" size="small" /]

Multiple clusters are used for isolation (for example, testing versus production), accommodating geographic distribution, and so on. DC/OS multiple cluster operations make management and access of multiple DC/OS clusters easy for both operators and users.
 
To see a display of the details of your linked clusters, click on **Linked Clusters**.


![Linked clusters](/mesosphere/dcos/2.0/img/GUI-Cluster-Linked-Clusters-Tab-Link.png)

Figure 3 - Linked clusters

For detailed information about linked clusters see the  [multiple clusters](/mesosphere/dcos/2.0/administering-clusters/multiple-clusters/cluster-links/) documentation.


