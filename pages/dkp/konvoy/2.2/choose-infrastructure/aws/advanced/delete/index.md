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

    The bootstrap cluster will host the Cluster API controllers that reconcile the cluster objects marked for deletion:

    <p class="message--note"><strong>NOTE: </strong>To avoid using the wrong kubeconfig, the following steps use explicit kubeconfig paths and contexts.</p>

    ```bash
    dkp create bootstrap --kubeconfig $HOME/.kube/config
    ```

    ```sh
	 ✓ Creating a bootstrap cluster
	 ✓ Initializing new CAPI components
    ```

1.  Move the Cluster API objects from the workload to the bootstrap cluster:
    The cluster lifecycle services on the bootstrap cluster are ready, but the workload cluster configuration is on the workload cluster. The `move` command moves the configuration, which takes the form of Cluster API Custom Resource objects, from the workload to the bootstrap cluster. This process is also called a [Pivot][pivot].

    ```bash
	dkp move capi-resources \
		--from-kubeconfig ${CLUSTER_NAME}.conf \
		--from-context ${CLUSTER_NAME}-admin@${CLUSTER_NAME} \
		--to-kubeconfig $HOME/.kube/config \
		--to-context kind-konvoy-capi-bootstrapper
    ```

    ```sh
    ✓ Moving cluster resources
	You can now view resources in the moved cluster by using the --kubeconfig flag with kubectl. For example: kubectl --kubeconfig $HOME/.kube/config get nodes
    ```

1.  Use the cluster lifecycle services on the workload cluster to check the workload cluster status:

    ```bash
    dkp describe cluster --kubeconfig $HOME/.kube/config -c ${CLUSTER_NAME}
    ```

    ```sh
	NAME                                                            READY  SEVERITY  REASON  SINCE  MESSAGE
	Cluster/aws-example                                             True                     91s
	├─ClusterInfrastructure - AWSCluster/aws-example                True                     103s
	├─ControlPlane - KubeadmControlPlane/aws-example-control-plane  True                     91s
	│ ├─Machine/aws-example-control-plane-55jh4                     True                     102s
	│ ├─Machine/aws-example-control-plane-6sn97                     True                     102s
	│ └─Machine/aws-example-control-plane-nx9v5                     True                     102s
	└─Workers
	  └─MachineDeployment/aws-example-md-0                          True                     108s
		├─Machine/aws-example-md-0-cb9c9bbf7-hcl8z                  True                     102s
		├─Machine/aws-example-md-0-cb9c9bbf7-rtdqw                  True                     102s
		├─Machine/aws-example-md-0-cb9c9bbf7-td29r                  True                     102s
		└─Machine/aws-example-md-0-cb9c9bbf7-w64kg                  True                     102s
    ```

     <p class="message--note"><strong>NOTE: </strong>After moving the cluster lifecycle services to the workload cluster, remember to use dkp with the workload cluster kubeconfig.</p>

    Use dkp with the bootstrap cluster to delete the workload cluster.

1.  Wait for the cluster control-plane to be ready:

    ```bash
    kubectl --kubeconfig $HOME/.kube/config wait --for=condition=controlplaneready "clusters/${CLUSTER_NAME}" --timeout=20m
    ```

    ```sh
    cluster.cluster.x-k8s.io/aws-example condition met
    ```

## Delete the workload cluster

1.  Make sure your AWS credentials are up to date. Refresh the credentials using this command:

    ```bash
    dkp update bootstrap credentials aws --kubeconfig $HOME/.kube/config
    ```

1.  Delete the Kubernetes cluster and wait a few minutes:

    Before deleting the cluster, dkp deletes all Services of type LoadBalancer on the cluster. Each Service is backed by an AWS Classic ELB. Deleting the Service deletes the ELB that backs it.
    To skip this step, use the flag `--delete-kubernetes-resources=false`.

    <p class="message--note"><strong>NOTE: </strong>Do not skip this step if the VPC is managed by dkp. When dkp deletes cluster, it deletes the VPC. If the VPC has any AWS Classic ELBs, AWS does not allow the VPC to be deleted, and dkp cannot delete the cluster.</p>

    ```bash
    dkp delete cluster --cluster-name=${CLUSTER_NAME} --kubeconfig $HOME/.kube/config
    ```

    ```sh
	✓ Deleting Services with type LoadBalancer for Cluster default/azure-example
	✓ Deleting ClusterResourceSets for Cluster default/azure-example
	✓ Deleting cluster resources
	✓ Waiting for cluster to be fully deleted
	Deleted default/azure-example cluster
    ```

    After the workload cluster is deleted, delete the bootstrap cluster.

## Delete the bootstrap cluster

```bash
dkp delete bootstrap --kubeconfig $HOME/.kube/config
```
✓ Deleting bootstrap cluster
```sh

```

[pivot]: https://cluster-api.sigs.k8s.io/reference/glossary.html?highlight=pivot#pivot

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

- The Konvoy version used to create the workload cluster must match the Konvoy version used to delete the workload cluster.

[makeselfmanaged]: ../self-managed
