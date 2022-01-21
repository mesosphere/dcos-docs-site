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

    ```sh
    kubectl --kubeconfig ${CLUSTER_NAME}.conf get nodes
    ```

    The output from this command resembles the following:

    ```text
    NAME                                         STATUS   ROLES                  AGE   VERSION
    ip-10-0-102-60.eastus2.compute.internal    Ready    control-plane,master   36m   v1.21.3
    ip-10-0-118-168.eastus2.compute.internal   Ready    <none>                 42m   v1.21.3
    ip-10-0-175-114.eastus2.compute.internal   Ready    control-plane,master   44m   v1.21.3
    ip-10-0-214-26.eastus2.compute.internal    Ready    control-plane,master   40m   v1.21.3
    ip-10-0-84-17.eastus2.compute.internal     Ready    <none>                 42m   v1.21.3
    ```

1.  Export a variable with the node name to use in the next steps:

    This example uses the name `ip-10-0-118-168.eastus2.compute.internal`.

    ```sh
    export NAME_NODE_TO_DELETE="ip-10-0-118-168.eastus2.compute.internal"
    ```

1.  Delete the Machine resource

    ```sh
    NAME_MACHINE_TO_DELETE=$(kubectl --kubeconfig ${CLUSTER_NAME}.conf get machine -ojsonpath="{.items[?(@.status.nodeRef.name==\"$NAME_NODE_TO_DELETE\")].metadata.name}")
    kubectl --kubeconfig ${CLUSTER_NAME}.conf delete machine "$NAME_MACHINE_TO_DELETE"
    ```

    ```text
    machine.cluster.x-k8s.io "my-aks-cluster-md-0-7fbfb98fcf-4xcv9" deleted
    ```

    The command will not return immediately. It will return once the Machine resource has been deleted.

    A few minutes after the Machine resource is deleted, the corresponding Node resource is also deleted.

1.  Observe that the Machine resource is being replaced using this command:

    ```sh
    kubectl --kubeconfig ${CLUSTER_NAME}.conf get machinedeployment
    ```

    ```sh
    NAME               PHASE       REPLICAS   READY   UPDATED   UNAVAILABLE
    my-aks-cluster-md-0   ScalingUp   2          1       2         1
    ```

    You can see there are 2 replicas, but only 1 is ready. There's 1 unavailable replica, and the `ScalingUp` phase means a new Machine is being created.

1.  Identify the replacement Machine using this command:

    ```sh
    export NAME_NEW_MACHINE=$(kubectl --kubeconfig ${CLUSTER_NAME}.conf get machines \
        -l=cluster.x-k8s.io/deployment-name=${CLUSTER_NAME}-md-0 \
        -ojsonpath='{.items[?(@.status.phase=="Provisioning")].metadata.name}{"\n"}')
    echo "$NAME_NEW_MACHINE"
    ```

    If the output is empty, the new Machine likely exited the `Provisioning` phase and entered the `Running` phase. If this occurs, you cannot identify the replacement node using the commands in the next section. Alternately, you could inspect the output of the `kubectl --kubeconfig ${CLUSTER_NAME}.conf get nodes` command to identify the node with the newest 'AGE' field.

1.  Identify the replacement Node using this command:

    ```sh
    kubectl --kubeconfig ${CLUSTER_NAME}.conf get nodes \
        -o=jsonpath="{.items[?(@.metadata.annotations.cluster\.x-k8s\.io/machine==\"$NAME_NEW_MACHINE\")].metadata.name}"
    ```

    ```text
    ip-10-0-85-101.eastus2.compute.internal
    ```

    If the output is empty, the Node resource is not yet available, or does not yet have the expected annotation, wait a few minutes, then repeat the command.

<!--
## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

-->

[createnewcluster]: ../aa-new
[capi_book]: https://cluster-api.sigs.k8s.io/
