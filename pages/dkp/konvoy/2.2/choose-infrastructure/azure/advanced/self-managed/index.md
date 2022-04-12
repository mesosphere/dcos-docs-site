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

    ```bash
    dkp create capi-components --kubeconfig ${CLUSTER_NAME}.conf
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
	You can now view resources in the moved cluster by using the --kubeconfig flag with kubectl. For example: kubectl --kubeconfig=azure-example.conf get nodes
    ```

    <p class="message--note"><strong>NOTE: </strong>To ensure only one set of cluster lifecycle services manages the workload cluster, Konvoy first pauses reconciliation of the objects on the bootstrap cluster, then creates the objects on the workload cluster. As Konvoy copies the objects, the cluster lifecycle services on the workload cluster reconcile the objects. The workload cluster becomes self-managed after Konvoy creates all the objects. If it fails, the <code>move</code> command can be safely retried.</p>

1.  Wait for the cluster control-plane to be ready:

    ```bash
    kubectl --kubeconfig ${CLUSTER_NAME}.conf wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=20m
    ```

    ```sh
    cluster.cluster.x-k8s.io/azure-example condition met
    ```

1.  Use the cluster lifecycle services on the workload cluster to check the workload cluster status:

    <p class="message--note"><strong>NOTE: </strong>After moving the cluster lifecycle services to the workload cluster, remember to use Konvoy with the workload cluster kubeconfig.</p>

    ```bash
    dkp describe cluster --kubeconfig ${CLUSTER_NAME}.conf -c ${CLUSTER_NAME}
    ```

    ```sh
	NAME                                                              READY  SEVERITY  REASON  SINCE  MESSAGE
	Cluster/azure-example                                             True                     55s           
	├─ClusterInfrastructure - AzureCluster/azure-example              True                     67s           
	├─ControlPlane - KubeadmControlPlane/azure-example-control-plane  True                     55s           
	│ ├─Machine/azure-example-control-plane-67f47                     True                     58s           
	│ ├─Machine/azure-example-control-plane-7pllh                     True                     65s           
	│ └─Machine/azure-example-control-plane-jtfgv                     True                     65s           
	└─Workers                                                                                                 
	  └─MachineDeployment/azure-example-md-0                          True                     67s           
        ├─Machine/azure-example-md-0-f9cb9c79b-6nsb9                  True                     59s           
        ├─Machine/azure-example-md-0-f9cb9c79b-jxwl6                  True                     58s           
        ├─Machine/azure-example-md-0-f9cb9c79b-ktg7z                  True                     59s           
        └─Machine/azure-example-md-0-f9cb9c79b-nxcm2                  True                     66s           
    ```

1.  Remove the bootstrap cluster, as the workload cluster is now self-managed:

    ```bash
    dkp delete bootstrap --kubeconfig $HOME/.kube/config
    ```

    ```sh
	✓ Deleting bootstrap cluster
    ```

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

- Konvoy supports moving only one set of cluster objects from the bootstrap cluster to the workload cluster, or vice-versa.
- Konvoy only supports moving all namespaces in the cluster; Konvoy does not support migration of individual namespaces.

[bootstrap]: ../bootstrap
[pivot]: https://cluster-api.sigs.k8s.io/reference/glossary.html?highlight=pivot#pivot
[createnewcluster]: ../new
