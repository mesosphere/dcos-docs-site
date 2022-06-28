---
layout: layout.pug
navigationTitle: Replace a Node
title: Replace a Node
excerpt: Replace a worker node
beta: false
menuWeight: 90
---

## Prerequisites

Before you begin, you must:

- [Create a workload cluster][createnewcluster] or [create an air-gapped workload cluster][createnewairgappedcluster].

- [Make the new cluster self-managed][selfmanaged].

## Replace a worker node

In certain situations, you may want to delete a worker node and have [Cluster API][capi_book] replace it with a newly-provisioned machine.

1.  Identify the name of the node to delete.

    List the nodes:

    ```bash
    kubectl --kubeconfig ${CLUSTER_NAME}.conf get nodes
    ```

    The output from this command resembles the following:

    ```sh
    NAME                                       STATUS   ROLES                  AGE   VERSION
    d2iq-e2e-cluster-1-control-plane-7llgd     Ready    control-plane,master   20h   v1.23.7
    d2iq-e2e-cluster-1-control-plane-vncbl     Ready    control-plane,master   20h   v1.23.7
    d2iq-e2e-cluster-1-control-plane-wbgrm     Ready    control-plane,master   19h   v1.23.7
    d2iq-e2e-cluster-1-md-0-74c849dc8c-67rv4   Ready    <none>                 20h   v1.23.7
    d2iq-e2e-cluster-1-md-0-74c849dc8c-n2skc   Ready    <none>                 20h   v1.23.7
    d2iq-e2e-cluster-1-md-0-74c849dc8c-nkftv   Ready    <none>                 20h   v1.23.7
    d2iq-e2e-cluster-1-md-0-74c849dc8c-sqklv   Ready    <none>                 20h   v1.23.7
    ```

1.  Export a variable with the node name to use in the next steps:

    This example uses the name `d2iq-e2e-cluster-1-md-0-74c849dc8c-67rv4`.

    ```bash
    export NAME_NODE_TO_DELETE="d2iq-e2e-cluster-1-md-0-74c849dc8c-67rv4"
    ```

1.  Delete the Machine resource with the command:

    ```bash
    NAME_MACHINE_TO_DELETE=$(kubectl --kubeconfig ${CLUSTER_NAME}.conf get machine -ojsonpath="{.items[?(@.status.nodeRef.name==\"$NAME_NODE_TO_DELETE\")].metadata.name}")
    kubectl --kubeconfig ${CLUSTER_NAME}.conf delete machine "$NAME_MACHINE_TO_DELETE"
    ```

    ```sh
    machine.cluster.x-k8s.io "d2iq-e2e-cluster-1-md-0-74c849dc8c-67rv4" deleted
    ```

    The command does not return immediately, but it does return after the Machine resource is deleted.

    A few minutes after the Machine resource is deleted, the corresponding Node resource is also deleted.

1.  Observe the Machine resource replacement using this command:

    ```bash
    kubectl --kubeconfig ${CLUSTER_NAME}.conf get machinedeployment
    ```

    ```sh
    NAME                      CLUSTER              REPLICAS   READY   UPDATED   UNAVAILABLE   PHASE       AGE   VERSION
    d2iq-e2e-cluster-1-md-0   d2iq-e2e-cluster-1   4          3       4         1             ScalingUp   20h   v1.23.7
    ```

    In this example, there exist 4 replicas, but only 3 are ready. One replica is unavailable, and the `ScalingUp` phase means a new Machine is being created.

1.  Identify the replacement Machine using this command:

    ```bash
    export NAME_NEW_MACHINE=$(kubectl --kubeconfig ${CLUSTER_NAME}.conf get machines \
        -l=cluster.x-k8s.io/deployment-name=${CLUSTER_NAME}-md-0 \
        -ojsonpath='{.items[?(@.status.phase=="Provisioning")].metadata.name}{"\n"}')
    echo "$NAME_NEW_MACHINE"
    ```

    If the output is empty, the new Machine has probably exited the `Provisioning` phase and entered the `Running` phase.

1.  Identify the replacement Node using this command:

    ```bash
    kubectl --kubeconfig ${CLUSTER_NAME}.conf get nodes \
        -o=jsonpath="{.items[?(@.metadata.annotations.cluster\.x-k8s\.io/machine==\"$NAME_NEW_MACHINE\")].metadata.name}"
    ```

    The output should be similar to this example:

    ```sh
    d2iq-e2e-cluster-1-md-0-74c849dc8c-rc528
    ```

    If the output is empty, the Node resource is not yet available, or does not yet have the expected annotation. Wait a few minutes, then repeat the command.

<!---
## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

--->

[createnewcluster]: ../new
[createnewairgappedcluster]: ../air-gapped/new/
[selfmanaged]: ../self-managed
[capi_book]: https://cluster-api.sigs.k8s.io/
