---
layout: layout.pug
navigationTitle: Delete Cluster
title: Delete Cluster
menuWeight: 85
excerpt: Delete the Kubernetes cluster and clean up your environment
enterprise: false
---

## Prepare to delete a self-managed workload cluster

<p class="message--note"><strong>NOTE: </strong>A self-managed workload cluster cannot delete itself. If your workload cluster is self-managed, you must create a bootstrap cluster and move the cluster lifecycle services to the bootstrap cluster before deleting the workload cluster.</p>

If you did not make your workload cluster self-managed, as described in [Make New Cluster Self-Managed][makeselfmanaged], see [Delete the workload cluster](#delete-the-workload-cluster).

1.  Create a bootstrap cluster:

    The bootstrap cluster will host the Cluster API controllers that reconcile the cluster objects marked for deletion:

    <p class="message--note"><strong>NOTE: </strong>To avoid using the wrong kubeconfig, the following steps use explicit kubeconfig paths and contexts.</p>

    ```bash
    dkp create bootstrap --kubeconfig $HOME/.kube/config
    ```

    The output resembles this example:

    ```sh
    ✓ Creating a bootstrap cluster
    ✓ Initializing new CAPI components
    ```

1.  Move the Cluster API objects from the workload to the bootstrap cluster:
    The cluster lifecycle services on the bootstrap cluster are ready, but the workload cluster configuration is on the workload cluster. The `move` command moves the configuration, which takes the form of Cluster API Custom Resource objects, from the workload to the bootstrap cluster. This process is also called a [Pivot][pivot].

    ```bash
    dkp move \
        --from-kubeconfig ${CLUSTER_NAME}.conf \
        --from-context konvoy-${CLUSTER_NAME}-admin@konvoy-${CLUSTER_NAME} \
        --to-kubeconfig $HOME/.kube/config \
        --to-context kind-konvoy-capi-bootstrapper
    ```

    ```sh
    INFO[2021-06-09T11:47:11-07:00] Running pivot command                         fromClusterKubeconfig=aws-example.conf fromClusterContext= src="move/move.go:83" toClusterKubeconfig=/home/clusteradmin/.kube/config toClusterContext=
    INFO[2021-06-09T11:47:36-07:00] Pivot operation complete.                     src="move/move.go:108"
    INFO[2021-06-09T11:47:36-07:00] You can now view resources in the moved cluster by using the --kubeconfig flag with kubectl. For example: kubectl --kubeconfig=/home/clusteradmin/.kube/config get nodes  src="move/move.go:155"
    ```

1.  Use the cluster lifecycle services on the workload cluster to check the workload cluster status:

    ```bash
    dkp describe cluster --kubeconfig $HOME/.kube/config -c ${CLUSTER_NAME}
    ```

    ```sh
    NAME                                                                READY  SEVERITY  REASON  SINCE  MESSAGE
    Cluster/d2iq-e2e-cluster_name-1                                     True                     13h
    ├─ClusterInfrastructure - VSphereCluster/d2iq-e2e-cluster_name-1    True                     13h
    ├─ControlPlane - KubeadmControlPlane/d2iq-control-plane             True                     13h
    │ ├─Machine/d2iq--control-plane-7llgd                               True                     13h
    │ ├─Machine/d2iq--control-plane-vncbl                               True                     13h
    │ └─Machine/d2iq--control-plane-wbgrm                               True                     13h
    └─Workers
        └─MachineDeployment/d2iq--md-0                                  True                     13h
        ├─Machine/d2iq--md-0-74c849dc8c-67rv4                           True                     13h
        ├─Machine/d2iq--md-0-74c849dc8c-n2skc                           True                     13h
        ├─Machine/d2iq--md-0-74c849dc8c-nkftv                           True                     13h
        └─Machine/d2iq--md-0-74c849dc8c-sqklv                           True                     13h
    ```

     <p class="message--note"><strong>NOTE: </strong>After moving the cluster lifecycle services to the workload cluster, remember to use dkp with the workload cluster kubeconfig.</p>

    Use DKP with the bootstrap cluster to delete the workload cluster.

1.  Wait for the cluster control-plane to be ready:

    ```bash
    kubectl --kubeconfig $HOME/.kube/config wait --for=condition=controlplaneready "clusters/${CLUSTER_NAME}" --timeout=60m
    ```

    The output should be similar to this example:

    ```sh
    d2iq-e2e-cluster-1-control-plane/vsphere-example condition met
    ```

## Delete the workload cluster

1.  Make sure your vSphere credentials are up-to-date. Refresh the credentials using this command:

    ```bash
    dkp update bootstrap credentials vsphere --kubeconfig $HOME/.kube/config
    ```

1.  Delete the Kubernetes cluster and wait a few minutes:

    Before deleting the cluster, DKP deletes all Services of type LoadBalancer on the cluster.

    To skip this step, use the flag `--delete-kubernetes-resources=false`.

    ```bash
    dkp delete cluster --cluster-name=${CLUSTER_NAME} --kubeconfig $HOME/.kube/config
    ```

    ```sh
    INFO[2022-03-30T11:53:42-07:00] Running cluster delete command                clusterName=d2iq-e2e-cluster-1 managementClusterKubeconfig= namespace=default src="cluster/delete.go:95"
    INFO[2022-03-30T11:53:42-07:00] Waiting for cluster to be fully deleted       src="cluster/delete.go:123"
    INFO[2022-03-30T12:14:03-07:00] Deleted default/d2iq-e2e-cluster-1 cluster  src="cluster/delete.go:129"
    ```

    After the workload cluster is deleted, delete the bootstrap cluster.

## Delete the bootstrap cluster

```bash
dkp delete bootstrap --kubeconfig $HOME/.kube/config
```

```sh
INFO[2021-06-09T12:15:20-07:00] Deleting bootstrap cluster                    src="bootstrap/bootstrap.go:182"
```

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of DKP Konvoy.</p>

- The DKP Konvoy version used to create the workload cluster must match the DKP Konvoy version used to delete the workload cluster.

[makeselfmanaged]: ../self-managed
[pivot]: https://cluster-api.sigs.k8s.io/reference/glossary.html?highlight=pivot#pivot
