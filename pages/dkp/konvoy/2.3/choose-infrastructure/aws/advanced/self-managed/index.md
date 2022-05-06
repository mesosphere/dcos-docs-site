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
    dkp create capi-components --with-aws-bootstrap-credentials=false --kubeconfig ${CLUSTER_NAME}.conf
    ```

    ```sh
	✓ Initializing new CAPI components
    ```

1.  Move the Cluster API objects from the bootstrap to the workload cluster:

    The cluster lifecycle services on the workload cluster are ready, but the workload cluster configuration is on the bootstrap cluster. The `move` command moves the configuration, which takes the form of Cluster API Custom Resource objects, from the bootstrap to the workload cluster. This process is also called a [Pivot][pivot].

    ```bash
    dkp move capi-resources --to-kubeconfig ${CLUSTER_NAME}.conf
    ```

    ```sh
     ✓ Moving cluster resources
	You can now view resources in the moved cluster by using the --kubeconfig flag with kubectl. For example: kubectl --kubeconfig=aws-example.conf get nodes
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
	NAME                                                              READY  SEVERITY  REASON  SINCE  MESSAGE
	Cluster/aws-example                                             True                     109s
	├─ClusterInfrastructure - AWSCluster/aws-example                True                     112s
	├─ControlPlane - KubeadmControlPlane/aws-example-control-plane  True                     109s
	│ ├─Machine/aws-example-control-plane-55jh4                     True                     111s
	│ ├─Machine/aws-example-control-plane-6sn97                     True                     111s
	│ └─Machine/aws-example-control-plane-nx9v5                     True                     110s
	└─Workers
	  └─MachineDeployment/aws-example-md-0                          True                     114s
		├─Machine/aws-example-md-0-cb9c9bbf7-hcl8z                  True                     111s
		├─Machine/aws-example-md-0-cb9c9bbf7-rtdqw                  True                     111s
		├─Machine/aws-example-md-0-cb9c9bbf7-t894m                  True                     111s
		└─Machine/aws-example-md-0-cb9c9bbf7-td29r                  True                     111s
    ```

1.  Remove the bootstrap cluster, as the workload cluster is now self-managed:

    ```bash
    dkp delete bootstrap
    ```

    ```sh
     ✓ Deleting bootstrap cluster
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
