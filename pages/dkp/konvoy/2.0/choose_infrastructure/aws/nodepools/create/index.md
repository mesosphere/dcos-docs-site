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

1.  Define your cluster name. This example uses the cluster name defined in [Create a New Cluster][createnewcluster].

    ```bash
    export CLUSTER_NAME=$(whoami)-aws-cluster
    ```

1.  If your workload cluster is self-managing, as described in [Make the New Cluster Self-Managing][makeselfmanaging], configure `kubectl` to use the kubeconfig for the cluster.

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
INFO[2021-08-02T12:16:26-07:00] Running nodepool create command               clusterName=dlipovetsky-demo managementClusterKubeconfig= namespace=default src="nodepool/create.go:264"
machinedeployment.cluster.x-k8s.io/example created
awsmachinetemplate.infrastructure.cluster.x-k8s.io/example created
kubeadmconfigtemplate.bootstrap.cluster.x-k8s.io/example created
INFO[2021-08-02T12:16:26-07:00] Created default/example nodepool          src="nodepool/create.go:318"
```

This example uses default values for brevity. Use flags to define custom instance types, AMIs, and other properties.

Advanced users can use a combination of the `--dry-run` and `--output=yaml` flags to get a complete set of node pool objects to modify locally, and/or store in version control.

[makeselfmanaging]: ../../advanced/self-managing
[createnewcluster]: ../../advanced/new
