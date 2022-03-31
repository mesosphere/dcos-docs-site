---
layout: layout.pug
navigationTitle: Make New Cluster Self-Managed
title: Make the New Cluster Self-Managed
menuWeight: 80
excerpt: Make the new Kubernetes cluster manage itself
enterprise: false
---

Konvoy deploys all cluster lifecycle services to a bootstrap cluster, which then deploys a workload cluster. When the workload cluster is ready, move the cluster lifecycle services to the workload cluster, which is now self-managed. This guide describes how to make a workload cluster self-managed.

Before you start, make sure you have created a workload cluster, as described in [Create the Cluster][createthecluster].

## Make the new Kubernetes cluster manage itself

<p class="message--note"><strong>NOTE: </strong>If you have not already retrieved the kubeconfig after creating the cluster, use this command before proceeding: <code>dkp get kubeconfig -c ${CLUSTER_NAME} > ${CLUSTER_NAME}.conf</code>
</p>

1.  Deploy cluster lifecycle services on the workload cluster:

    ```bash
    dkp create bootstrap controllers --kubeconfig ${CLUSTER_NAME}.conf
    ```

    ```sh
    Command "controllers" is deprecated, use "dkp create capi-components" instead
    ✓ Initializing new CAPI components
    ```

2.  Move the Cluster API objects from the bootstrap to the workload cluster:

    The cluster lifecycle services on the workload cluster are ready, but the workload cluster configuration is on the bootstrap cluster. The `move` command moves the configuration, which takes the form of Cluster API Custom Resource objects, from the bootstrap to the workload cluster. This process is also called a [Pivot][pivot].

    ```bash
    dkp move --to-kubeconfig ${CLUSTER_NAME}.conf
    ```

    ```sh
    Flag --to-kubeconfig has been deprecated, use "dkp move capi-resources" instead
    Command "move" is deprecated, use "dkp move capi-resources" instead
	✓ Moving cluster resources
    You can now view resources in the moved cluster by using the --kubeconfig flag with kubectl. For example: kubectl --kubeconfig=preprovisioned-example-rhel-84.conf get nodes
    ```

    <p class="message--note"><strong>NOTE: </strong>To ensure only one set of cluster lifecycle services manages the workload cluster, Konvoy first pauses reconciliation of the objects on the bootstrap cluster, then creates the objects on the workload cluster. As Konvoy copies the objects, the cluster lifecycle services on the workload cluster reconcile the objects. The workload cluster becomes self-managed after Konvoy creates all the objects. If it fails, the <code>move</code> command can be safely retried.</p>

3.  Wait for the cluster control-plane to be ready:

    ```bash
    kubectl --kubeconfig ${CLUSTER_NAME}.conf wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=20m
    ```

    ```sh
    cluster.cluster.x-k8s.io preprovisioned-example condition met
    ```

4.  Use the cluster lifecycle services on the workload cluster to check the workload cluster status:

    <p class="message--note"><strong>NOTE: </strong>After moving the cluster lifecycle services to the workload cluster, remember to use Konvoy with the workload cluster kubeconfig.</p>

    ```bash
    dkp describe cluster --kubeconfig ${CLUSTER_NAME}.conf -c ${CLUSTER_NAME}
    ```

    ```sh
    NAME                                                                            READY  SEVERITY  REASON                           SINCE  MESSAGE
    Cluster/preprovisioned-example                                             True                                              1s
    ├─ClusterInfrastructure - PreprovisionedCluster/preprovisioned-example
    ├─ControlPlane - KubeadmControlPlane/preprovisioned-example-control-plane  True                                              1s
    │ ├─Machine/preprovisioned-example-control-plane-tnhb9                     True                                              4s
    │ ├─Machine/preprovisioned-example-control-plane-vz4hk                     True                                              4s
    │ └─Machine/preprovisioned-example-control-plane-zdgjt                     True                                              4s
    └─Workers
      └─MachineDeployment/preprovisioned-example-md-0                          True                                              9s
        └─Machine/preprovisioned-example-md-0-7bc695f54d-lzhlf                 False  Info      WaitingForClusterInfrastructure  9s     0 of 1 completed
    ```

5.  Remove the bootstrap cluster, as the workload cluster is now self-managed:

    ```bash
    dkp delete bootstrap
    ```

    ```sh
    INF  ✓ Deleting bootstrap cluster
    ```

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

- Konvoy supports moving only one set of cluster objects from the bootstrap cluster to the workload cluster, or vice-versa.
- Konvoy only supports moving all namespaces in the cluster; Konvoy does not support migration of individual namespaces.

[pivot]: https://cluster-api.sigs.k8s.io/reference/glossary.html?highlight=pivot#pivot
[createthecluster]: ../create-cluster
