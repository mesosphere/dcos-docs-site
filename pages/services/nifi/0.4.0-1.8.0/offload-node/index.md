---
layout: layout.pug
navigationTitle: Offload Node
title: Offload Node
menuWeight: 45
excerpt: DC/OS NiFi service Offload Node
featureMaturity:
enterprise: false
model: ../../data.yml
render: mustache
---

The DC/OS {{model.techName }} service supports offload node feature of {{model.techName }}. 

## Steps
Following are the steps for offloading node:

1. Go to `Cluster`

   <img src="../img/showing_cluster.png" alt="cluster option" width="1000" border="2"/>

2. `Disconnect` node you want to offload
   
   <img src="../img/showing_cluster.png" alt="cluster view" width="1000" border="2"/>

3. Select `Offload`

   <img src="../img/offload_node.png" alt="offload node " width="1000" border="2"/>

   <img src="../img/offloaded_node.png" alt="offloaded node " width="1000" border="2"/>

<p class="message--important"><strong>IMPORTANT: </strong> It is not recommended to use offload feature as Mesosphere does not support scale down. So after offloading if you delete the node, it is not going to remove from the cluster. Although if you see cluster view in NiFi UI it will not show up but it still runs and consumes resources.<p>

  <img src="../img/delete_node.png" alt="delete node" width="1000" border="2"/>
