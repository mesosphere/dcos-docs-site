---
layout: layout.pug
Delete: Delete Node Pools
title: Delete Node Pools
menuWeight: 40
excerpt: Delete node pools in a cluster
enterprise: false
---

## Delete Node Pools

Deleting a node pool deletes the Kubernetes nodes and the underlying infrastructure. All nodes will be drained prior to deletion and the pods running on those nodes will be rescheduled.

To delete a node pool from a managed cluster, run:

```bash
dkp delete nodepool ${NODEPOOL_NAME} --cluster-name=${CLUSTER_NAME}
```

Here, `example` is the node pool to be deleted.

The expected output will be similar to the following example, indicating the node pool is being deleted:

```sh
✓ Deleting default/example nodepool resources
```

Deleting an invalid node pool results in output similar to this example:

```bash
dkp delete nodepool ${CLUSTER_NAME}-md-invalid --cluster-name=${CLUSTER_NAME}
```

```sh
MachineDeployments or MachinePools.infrastructure.cluster.x-k8s.io "no MachineDeployments or MachinePools found for cluster aws-example" not found
```
