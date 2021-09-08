---
layout: layout.pug
navigationTitle: Make New Cluster Self-Managing
title: Make the New Cluster Self-Managing
menuWeight: 80
excerpt: Make the new Kubernetes cluster manage itself
enterprise: false
---

Konvoy deploys all cluster lifecycle services to a bootstrap cluster. This bootstrap cluster deploys a workload cluster. When the workload cluster is ready, move the cluster lifecycle services to the workload cluster. The workload cluster now manages its own lifecycle. This guide describes how to make a workload cluster self-managing.

Before you start, make sure you have created a workload cluster, as described in [Create the Cluster][createthecluster].

## Make the new Kubernetes cluster manage itself

1.  Deploy cluster lifecycle services on the workload cluster:

    ```sh
    dkp create bootstrap controllers --kubeconfig ${CLUSTER_NAME}.conf
    ```

    ```sh
    INFO[2021-09-06T23:15:16-05:00] Initializing bootstrap controllers            src="bootstrap/controllers.go:96"
    INFO[2021-09-06T23:16:28-05:00] Created bootstrap controllers                 src="bootstrap/controllers.go:101"
    INFO[2021-09-06T23:16:28-05:00] Waiting for bootstrap controllers to be ready  src="bootstrap/controllers.go:104"
    INFO[2021-09-06T23:22:57-05:00] Bootstrap controllers are ready               src="bootstrap/controllers.go:109"
    INFO[2021-09-06T23:22:57-05:00] Patching ClusterRoleBinding for CAPPP         src="bootstrap/controllers.go:112"
    INFO[2021-09-06T23:22:57-05:00] Initializing Tigera operator                  src="bootstrap/clusterresourceset.go:37"
    INFO[2021-09-06T23:22:58-05:00] Created Tigera operator                       src="bootstrap/clusterresourceset.go:42"
    INFO[2021-09-06T23:22:58-05:00] Initializing Calico installation              src="bootstrap/clusterresourceset.go:44"
    INFO[2021-09-06T23:22:59-05:00] Created Calico Installation                   src="bootstrap/clusterresourceset.go:49"
    INFO[2021-09-06T23:22:59-05:00] Initializing AWS EBS CSI CustomResourceSet    src="bootstrap/clusterresourceset.go:109"
    INFO[2021-09-06T23:23:00-05:00] Created AWS EBS CSI CustomResourceSet         src="bootstrap/clusterresourceset.go:114"
    INFO[2021-09-06T23:23:00-05:00] Initializing Local Volume Provisioner CustomResourceSet  src="bootstrap/clusterresourceset.go:116"
    INFO[2021-09-06T23:23:00-05:00] Created Local Volume Provisioner CustomResourceSet  src="bootstrap/clusterresourceset.go:121"
    INFO[2021-09-06T23:23:00-05:00] Initializing Cluster Autoscaler CustomResourceSet  src="bootstrap/clusterresourceset.go:181"
    INFO[2021-09-06T23:23:01-05:00] Created Cluster Autoscaler CustomResourceSet  src="bootstrap/clusterresourceset.go:186"
    INFO[2021-09-06T23:23:01-05:00] Initializing Node Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:239"
    INFO[2021-09-06T23:23:01-05:00] Created Node Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:244"
    INFO[2021-09-06T23:23:01-05:00] Initializing NVIDIA GPU Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:297"
    INFO[2021-09-06T23:23:02-05:00] Created NVIDIA GPU Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:302"
    ```

2.  Move the Cluster API objects from the bootstrap to the workload cluster:

    The cluster lifecycle services on the workload cluster are ready, but the workload cluster configuration is on the bootstrap cluster. The `move` command moves the configuration, which takes the form of Cluster API Custom Resource objects, from the bootstrap to the workload cluster. This process is also called a [Pivot][pivot].

    ```sh
    dkp move --to-kubeconfig ${CLUSTER_NAME}.conf
    ```

    ```sh
    INFO[2021-09-06T23:23:52-05:00] Checking move syntax                          fromClusterContext= fromClusterKubeconfig= src="move/move.go:84" toClusterContext= toClusterKubeconfig=preprovisioned-cluster.conf
    INFO[2021-09-06T23:23:52-05:00] Running pivot command                         fromClusterContext= fromClusterKubeconfig= src="move/move.go:129" toClusterContext= toClusterKubeconfig=preprovisioned-cluster.conf
    INFO[2021-09-06T23:24:21-05:00] Pivot operation complete.                     src="move/move.go:157"
    INFO[2021-09-06T23:24:21-05:00] You can now view resources in the moved cluster by using the --kubeconfig flag with kubectl. For example: kubectl --kubeconfig=preprovisioned-cluster.conf get nodes  src="move/move.go:158"
    ```

    <p class="message--note"><strong>NOTE: </strong>To make sure only one set of cluster lifecycle services manages the workload cluster, Konvoy first pauses reconciliation of the objects on the bootstrap cluster. Konvoy then creates the objects on the workload cluster. As Konvoy copies the objects, the cluster lifecycle services on the workload cluster reconcile them. The workload cluster becomes self-managing after Konvoy creates all the objects. The <code>move</code> command can be safely retried, if it fails.</p>

3.  Wait for the cluster control-plane to be ready:

    ```sh
    kubectl --kubeconfig ${CLUSTER_NAME}.conf wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=20m
    ```

    ```sh
    cluster.cluster.x-k8s.io preprovisioned-cluster condition met
    ```

4.  Use the cluster lifecycle services on the workload cluster to check the workload cluster status:

    <p class="message--note"><strong>NOTE: </strong>After moving the cluster lifecycle services to the workload cluster, remember to use Konvoy with the workload cluster kubeconfig.</p>

    ```sh
    dkp describe cluster --kubeconfig ${CLUSTER_NAME}.conf -c ${CLUSTER_NAME}
    ```

    ```sh
    NAME                                                                          READY  SEVERITY  REASON  SINCE  MESSAGE
    /preprovisioned-cluster                                                       True                     2m31s
    ├─ClusterInfrastructure - PreprovisionedCluster/preprovisioned-cluster
    ├─ControlPlane - KubeadmControlPlane/preprovisioned-cluster-control-plane     True                     2m31s
    │ └─3 Machines...                                                             True                     2m33s
    └─Workers
      └─MachineDeployment/preprovisioned-cluster-md-0
        └─4 Machines...                                                           True                     2m33s
    ```

5.  Remove the bootstrap cluster, as the workload cluster is now self-managing:

    ```sh
    dkp delete bootstrap
    ```

    ```sh
    INFO[2021-06-07T14:53:36-07:00] Deleting bootstrap cluster                    src="bootstrap/bootstrap.go:182"
    ```

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

- Konvoy supports moving only one set of cluster objects from the bootstrap cluster to the workload cluster, or vice-versa.
- Konvoy only supports moving all namespaces in the cluster; Konvoy does not support migration of individual namespaces.

[pivot]: https://cluster-api.sigs.k8s.io/reference/glossary.html?highlight=pivot#pivot
[createthecluster]: ../create-cluster
