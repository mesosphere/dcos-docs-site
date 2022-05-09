---
layout: layout.pug
Delete: Create Node Pools
title: Create Node Pools
menuWeight: 10
excerpt: Create a new node pool in a managed cluster
enterprise: false
---

Creating a node pool is useful when you need to run workloads that require machines with specific resources, such as a GPU, additional memory, or specialized network or storage hardware.

## Prepare the environment

1.  Set the environment variable to the name you assigned this cluster.

    ```bash
    export CLUSTER_NAME=aws-example
    ```

    See [Get Started with AWS][createnewcluster_name] for information on naming your cluster.

1.  If your workload cluster is self-managed, as described in [Make the New Cluster Self-Managed][makeselfmanaged], configure `kubectl` to use the kubeconfig for the cluster.

    ```bash
    export KUBECONFIG=${CLUSTER_NAME}.conf
    ```

1.  Define your node pool name.

    ```bash
    export NODEPOOL_NAME=example
    ```

## Create an AWS node pool

Create a new AWS node pool with 3 replicas using this command:

```bash
dkp create nodepool aws ${NODEPOOL_NAME} \
    --cluster-name=${CLUSTER_NAME} \
    --replicas=3
```

```sh
machinedeployment.cluster.x-k8s.io/example created
⠈⠁ Creating default/example nodepool resources awsmachinetemplate.infrastructure.cluster.x-k8s.io/example created
⠈⠑ Creating default/example nodepool resources kubeadmconfigtemplate.bootstrap.cluster.x-k8s.io/example created
 ✓ Creating default/example nodepool resources
```

This example uses default values for brevity. Use flags to define custom instance types, AMIs, and other properties.

Advanced users can use a combination of the `--dry-run` and `--output=yaml` flags to get a complete set of node pool objects to modify locally or store in version control.

[makeselfmanaged]: ../../advanced/self-managed
[createnewcluster]: ../../advanced/new
[createnewcluster_name]: ../../advanced/new/index.md#create-a-new-aws-kubernetes-cluster
