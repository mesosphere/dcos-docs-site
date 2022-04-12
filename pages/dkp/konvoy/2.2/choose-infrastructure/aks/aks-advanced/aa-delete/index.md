---
layout: layout.pug
navigationTitle: Delete Cluster
title: Delete Cluster
menuWeight: 40
excerpt: Delete the AKS cluster and clean up your environment
enterprise: false
---

## Delete the workload cluster

1.  Delete the Kubernetes cluster and wait a few minutes:

    Before deleting the cluster, DKP deletes all Services of type LoadBalancer on the cluster. Deleting the Service deletes the Azure LoadBalancer that backs it.
    To skip this step, use the flag `--delete-kubernetes-resources=false`.

    <p class="message--note"><strong>NOTE: </strong>Do not skip this step if the Azure Network is managed by DKP. When DKP deletes cluster, it deletes the Network.</p>

    ```bash
    dkp delete cluster --cluster-name=${CLUSTER_NAME} --kubeconfig $HOME/.kube/config
    ```

    ```sh
     ✓ Deleting Services with type LoadBalancer for Cluster default/aks-example
	 ✓ Deleting ClusterResourceSets for Cluster default/aks-example
	 ✓ Deleting cluster resources
	 ✓ Waiting for cluster to be fully deleted
	Deleted default/aks-example cluster
    ```

## Delete the bootstrap cluster

After you have moved the workload resources back to a bootstrap cluster and deleted the workload cluster, you no longer need the bootstrap cluster. You can safely delete the bootstrap cluster with this command:

```bash
dkp delete bootstrap --kubeconfig $HOME/.kube/config
```

```sh
✓ Deleting bootstrap cluster
```

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

- The Konvoy version used to create the workload cluster must match the Konvoy version used to delete the workload cluster.
