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
    dkp create capi-components --kubeconfig ${CLUSTER_NAME}.conf
    ```

    ```sh
    ✓ Upgrading CAPI components
	✓ Waiting for CAPI components to be upgraded
	✓ Initializing new CAPI components
    ```

2.  Move the Cluster API objects from the bootstrap to the workload cluster:

    The cluster lifecycle services on the workload cluster are ready, but the workload cluster configuration is on the bootstrap cluster. The `move` command moves the configuration, which takes the form of Cluster API Custom Resource objects, from the bootstrap to the workload cluster. This process is also called a [Pivot][pivot].

    ```bash
    dkp move capi-resources --to-kubeconfig ${CLUSTER_NAME}.conf
    ```

    ```sh
	✓ Moving cluster resources
    You can now view resources in the moved cluster by using the --kubeconfig flag with kubectl. For example: kubectl --kubeconfig=preprovisioned-example.conf get nodes
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
	NAME                                                                       READY  SEVERITY  REASON  SINCE  MESSAGE
	Cluster/preprovisioned-example                                             True                     2m31s         
	├─ClusterInfrastructure - PreprovisionedCluster/preprovisioned-example                                            
	├─ControlPlane - KubeadmControlPlane/preprovisioned-example-control-plane  True                     2m31s         
	│ ├─Machine/preprovisioned-example-control-plane-6g6nr                     True                     2m33s         
	│ ├─Machine/preprovisioned-example-control-plane-8lhcv                     True                     2m33s         
	│ └─Machine/preprovisioned-example-control-plane-kk2kg                     True                     2m33s         
	└─Workers                                                                                                
	  └─MachineDeployment/preprovisioned-example-md-0                          True                     2m34s         
		└─Machine/preprovisioned-example-md-0-77f667cd9-tnctd                  True                     2m33s  
    ```

5.  Remove the bootstrap cluster, as the workload cluster is now self-managed:

    ```bash
    dkp delete bootstrap 
    ```

    ```sh
    ✓ Deleting bootstrap cluster
    ```

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

- Konvoy supports moving only one set of cluster objects from the bootstrap cluster to the workload cluster, or vice-versa.
- Konvoy only supports moving all namespaces in the cluster; Konvoy does not support migration of individual namespaces.

[pivot]: https://cluster-api.sigs.k8s.io/reference/glossary.html?highlight=pivot#pivot
[createthecluster]: ../create-cluster
