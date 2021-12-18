---
layout: layout.pug
navigationTitle: Delete Cluster
title: Delete Cluster
menuWeight: 40
excerpt: Delete the Kubernetes cluster and clean up your environment
enterprise: false
---

## Prepare to delete a self-managed workload cluster

<p class="message--note"><strong>NOTE: </strong>A self-managed workload cluster cannot delete itself. If your workload cluster is self-managed, you must create a bootstrap cluster and move the cluster lifecycle services to the bootstrap cluster before deleting the workload cluster.</p>

If you did not make your workload cluster self-managed, as described in [Make New Cluster Self-Managed][makeselfmanaged], see [Delete the workload cluster](#delete-the-workload-cluster).

1.  Create a bootstrap cluster:

    The bootstrap cluster hosts the Cluster API controllers that reconcile the cluster objects marked for deletion:

    <p class="message--note"><strong>NOTE: </strong>To avoid using the wrong kubeconfig, the following steps use explicit kubeconfig paths and contexts.</p>

    ```sh
    dkp create bootstrap --kubeconfig $HOME/.kube/config
    ```

    The output appears similar to:

    ```sh
    INFO[2021-11-23T15:54:07-08:00] Creating bootstrap cluster                    src="bootstrap/bootstrap.go:148"
    INFO[2021-11-23T15:55:01-08:00] Initializing bootstrap controllers            src="bootstrap/controllers.go:94"
    INFO[2021-11-23T15:56:05-08:00] Created bootstrap controllers                 src="bootstrap/controllers.go:106"
    INFO[2021-11-23T15:56:05-08:00] Bootstrap controllers are ready               src="bootstrap/controllers.go:110"
    INFO[2021-11-23T15:56:05-08:00] Initializing Tigera operator                  src="bootstrap/clusterresourceset.go:37"
    INFO[2021-11-23T15:56:05-08:00] Created/Updated Tigera operator               src="bootstrap/clusterresourceset.go:42"
    INFO[2021-11-23T15:56:05-08:00] Initializing AWS EBS CSI CustomResourceSet    src="bootstrap/clusterresourceset.go:95"
    INFO[2021-11-23T15:56:05-08:00] Created/Updated AWS EBS CSI CustomResourceSet  src="bootstrap/clusterresourceset.go:100"
    INFO[2021-11-23T15:56:05-08:00] Initializing Azure Disk CSI CustomResourceSet  src="bootstrap/clusterresourceset.go:102"
    INFO[2021-11-23T15:56:05-08:00] Created Azure Disk CustomResourceSet          src="bootstrap/clusterresourceset.go:107"
    INFO[2021-11-23T15:56:05-08:00] Initializing Local Volume Provisioner CustomResourceSet  src="bootstrap/clusterresourceset.go:109"
    INFO[2021-11-23T15:56:05-08:00] Created/Updated Local Volume Provisioner CustomResourceSet  src="bootstrap/clusterresourceset.go:114"
    INFO[2021-11-23T15:56:05-08:00] Initializing Cluster Autoscaler CustomResourceSet  src="bootstrap/clusterresourceset.go:181"
    INFO[2021-11-23T15:56:05-08:00] Created/Updated Cluster Autoscaler CustomResourceSet  src="bootstrap/clusterresourceset.go:186"
    INFO[2021-11-23T15:56:05-08:00] Initializing Node Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:239"
    INFO[2021-11-23T15:56:05-08:00] Created/Updated Node Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:244"
    INFO[2021-11-23T15:56:06-08:00] Initializing NVIDIA GPU Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:297"
    INFO[2021-11-23T15:56:06-08:00] Created/Updated NVIDIA GPU Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:302"
    ```

1.  Move the Cluster API objects from the workload to the bootstrap cluster:
    The cluster lifecycle services on the bootstrap cluster are ready, but the workload cluster configuration is on the workload cluster. The `move` command moves the configuration, which takes the form of Cluster API Custom Resource objects, from the workload to the bootstrap cluster. This process is also called a [Pivot][pivot].

    ```sh
    dkp move \
        --from-kubeconfig ${CLUSTER_NAME}.conf \
        --from-context konvoy-${CLUSTER_NAME}-admin@konvoy-${CLUSTER_NAME} \
        --to-kubeconfig $HOME/.kube/config \
        --to-context kind-konvoy-capi-bootstrapper
    ```

    The output appears similar to:

    ```sh
    INFO[2021-06-09T11:47:11-07:00] Running pivot command                         fromClusterKubeconfig=azure-example.conf fromClusterContext= src="move/move.go:83" toClusterKubeconfig=/home/clusteradmin/.kube/config toClusterContext=
    INFO[2021-06-09T11:47:36-07:00] Pivot operation complete.                     src="move/move.go:108"
    INFO[2021-06-09T11:47:36-07:00] You can now view resources in the moved cluster by using the --kubeconfig flag with kubectl. For example: kubectl --kubeconfig=/home/clusteradmin/.kube/config get nodes  src="move/move.go:155"
    ```

1.  Use the cluster lifecycle services on the workload cluster to check the workload cluster status:

    ```sh
    dkp describe cluster --kubeconfig $HOME/.kube/config -c ${CLUSTER_NAME}
    ```

    The output appears similar to:

    ```text
    NAME                                                                       READY  SEVERITY  REASON  SINCE  MESSAGE
    /my-azure-cluster                                                    True                     6m37s
    ├─ClusterInfrastructure - AzureCluster/my-azure-cluster              True                     13m
    ├─ControlPlane - KubeadmControlPlane/my-azure-cluster-control-plane  True                     6m37s
    │ └─3 Machines...                                                    True                     10m    See my-azure-cluster-control-plane-bmc9b, my-azure-cluster-control-plane-msftd, ...
    └─Workers
    └─MachineDeployment/my-azure-cluster-md-0                            True                     7m58s
    └─4 Machines...                                                      True                     8m10s  See my-azure-cluster-md-0-84bd8b5f5b-b8cnq, my-azure-cluster-md-0-84bd8b5f5b-j8ldg, ...
    ```

     <p class="message--note"><strong>NOTE: </strong>After moving the cluster lifecycle services to the workload cluster, remember to use dkp with the workload cluster kubeconfig.</p>

    Use dkp with the bootstrap cluster to delete the workload cluster.

1.  Wait for the cluster control-plane to be ready:

    ```sh
    kubectl --kubeconfig $HOME/.kube/config wait --for=condition=controlplaneready "clusters/${CLUSTER_NAME}" --timeout=60m
    ```

    The output appears similar to:

    ```sh
    cluster.cluster.x-k8s.io/my-azure-example condition met
    ```

## Delete the workload cluster

1.  Make sure your Azure credentials are up-to-date. Refresh the credentials using this command:

    ```sh
    dkp update bootstrap credentials azure --kubeconfig $HOME/.kube/config
    ```

1.  Delete the Kubernetes cluster and wait a few minutes:

    Before deleting the cluster, dkp deletes all Services of type LoadBalancer on the cluster.
    To skip this step, use the flag `--delete-kubernetes-resources=false`.

    ```sh
    dkp delete cluster --cluster-name=${CLUSTER_NAME} --kubeconfig $HOME/.kube/config
    ```

    The output appears similar to:

    ```sh
    INFO[2021-06-09T11:53:42-07:00] Running cluster delete command                clusterName=my-azure-example managementClusterKubeconfig= namespace=default src="cluster/delete.go:95"
    INFO[2021-06-09T11:53:42-07:00] Waiting for cluster to be fully deleted       src="cluster/delete.go:123"
    INFO[2021-06-09T12:14:03-07:00] Deleted default/my-azure-example cluster  src="cluster/delete.go:129"
    ```

    After the workload cluster is deleted, delete the bootstrap cluster.

## Delete the bootstrap cluster

```sh
dkp delete bootstrap --kubeconfig $HOME/.kube/config
```

The output appears similar to:

```sh
INFO[2021-06-09T12:15:20-07:00] Deleting bootstrap cluster                    src="bootstrap/bootstrap.go:182"
```

[pivot]: https://cluster-api.sigs.k8s.io/reference/glossary.html?highlight=pivot#pivot

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

- The Konvoy version used to create the workload cluster must match the Konvoy version used to delete the workload cluster.

[makeselfmanaged]: ../self-managed
