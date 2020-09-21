---
layout: layout.pug
navigationTitle: Offload Node
title: Offload Node
menuWeight: 36
excerpt: DC/OS NiFi service Offload Node feature
featureMaturity:
enterprise: false
model: /mesosphere/dcos/services/nifi/data.yml
render: mustache

---

Although DC/OS {{ model.techName }} supports the offload-node feature of {{ model.techName }}, we do not recommend using this feature because DC/OS does not support scaling down.

<p class="message--warning"><strong>WARNING: </strong>After offloading, even if you delete the node, it will not be removed from the cluster. If you run cluster view in the {{ model.techName }} UI, the node will not be displayed, <strong>but it is still running and will consume DC/OS resources</strong>.<p>

To offload a node:

1. Go to **Cluster**.

    ![Cluster option](../img/cluster_option.png)

    Figure 1 - Cluster option in {{ model.techName }} UI

    ![Cluster view](../img/cluster_view.png)

    Figure 2 - Cluster view in {{ model.techName }} UI
    
1. Disconnect node you want to offload:
    
    ![Disconnect node](../img/node_disconnect.png)
    
    Figure 3 - Disconnect node through {{ model.techName }} UI
    
    ![Disconnect node confirmation](../img/disconnect_confirmation.png)

    Figure 4 - Disconnect node confirmation {{ model.techName }} UI

    ![Disconnect node confirmation](../img/disconnected_node.png)

    Figure 5 - Disconnected node in {{ model.techName }} UI

1. Select `Offload`.

    ![Offload node](../img/offload_node.png)

    Figure 6 - Offload node in {{ model.techName }} UI
    
    ![Offload node confirmation](../img/offload_node_confirmation.png)

    Figure 7 - Offload node cofirmation in {{ model.techName }} UI

    ![Offloaded node](../img/offloading_node.png)

    Figure 8 - Offloading node in {{ model.techName }} UI

    ![Offloaded node](../img/offloaded_node.png)

    Figure 9 - Offloaded node in {{ model.techName }} UI

1. Delete `offloaded` node.

    ![Delete node](../img/delete_offloaded_node.png)

    Figure 10 - Delete offloaded node option in {{ model.techName }} UI

    ![Delete node](../img/delete_offloaded_node_confirmation.png)

    Figure 11 - Delete offloaded node confirmation in {{ model.techName }} UI
    