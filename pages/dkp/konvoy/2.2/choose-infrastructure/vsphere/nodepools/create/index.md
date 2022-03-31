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

1.  Set the environment variable to the name you assigned this cluster with the command:

    ```bash
    export CLUSTER_NAME=my-vsphere-cluster
    ```

1.  If your workload cluster is self-managed, as described in [Make the New Cluster Self-Managed][makeselfmanaged], configure `kubectl` to use the kubeconfig for the cluster:

    ```bash
    export KUBECONFIG=${CLUSTER_NAME}.conf
    ```

1.  Define your node pool name:

    ```bash
    export NODEPOOL_NAME=example
    ```

## Create an AWS node pool

Create a new vSphere node pool with 3 replicas using this command:

```bash
dkp create nodepool vsphere ${NODEPOOL_NAME} \
  --cluster-name=${CLUSTER_NAME} \
  --network=example_network \
  --data-center=example_datacenter \
  --data-store=example_datastore \
  --folder=example_folder \
  --server=example_vsphere_api_server_url\
  --resource-pool=example_resource_pool \
  --vm-template=example_vm_template \
  --replicas=3
```

The output resembles this example:

```sh
machinedeployment.cluster.x-k8s.io/example created
vspheremachinetemplate.infrastructure.cluster.x-k8s.io/example created
kubeadmconfigtemplate.bootstrap.cluster.x-k8s.io/example created
 ✓ Creating default/example nodepool resources
```

This example uses default values for brevity. Use flags to define %%% parm1, parm2, and other properties.

Advanced users can use a combination of the `--dry-run` and `--output=yaml` flags to get a complete set of node pool objects to modify locally or store in version control.

[makeselfmanaged]: ../../self-managed/
[createnewcluster]: ../../new/
