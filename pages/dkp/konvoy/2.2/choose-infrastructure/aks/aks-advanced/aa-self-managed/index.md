---
layout: layout.pug
navigationTitle: AKS Make New Cluster Self-Managed
title: Make the New Cluster Self-Managed
menuWeight: 25
excerpt: Make the new Kubernetes cluster manage itself
enterprise: false
---

Konvoy deploys all cluster lifecycle services to a bootstrap cluster, which then deploys a workload cluster. When the workload cluster is ready, move the cluster lifecycle services to the workload cluster, which makes the workload cluster self-managed. This section describes how to make a workload cluster self-managed.

Before starting, ensure you create a workload cluster as described in [Create a New Cluster][createnewcluster].

## Make the new Kubernetes cluster manage itself

1.  Deploy cluster lifecycle services on the workload cluster:

    ```bash
    dkp create bootstrap controllers --kubeconfig ${CLUSTER_NAME}.conf
    ```

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

1.  Move the Cluster API objects from the bootstrap to the workload cluster:

    The cluster lifecycle services on the workload cluster are ready, but the workload cluster configuration is on the bootstrap cluster. The `move` command moves the configuration, which takes the form of Cluster API Custom Resource objects, from the bootstrap to the workload cluster. This process is also called a [Pivot][pivot].

    ```bash
    dkp move --to-kubeconfig ${CLUSTER_NAME}.conf
    ```

    ```sh
    INFO[2021-08-11T12:09:36-07:00] Pivot operation complete.                     src="move/move.go:154"
    INFO[2021-08-11T12:09:36-07:00] You can now view resources in the moved cluster by using the --kubeconfig flag with kubectl. For example: kubectl --kubeconfig=/home/clusteradmin/.kube/config get nodes  src="move/move.go:155"
    ```

    <p class="message--note"><strong>NOTE: </strong>To ensure only one set of cluster lifecycle services manages the workload cluster, Konvoy first pauses reconciliation of the objects on the bootstrap cluster, then creates the objects on the workload cluster. As Konvoy copies the objects, the cluster lifecycle services on the workload cluster reconcile the objects. The workload cluster becomes self-managed after Konvoy creates all the objects. If it fails, the <code>move</code> command can be safely retried.</p>

1.  Wait for the cluster control-plane to be ready:

    ```bash
    kubectl --kubeconfig ${CLUSTER_NAME}.conf wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=20m
    ```

    ```sh
    cluster.cluster.x-k8s.io/my-aks-example condition met
    ```

1.  Use the cluster lifecycle services on the workload cluster to check the workload cluster status:

    <p class="message--note"><strong>NOTE: </strong>After moving the cluster lifecycle services to the workload cluster, remember to use Konvoy with the workload cluster kubeconfig.</p>

    ```bash
    dkp describe cluster --kubeconfig ${CLUSTER_NAME}.conf -c ${CLUSTER_NAME}
    ```

    ```sh
    NAME                                                                       READY  SEVERITY  REASON  SINCE  MESSAGE
    /my-aks-cluster                                                    True                     6m37s
    ├─ClusterInfrastructure - AksCluster/my-aks-cluster              True                     13m
    ├─ControlPlane - KubeadmControlPlane/my-aks-cluster-control-plane  True                     6m37s
    │ └─3 Machines...                                                    True                     10m    See my-aks-cluster-control-plane-bmc9b, my-aks-cluster-control-plane-msftd, ...
    └─Workers
    └─MachineDeployment/my-aks-cluster-md-0                            True                     7m58s
    └─4 Machines...                                                      True                     8m10s  See my-aks-cluster-md-0-84bd8b5f5b-b8cnq, my-aks-cluster-md-0-84bd8b5f5b-j8ldg, ...
    ```

1.  Remove the bootstrap cluster, as the workload cluster is now self-managed:

    ```bash
    dkp delete bootstrap
    ```

    ```sh
    INFO[2021-06-07T14:53:36-07:00] Deleting bootstrap cluster                    src="bootstrap/bootstrap.go:182"
    ```

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

- Konvoy supports moving only one set of cluster objects from the bootstrap cluster to the workload cluster, or vice-versa.
- Konvoy only supports moving all namespaces in the cluster; Konvoy does not support migration of individual namespaces.

[bootstrap]: ../bootstrap
[pivot]: https://cluster-api.sigs.k8s.io/reference/glossary.html?highlight=pivot#pivot
[createnewcluster]: ../new
