---
layout: layout.pug
navigationTitle: Make New Cluster Self-Managed
title: Make the New Cluster Self-Managed
menuWeight: 75
excerpt: Make the new Kubernetes cluster manage itself
enterprise: false
---

Konvoy deploys all cluster lifecycle services to a bootstrap cluster, which then deploys a workload cluster. When the workload cluster is ready, move the cluster lifecycle services to the workload cluster, which makes the workload cluster self-managed. This section describes how to make a workload cluster self-managed.

Before starting, ensure you create a workload cluster as described in [Create a New Cluster][createnewcluster].

%%% we need vSphere-specific steps for this procedure if it is supported

## Make the new Kubernetes cluster manage itself

1.  Deploy cluster lifecycle services on the workload cluster:

    By default, `create bootstrap controllers` configures the Cluster API controllers to use the AWS credentials from your environment. We recommend you use the `--with-aws-bootstrap-credentials=false` flag to configure the Cluster API controllers of your self-managed AWS cluster to use AWS IAM Instance Profiles, instead of the AWS credentials from your environment.

    ```bash
    dkp create bootstrap controllers --with-vsphere-bootstrap-credentials=false --kubeconfig ${CLUSTER_NAME}.conf
    ```

    ```sh
    %%% need vSphere output
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
    d2iq-e2e-cluster-1/vsphere-example condition met
    ```

1.  Use the cluster lifecycle services on the workload cluster to check the workload cluster status:

    <p class="message--note"><strong>NOTE: </strong>After moving the cluster lifecycle services to the workload cluster, remember to use Konvoy with the workload cluster kubeconfig.</p>

    ```bash
    dkp describe cluster --kubeconfig ${CLUSTER_NAME}.conf -c ${CLUSTER_NAME}
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

1.  Remove the bootstrap cluster, as the workload cluster is now self-managed:

    ```bash
    dkp delete bootstrap
    ```

    ```sh
    INFO[2022-03-30T17:53:36-07:00] Deleting bootstrap cluster                    src="bootstrap/bootstrap.go:182"
    ```

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of DKP Konvoy.</p>

-   Before making a workload cluster self-managed, be sure that its control plane nodes have sufficient permissions for running Cluster API controllers.

-   DKP Konvoy supports moving only one set of cluster objects from the bootstrap cluster to the workload cluster, or vice-versa.

-   DKP Konvoy only supports moving all namespaces in the cluster; DKP does not support migration of individual namespaces.

[bootstrap]: ../bootstrap
[pivot]: https://cluster-api.sigs.k8s.io/reference/glossary.html?highlight=pivot#pivot
[createnewcluster]: ../new
