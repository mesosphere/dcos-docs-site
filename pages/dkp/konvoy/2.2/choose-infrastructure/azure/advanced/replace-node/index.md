---
layout: layout.pug
navigationTitle: Replace a Node
title: Replace a Node
excerpt: Replace a worker node
beta: false
menuWeight: 33
---

## Prerequisites

Before you begin, you must:

- [Create a workload cluster][createnewcluster].
- [Make the new cluster self-managed][selfmanaged].

## Replace a worker node

In certain situations, you may want to delete a worker node and have [Cluster API][capi_book] replace it with a newly provisioned machine. For Enterprise, the recommendation is at least four worker nodes. Essential, however, only requires one worker node.  DKP creates the worker nodes via CLI and will use acceptable numbers by default.

1.  Identify the name of the node to delete.

    List the nodes:

    ```bash
    kubectl --kubeconfig ${CLUSTER_NAME}.conf get nodes
    ```

    The output from this command resembles the following:

    ```sh
	NAME                                STATUS   ROLES                  AGE   VERSION
	azure-example-control-plane-ckwm4   Ready    control-plane,master   35m   v1.22.7
	azure-example-control-plane-d4fdf   Ready    control-plane,master   31m   v1.22.7
	azure-example-control-plane-qrvm9   Ready    control-plane,master   33m   v1.22.7
	azure-example-md-0-4w7gq            Ready    <none>                 33m   v1.22.7
	azure-example-md-0-6gb9k            Ready    <none>                 33m   v1.22.7
	azure-example-md-0-p2n8c            Ready    <none>                 11m   v1.22.7
	azure-example-md-0-s5zbh            Ready    <none>                 33m   v1.22.7
    ```

1.  Export a variable with the node name to use in the next steps:

    This example uses the name `azure-example-control-plane-ckwm4`.

    ```bash
    export NAME_NODE_TO_DELETE="<azure-example-control-plane-ckwm4>"
    ```

1.  Delete the Machine resource

    ```bash
    export NAME_MACHINE_TO_DELETE=$(kubectl --kubeconfig ${CLUSTER_NAME}.conf get machine -ojsonpath="{.items[?(@.status.nodeRef.name==\"$NAME_NODE_TO_DELETE\")].metadata.name}")
    kubectl --kubeconfig ${CLUSTER_NAME}.conf delete machine "$NAME_MACHINE_TO_DELETE"
    ```

    ```sh
    machine.cluster.x-k8s.io "azure-example-control-plane-slprd" deleted
    ```

    The command will not return immediately. It will return once the Machine resource has been deleted.

    A few minutes after the Machine resource is deleted, the corresponding Node resource is also deleted.

1.  Observe that the Machine resource is being replaced using this command:

    ```bash
    kubectl --kubeconfig ${CLUSTER_NAME}.conf get machinedeployment
    ```

    ```sh
	NAME                 CLUSTER         REPLICAS   READY   UPDATED   UNAVAILABLE   PHASE       AGE     VERSION
	azure-example-md-0   azure-example   4          3       4         1             ScalingUp   7m30s   v1.22.7
	long-running-md-0    long-running    4          4       4         0             Running     7m28s   v1.22.7
    ```

    In this example, there are two replicas, but only 1 is ready. One replica is unavailable, and the `ScalingUp` phase means a new Machine is being created.

1.  Identify the replacement Machine using this command:

    ```bash
    export NAME_NEW_MACHINE=$(kubectl --kubeconfig ${CLUSTER_NAME}.conf get machines \
        -l=cluster.x-k8s.io/deployment-name=${CLUSTER_NAME}-md-0 \
        -ojsonpath='{.items[?(@.status.phase=="Running")].metadata.name}{"\n"}')
    echo $NAME_NEW_MACHINE
    ```
	```sh
	azure-example-md-0-d67567c8b-2674r azure-example-md-0-d67567c8b-n276j azure-example-md-0-d67567c8b-pzg8k azure-example-md-0-d67567c8b-z8km9
	```
	
    If the output is empty, the new Machine has probably exited the `Provisioning` phase and entered the `Running` phase.

1.  Identify the replacement Node using this command:

    ```bash
    kubectl --kubeconfig ${CLUSTER_NAME}.conf get nodes
    ```

    ```sh
    NAME                                STATUS   ROLES                  AGE     VERSION
	azure-example-control-plane-d4fdf   Ready    control-plane,master   43m     v1.22.7
	azure-example-control-plane-qrvm9   Ready    control-plane,master   45m     v1.22.7
	azure-example-control-plane-tz56m   Ready    control-plane,master   8m22s   v1.22.7
	azure-example-md-0-4w7gq            Ready    <none>                 45m     v1.22.7
	azure-example-md-0-6gb9k            Ready    <none>                 45m     v1.22.7
	azure-example-md-0-p2n8c            Ready    <none>                 22m     v1.22.7
	azure-example-md-0-s5zbh            Ready    <none>                 45m     v1.22.7
    ```

    If the output is empty, the Node resource is not yet available, or does not yet have the expected annotation. Wait a few minutes, then repeat the command.

<!--
## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

-->

[createnewcluster]: ../new
[selfmanaged]: ../self-managed
[capi_book]: https://cluster-api.sigs.k8s.io/
