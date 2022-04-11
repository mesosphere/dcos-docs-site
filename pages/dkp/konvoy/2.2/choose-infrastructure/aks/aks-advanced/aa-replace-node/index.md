---
layout: layout.pug
navigationTitle: Replace a Node
title: Replace a Node
excerpt: Replace an AKS worker node
beta: false
menuWeight: 33
---

## Prerequisites

Before you begin, you must:

- [Create a cluster][createnewcluster].

## Replace a worker node

In certain situations, you may want to delete a worker node and have [Cluster API][capi_book] replace it with a newly provisioned machine.

1.  Identify the name of the node to delete.

    List the nodes:

    ```bash
    kubectl --kubeconfig ${CLUSTER_NAME}.conf get nodes
    ```

    The output from this command resembles the following:

    ```sh
	NAME                              STATUS   ROLES   AGE   VERSION
	aks-cp6dsz8-41174201-vmss000000   Ready    agent   57m   v1.22.6
	aks-cp6dsz8-41174201-vmss000001   Ready    agent   57m   v1.22.6
	aks-cp6dsz8-41174201-vmss000002   Ready    agent   57m   v1.22.6
	aks-mp6gglj-41174201-vmss000000   Ready    agent   56m   v1.22.6
	aks-mp6gglj-41174201-vmss000001   Ready    agent   57m   v1.22.6
	aks-mp6gglj-41174201-vmss000002   Ready    agent   56m   v1.22.6
	aks-mp6gglj-41174201-vmss000003   Ready    agent   57m   v1.22.6
    ```

1.  Export a variable with the node name to use in the next steps:

    This example uses the name `aks-mp6gglj-41174201-vmss000003`.

    ```bash
    export NAME_NODE_TO_DELETE="<aks-mp6gglj-41174201-vmss000003>"
    ```

1.  Delete the Machine resource

    ```bash
    export NAME_MACHINE_TO_DELETE=$(kubectl --kubeconfig ${CLUSTER_NAME}.conf get machine -ojsonpath="{.items[?(@.status.nodeRef.name==\"$NAME_NODE_TO_DELETE\")].metadata.name}")
    kubectl --kubeconfig ${CLUSTER_NAME}.conf delete machine "$NAME_MACHINE_TO_DELETE"
    ```

    ```sh
    machine.cluster.x-k8s.io "aks-mp6gglj-41174201-vmss000003" deleted
    ```

    The command will not return immediately. It will return once the Machine resource has been deleted.

    A few minutes after the Machine resource is deleted, the corresponding Node resource is also deleted.

1.  Observe that the Machine resource is being replaced using this command:

    ```bash
    kubectl --kubeconfig ${CLUSTER_NAME}.conf get machinedeployment
    ```

    ```sh
	NAME                 CLUSTER         REPLICAS   READY   UPDATED   UNAVAILABLE   PHASE       AGE     VERSION
	azure-example-md-0   azure-example   4          3       4         1             ScalingUp   7m30s   v1.22.6
	long-running-md-0    long-running    4          4       4         0             Running     7m28s   v1.22.6
    ```

    You can see there are 2 replicas, but only 1 is ready. There's 1 unavailable replica, and the `ScalingUp` phase means a new Machine is being created.

1.  Identify the replacement Machine using this command:

    ```bash
    export NAME_NEW_MACHINE=$(kubectl --kubeconfig ${CLUSTER_NAME}.conf get machines \
        -l=cluster.x-k8s.io/deployment-name=${CLUSTER_NAME}-md-0 \
        -ojsonpath='{.items[?(@.status.phase=="Provisioning")].metadata.name}{"\n"}')
    echo "$NAME_NEW_MACHINE"
    ```

    If the output is empty, the new Machine likely exited the `Provisioning` phase and entered the `Running` phase. If this occurs, you cannot identify the replacement node using the commands in the next section. Alternately, you could inspect the output of the `kubectl --kubeconfig ${CLUSTER_NAME}.conf get nodes` command to identify the node with the newest 'AGE' field.

1.  Identify the replacement Node using this command:

    ```bash
    kubectl --kubeconfig ${CLUSTER_NAME}.conf get nodes
    ```

    ```sh
	NAME                              STATUS   ROLES   AGE   VERSION
	aks-cp6dsz8-41174201-vmss000000   Ready    agent   75m   v1.22.6
	aks-cp6dsz8-41174201-vmss000001   Ready    agent   74m   v1.22.6
	aks-cp6dsz8-41174201-vmss000002   Ready    agent   75m   v1.22.6
	aks-mp6gglj-41174201-vmss000000   Ready    agent   74m   v1.22.6
	aks-mp6gglj-41174201-vmss000001   Ready    agent   74m   v1.22.6
	aks-mp6gglj-41174201-vmss000002   Ready    agent   74m   v1.22.6
	aks-mp6gglj-41174201-vmss000003   Ready    agent   75m   v1.22.6
    ```

    If the output is empty, the Node resource is not yet available, or does not yet have the expected annotation, wait a few minutes, then repeat the command.

<!--
## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

-->

[createnewcluster]: ../aa-new
[capi_book]: https://cluster-api.sigs.k8s.io/
