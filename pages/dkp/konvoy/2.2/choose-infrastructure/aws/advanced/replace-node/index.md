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

In certain situations, you may want to delete a worker node and have [Cluster API][capi_book] replace it with a newly provisioned machine.

1.  Identify the name of the node to delete.

    List the nodes:

    ```bash
    kubectl --kubeconfig ${CLUSTER_NAME}.conf get nodes
    ```

    The output from this command resembles the following:

    ```sh
    NAME                                         STATUS   ROLES                  AGE   VERSION
	ip-10-0-100-85.us-west-2.compute.internal    Ready    <none>                 16m   v1.22.8
	ip-10-0-106-183.us-west-2.compute.internal   Ready    control-plane,master   15m   v1.22.8
	ip-10-0-158-104.us-west-2.compute.internal   Ready    control-plane,master   17m   v1.22.8
	ip-10-0-203-138.us-west-2.compute.internal   Ready    control-plane,master   16m   v1.22.8
	ip-10-0-70-169.us-west-2.compute.internal    Ready    <none>                 16m   v1.22.8
	ip-10-0-77-176.us-west-2.compute.internal    Ready    <none>                 16m   v1.22.8
	ip-10-0-96-61.us-west-2.compute.internal     Ready    <none>                 16m   v1.22.8
    ```

1.  Export a variable with the node name to use in the next steps:

    This example uses the name `ip-10-0-100-85.us-west-2.compute.internal`.

    ```bash
    export NAME_NODE_TO_DELETE="<ip-10-0-100-85.us-west-2.compute.internal>"
    ```

1.  Delete the Machine resource

    ```bash
    export NAME_MACHINE_TO_DELETE=$(kubectl --kubeconfig ${CLUSTER_NAME}.conf get machine -ojsonpath="{.items[?(@.status.nodeRef.name==\"$NAME_NODE_TO_DELETE\")].metadata.name}")
    kubectl --kubeconfig ${CLUSTER_NAME}.conf delete machine "$NAME_MACHINE_TO_DELETE"
    ```

    ```sh
	machine.cluster.x-k8s.io "aws-example-1-md-0-cb9c9bbf7-t894m" deleted
    ```

    The command will not return immediately. It will return once the Machine resource has been deleted.

    A few minutes after the Machine resource is deleted, the corresponding Node resource is also deleted.

1.  Observe that the Machine resource is being replaced using this command:

    ```bash
    kubectl --kubeconfig ${CLUSTER_NAME}.conf get machinedeployment
    ```

    ```sh
    NAME               CLUSTER       REPLICAS   READY   UPDATED   UNAVAILABLE   PHASE       AGE     VERSION
	aws-example-md-0   aws-example   4          3       4         1             ScalingUp   7m53s   v1.22.8
    ```

    In this example, there are two replicas, but only 1 is ready. One replica is unavailable, and the `ScalingUp` phase means a new Machine is being created.

1.  Identify the replacement Machine using this command:

    ```bash
    export NAME_NEW_MACHINE=$(kubectl --kubeconfig ${CLUSTER_NAME}.conf get machines \
        -l=cluster.x-k8s.io/deployment-name=${CLUSTER_NAME}-md-0 \
        -ojsonpath='{.items[?(@.status.phase=="Running")].metadata.name}{"\n"}')
    echo "$NAME_NEW_MACHINE"
    ```
	```sh
    aws-example-md-0-cb9c9bbf7-hcl8z aws-example-md-0-cb9c9bbf7-rtdqw aws-example-md-0-cb9c9bbf7-td29r aws-example-md-0-cb9c9bbf7-w64kg
    ```

    If the output is empty, the new Machine has probably exited the `Provisioning` phase and entered the `Running` phase.

1.  Identify the replacement Node using this command:

    ```bash
    kubectl --kubeconfig ${CLUSTER_NAME}.conf get nodes 
    ```

    ```sh
	NAME                                         STATUS   ROLES                  AGE   VERSION
	ip-10-0-106-183.us-west-2.compute.internal   Ready    control-plane,master   20m   v1.22.8
	ip-10-0-158-104.us-west-2.compute.internal   Ready    control-plane,master   23m   v1.22.8
	ip-10-0-203-138.us-west-2.compute.internal   Ready    control-plane,master   22m   v1.22.8
	ip-10-0-70-169.us-west-2.compute.internal    Ready    <none>                 22m   v1.22.8
	ip-10-0-77-176.us-west-2.compute.internal    Ready    <none>                 22m   v1.22.8
	ip-10-0-86-58.us-west-2.compute.internal     Ready    <none>                 57s   v1.22.8
	ip-10-0-96-61.us-west-2.compute.internal     Ready    <none>                 22m   v1.22.8
    ```

    If the output is empty, the Node resource is not yet available, or does not yet have the expected annotation. Wait a few minutes, then repeat the command.

<!--
## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

-->

[createnewcluster]: ../new
[selfmanaged]: ../self-managed
[capi_book]: https://cluster-api.sigs.k8s.io/
