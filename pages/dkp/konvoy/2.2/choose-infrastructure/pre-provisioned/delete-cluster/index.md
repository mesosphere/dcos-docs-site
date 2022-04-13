---
layout: layout.pug
navigationTitle: Delete the Cluster
title: Delete the Cluster
menuWeight: 90
excerpt: Delete the Kubernetes cluster and/or the bootstrap cluster
beta: false
enterprise: false
---

## Delete the Kubernetes cluster

If you have a need to remove the Kubernetes cluster, such as for environment cleanup, use this command:

1.  Delete the provisioned Kubernetes cluster with the command:

    ```bash
    dkp delete cluster --cluster-name=${CLUSTER_NAME}
    ```
	```sh
	✓ Deleting Services with type LoadBalancer for Cluster default/preprovisioned-example
	✓ Deleting ClusterResourceSets for Cluster default/preprovisioned-example
	✓ Deleting cluster resources
	✓ Waiting for cluster to be fully deleted
	Deleted default/preprovisioned-example cluster
	```

    This command may take a few minutes to complete:

## Delete the Kubernetes cluster and cleanup your environment

After you have moved the workload resources back to a bootstrap cluster and deleted the workload cluster, you no longer need the bootstrap cluster. You can safely delete the bootstrap cluster with this command:

1.  Delete the `kind` Kubernetes cluster:

    ```bash
    dkp delete bootstrap
    ```
	
	```sh
	✓ Deleting bootstrap cluster
	```
	
