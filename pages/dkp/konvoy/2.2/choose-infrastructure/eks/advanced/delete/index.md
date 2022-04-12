---
layout: layout.pug
navigationTitle: Delete Cluster
title: Delete Cluster
menuWeight: 40
excerpt: Delete the Kubernetes cluster and clean up your environment
enterprise: false
---

## Delete the EKS cluster

1.  Ensure your AWS credentials are up to date. Refresh the credentials using this command:

    ```bash
    dkp update bootstrap credentials aws --kubeconfig $HOME/.kube/config
    ```

1.  Delete the Kubernetes cluster and wait a few minutes:

    Before deleting the cluster, dkp deletes all Services of type LoadBalancer on the cluster. Each Service is backed by an AWS Classic ELB. Deleting the Service deletes the ELB that backs it.
    To skip this step, use the flag `--delete-kubernetes-resources=false`.

    <p class="message--note"><strong>NOTE: </strong>Do not skip this step if the VPC is managed by DKP. When DKP deletes the cluster, it deletes the VPC. If the VPC has any EKS Classic ELBs, EKS does not allow the VPC to be deleted, and DKP cannot delete the cluster.</p>

    ```bash
    dkp delete cluster --cluster-name=${CLUSTER_NAME} --kubeconfig $HOME/.kube/config
    ```

    ```sh
     ✓ Deleting Services with type LoadBalancer for Cluster default/eks-example
	 ✓ Deleting ClusterResourceSets for Cluster default/eks-example
	 ✓ Deleting cluster resources
	 ✓ Waiting for cluster to be fully deleted
	Deleted default/eks-example cluster
    ```

    After the workload cluster is deleted, delete the bootstrap cluster.

## Delete the bootstrap cluster

```bash
dkp delete bootstrap --kubeconfig $HOME/.kube/config
```

```sh
 ✓ Deleting bootstrap cluster
```

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

- The Konvoy version used to create the workload cluster must match the Konvoy version used to delete the workload cluster.

[makeselfmanaged]: ../self-managed
