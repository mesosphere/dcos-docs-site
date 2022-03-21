---
layout: layout.pug
navigationTitle: Make New Cluster Self-Managed
title: Make the New Cluster Self-Managed
menuWeight: 25
excerpt: Make the new Kubernetes cluster manage itself
enterprise: false
---

Konvoy deploys all cluster lifecycle services to a bootstrap cluster, which then deploys a workload cluster. When the workload cluster is ready, move the cluster lifecycle services to the workload cluster, which makes the workload cluster self-managed. This section describes how to make a workload cluster self-managed.

Before starting, ensure you create a workload cluster as described in [Create a New Cluster][createnewcluster].

## Make the new Kubernetes cluster manage itself

1.  Deploy cluster lifecycle services on the workload cluster:

    By default, `create bootstrap controllers` configures the Cluster API controllers to use the AWS credentials from your environment. We recommend you use the `--with-aws-bootstrap-credentials=false` flag to configure the Cluster API controllers of your self-managed AWS cluster to use AWS IAM Instance Profiles, instead of the AWS credentials from your environment.

    ```bash
    dkp create bootstrap controllers --with-aws-bootstrap-credentials=false --kubeconfig ${CLUSTER_NAME}.conf
    ```

    ```sh
    INFO[2021-06-07T14:10:08-07:00] Initializing bootstrap controllers            src="bootstrap/controllers.go:88"
    INFO[2021-06-07T14:11:34-07:00] Created bootstrap controllers                 src="bootstrap/controllers.go:93"
    INFO[2021-06-07T14:11:34-07:00] Waiting for bootstrap controllers to be ready  src="bootstrap/controllers.go:96"
    INFO[2021-06-07T14:11:40-07:00] Bootstrap controllers are ready               src="bootstrap/controllers.go:101"
    INFO[2021-06-07T14:11:40-07:00] Initializing Tigera operator                  src="bootstrap/clusterresourceset.go:35"
    INFO[2021-06-07T14:11:41-07:00] Created Tigera operator                       src="bootstrap/clusterresourceset.go:40"
    INFO[2021-06-07T14:11:42-07:00] Initializing AWS EBS CSI CustomResourceSet    src="bootstrap/clusterresourceset.go:107"
    INFO[2021-06-07T14:11:42-07:00] Created AWS EBS CSI CustomResourceSet         src="bootstrap/clusterresourceset.go:112"
    INFO[2021-06-07T14:11:42-07:00] Initializing Cluster Autoscaler CustomResourceSet  src="bootstrap/clusterresourceset.go:180"
    INFO[2021-06-07T14:11:42-07:00] Created Cluster Autoscaler CustomResourceSet  src="bootstrap/clusterresourceset.go:185"
    ```

1.  Move the Cluster API objects from the bootstrap to the workload cluster:

    The cluster lifecycle services on the workload cluster are ready, but the workload cluster configuration is on the bootstrap cluster. The `move` command moves the configuration, which takes the form of Cluster API Custom Resource objects, from the bootstrap to the workload cluster. This process is also called a [Pivot][pivot].

    ```bash
    dkp move --to-kubeconfig ${CLUSTER_NAME}.conf
    ```

    ```bash
    INFO[2021-08-11T12:09:36-07:00] Pivot operation complete.                     src="move/move.go:154"
    INFO[2021-08-11T12:09:36-07:00] You can now view resources in the moved cluster by using the --kubeconfig flag with kubectl. For example: kubectl --kubeconfig=/home/clusteradmin/.kube/config get nodes  src="move/move.go:155"
    ```

    <p class="message--note"><strong>NOTE: </strong>To ensure only one set of cluster lifecycle services manages the workload cluster, Konvoy first pauses reconciliation of the objects on the bootstrap cluster, then creates the objects on the workload cluster. As Konvoy copies the objects, the cluster lifecycle services on the workload cluster reconcile the objects. The workload cluster becomes self-managed after Konvoy creates all the objects. If it fails, the <code>move</code> command can be safely retried.</p>

1.  Wait for the cluster control-plane to be ready:

    ```bash
    kubectl --kubeconfig ${CLUSTER_NAME}.conf wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=20m
    ```

    ```sh
    cluster.cluster.x-k8s.io/aws-example condition met
    ```

1.  Use the cluster lifecycle services on the workload cluster to check the workload cluster status:

    <p class="message--note"><strong>NOTE: </strong>After moving the cluster lifecycle services to the workload cluster, remember to use Konvoy with the workload cluster kubeconfig.</p>

    ```bash
    dkp describe cluster --kubeconfig ${CLUSTER_NAME}.conf -c ${CLUSTER_NAME}
    ```

    ```sh
    NAME                                                            READY  SEVERITY  REASON  SINCE  MESSAGE
    /aws-example                                                    True                     35s
    ├─ClusterInfrastructure - AWSCluster/aws-example                True                     4m47s
    ├─ControlPlane - KubeadmControlPlane/aws-example-control-plane  True                     36s
    │   └─3 Machine...                                              True                     4m20s
    └─Workers
        └─MachineDeployment/aws-example-md-0
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

- Before making a workload cluster self-managed, be sure that its control plane nodes have sufficient permissions for running Cluster API controllers. See [IAM Policy Configuration][iampolicies].
- Konvoy supports moving only one set of cluster objects from the bootstrap cluster to the workload cluster, or vice-versa.
- Konvoy only supports moving all namespaces in the cluster; Konvoy does not support migration of individual namespaces.

[bootstrap]: ../bootstrap
[pivot]: https://cluster-api.sigs.k8s.io/reference/glossary.html?highlight=pivot#pivot
[iampolicies]: ../../iam-policies
[createnewcluster]: ../new
