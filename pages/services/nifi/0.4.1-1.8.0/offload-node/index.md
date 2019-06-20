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

The DC/OS {{model.techName }} service supports the offload node feature of {{model.techName }}. 

## Steps

<p class="message--important"><strong>IMPORTANT: </strong> We do not recommend using the offload node feature, as Mesosphere does not support scaling down. After offloading, if you delete the node it will not be removed from the cluster. If you run cluster view in the NiFi GUI, the node will not be displayed, but it is still running and will consume DC/OS resources.<p>

Following are the steps for offloading node:

1. Go to `Cluster`
   <br><br>
   ![Cluster option](../img/cluster_option.png)

   Figure 1. - Cluster option in NiFi UI
   <br><br><br>

   ![Cluster view](../img/cluster_view.png)

   Figure 2. - Cluster view in NiFi UI
   <br><br><br>
   

2. `Disconnect` node you want to offload
   
   ![Disconnect node](../img/node_disconnect.png)
   
   Figure 3. - Disconnect node through NiFi UI
   <br><br><br>
   

   ![Disconnect node confirmation](../img/disconnect_confirmation.png)

   Figure 4. - Disconnect node confirmation NiFi UI
   <br><br><br>
   

   ![Disconnect node confirmation](../img/disconnected_node.png)

   Figure 5. - Disconnected node in NiFi UI
   <br><br><br>


3. Select `Offload`

   ![Offload node](../img/offload_node.png)

   Figure 6. - Offload node in NiFi UI
   <br><br><br>
   

   ![Offload node confirmation](../img/offload_node_confirmation.png)

   Figure 7. Offload node cofirmation in NiFi UI
   <br><br><br>
   

   ![Offloaded node](../img/offloading_node.png)

   Figure 8. Offloading node in NiFi UI
   <br><br><br>
   

   ![Offloaded node](../img/offloaded_node.png)

   Figure 9. Offloaded node in NiFi UI
   <br><br><br>


4. Delete `offloaded` node

   ![Delete node](../img/delete_offloaded_node.png)

   Figure 10. - Delete offloaded node option in NiFi UI
   <br><br><br>
   

   ![Delete node](../img/delete_offloaded_node_confirmation.png)

   Figure 11. - Delete offloaded node confirmation in NiFi UI
   <br><br><br>
