---
layout: layout.pug
navigationTitle: Cluster Autoscaler
title: Cluster Autoscaler
menuWeight: 100
excerpt: Configure autoscaler for node pools
enterprise: false
---

## Cluster Autoscaler

[Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler/cloudprovider/clusterapi) provides the ability to automatically scale-up or scale-down the number of worker nodes in a cluster, based on the number of pending pods to be scheduled. Running the Cluster Autoscaler is optional.

Unlike [Horizontal-Pod Autoscaler](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#how-fast-is-hpa-when-combined-with-ca), Cluster Autoscaler does not depend on any Metrics server and does not need Prometheus or any other metrics source.

The Cluster Autoscaler looks at the following annotations on a MachineDeployment to determine its scale-up and scale-down ranges:

```sh
cluster.x-k8s.io/cluster-api-autoscaler-node-group-min-size
cluster.x-k8s.io/cluster-api-autoscaler-node-group-max-size
```

The full list of command line arguments to the Cluster Autoscaler controller is [on the Kubernetes public GitHub repository](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#what-are-the-parameters-to-ca).

For more information about how Cluster Autoscaler works, see these documents:

- [What is Cluster Autoscaler](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#what-is-cluster-autoscaler)
- [How does scale-up work](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#how-does-scale-up-work)
- [How does scale-down work](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#how-does-scale-down-work)
- [CAPI Provider for Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler/cloudprovider/clusterapi)

### Cluster Autoscaler Prerequisites

Before you begin, you must have:

- A [Bootstrap Cluster Lifecycle][bootstraplifecycle].
- [Created a new Kubernetes Cluster][createnewcluster].
- A [Self-Managed Cluster][selfmanagedcluster].

### Run Cluster Autoscaler

The Cluster Autoscaler controller runs on the workload cluster. Upon creation of the workload cluster, this controller does not have all the objects required to function correctly until after a `dkp move` is issued from the bootstrap cluster.

Run the following steps to enable Cluster Autoscaler:

1.  Ensure the Cluster Autoscaler controller is up and running (no restarts and no errors in the logs)

    ```bash
    kubectl --kubeconfig=${CLUSTER_NAME}.conf logs deployments/cluster-autoscaler cluster-autoscaler -n kube-system -f
    ```

1.  Enable Cluster Autoscaler by setting the min & max ranges

    ```bash
    kubectl --kubeconfig=${CLUSTER_NAME}.conf annotate machinedeployment ${NODEPOOL_NAME} cluster.x-k8s.io/cluster-api-autoscaler-node-group-min-size=2
    kubectl --kubeconfig=${CLUSTER_NAME}.conf annotate machinedeployment ${NODEPOOL_NAME} cluster.x-k8s.io/cluster-api-autoscaler-node-group-max-size=6
    ```

1.  The Cluster Autoscaler logs will show that the worker nodes are associated with node-groups and that pending pods are being watched.
1.  To demonstrate that it is working properly, create a large deployment which will trigger pending pods (For this example we used AWS m5.2xlarge worker nodes. If you have larger worker-nodes, you should scale up the number of replicas accordingly).

    ```yaml
    cat <<EOF | kubectl --kubeconfig=${CLUSTER_NAME}.conf apply -f -
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: busybox-deployment
      labels:
        app: busybox
    spec:
      replicas: 600
      selector:
        matchLabels:
          app: busybox
      template:
        metadata:
          labels:
            app: busybox
        spec:
          containers:
          - name: busybox
            image: busybox:latest
            command:
              - sleep
              - "3600"
            imagePullPolicy: IfNotPresent
          restartPolicy: Always
    EOF
    ```

1.  Cluster Autoscaler will scale up the number of Worker Nodes until there are no pending pods.
1.  Scale down the number of replicas for `busybox-deployment`.

    ```bash
    kubectl --kubeconfig ${CLUSTER_NAME}.conf scale --replicas=30 deployment/busybox-deployment
    ```

1.  Cluster Autoscaler starts to scale down the number of Worker Nodes after the default timeout of 10 minutes.

[bootstraplifecycle]: ../../advanced/bootstrap
[createnewcluster]: ../../advanced/new
[selfmanagedcluster]: ../../advanced/self-managed
