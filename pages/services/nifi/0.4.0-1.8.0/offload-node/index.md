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

<p class="message--important"><strong>IMPORTANT: </strong> It is not recommended to use offload feature as Mesosphere does not support scale down. So after offloading if you delete the node, it is not going to remove from the cluster. Although if you see cluster view in NiFi UI it will not shown but it still runs and consumes resources of your dc/os.<p>

Following are the steps for offloading node:

1. Go to `Cluster`

   <img src="../img/cluster_option.png" alt="cluster option" width="1000" border="2"/>

   Figure 1. - cluster option in NiFi UI
   <br><br><br>

   <img src="../img/cluster_view.png" alt="cluster view" width="1000" border="2"/>

   Figure 2. - cluster view in NiFi UI
   <br><br><br>
   

2. `Disconnect` node you want to offload
   
   <img src="../img/node_disconnect.png" alt="disconnect node" width="1000" border="2"/>
   
   Figure 3. - disconnect node through NiFi UI
   <br><br><br>
   

   <img src="../img/disconnect_confirmation.png" alt="disconnect node confirmation" width="1000" border="2"/>

   Figure 4. - disconnect node confirmation NiFi UI
   <br><br><br>
   

   <img src="../img/disconnected_node.png" alt="disconnect node confirmation" width="1000" border="2"/>

   Figure 5. - disconnected node in NiFi UI
   <br><br><br>


3. Select `Offload`

   <img src="../img/offload_node.png" alt="offload node" width="1000" border="2"/>

   Figure 6. - offload node in NiFi UI
   <br><br><br>
   

   <img src="../img/offload_node_confirmation.png" alt="offload node confirmation" width="1000" border="2"/>

   Figure 7. offload node cofirmation in NiFi UI
   <br><br><br>
   

   <img src="../img/offloading_node.png" alt="offloaded node" width="1000" border="2"/>

   Figure 8. offloading node in NiFi UI
   <br><br><br>
   

   <img src="../img/offloaded_node.png" alt="offloaded node" width="1000" border="2"/>

   Figure 9. offloaded node in NiFi UI
   <br><br><br>


4. Delete `offloaded` node

   <img src="../img/delete_offloaded_node.png" alt="delete node" width="1000" border="2"/>

   Figure 10. - delete offloaded node option in NiFi UI
   <br><br><br>
   

   <img src="../img/delete_offloaded_node_confirmation.png" alt="delete node" width="1000" border="2"/>

   Figure 11. - delete offloaded node option in NiFi UI
   <br><br><br>

