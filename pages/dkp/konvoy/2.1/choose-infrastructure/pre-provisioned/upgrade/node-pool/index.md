---
layout: layout.pug
navigationTitle: Update Worker Node Pool
title: Update the Worker Node Pool
excerpt: Update the worker node pool to upgrade Kubernetes and/or change machine properties
menuWeight: 10
enterprise: false
beta: false
---

## Prerequisites

Before you begin, you must:

- [Create a workload cluster][createnewcluster].

## Overview

This topic details how to update the worker node pool by updating the k8s version:

The worker node pool is described by a MachineDeployment resource, which references immutable PreprovisionedMachineTemplate and KubeadmConfigTemplate resources. This topic explains how to patch the MachineDeployment in order to update the node pool in place.

## Prepare the environment

1.  Set the environment variable to the name you assigned this cluster.

    ```sh
    CLUSTER_NAME=my-preprovisioned-cluster
    ```

    See [define infrastructure](../../define-infrastructure#name-your-cluster) for information on naming your cluster.

1.  **If your workload cluster is self-managed,** as described in [Make the New Cluster Self-Managed][makeselfmanaged], configure `kubectl` to use the kubeconfig for the cluster. **If it is not self-managed, skip this step.**

    ```sh
    export KUBECONFIG=${CLUSTER_NAME}.conf
    ```

1.  Verify that the control plane is already updated.

    ```sh
    kubectl get kubeadmcontrolplane ${CLUSTER_NAME}-control-plane
    ```

    The replicas, ready replicas, and updated replicas counts should be equal, as seen here:

    ```sh
    NAME                             INITIALIZED   API SERVER AVAILABLE   VERSION   REPLICAS   READY   UPDATED   UNAVAILABLE
    my-preprovisioned-cluster-control-plane        true          true                   v1.21.3   1          1       1
    ```

1.  Define the names of the resources.

    ```sh
    export MACHINEDEPLOYMENT_NAME=$(kubectl get machinedeployments --selector=cluster.x-k8s.io/cluster-name=${CLUSTER_NAME} -ojsonpath='{.items[0].metadata.name}')
    ```

1.  Define the name of your worker template.

    ```sh
    export WORKER_TEMPLATE=$(kubectl get PreprovisionedMachineTemplate ${CLUSTER_NAME}-md-0 -ojsonpath='{.metadata.name}')
    ```

1.  Prepare the patch files.

    ```sh
    echo '{}' > md-kubernetes-version-patch.yaml
    ```

## Prepare to update the Kubernetes version

<!-- TODO: Explain which Kubernetes versions Konvoy supports -->

<p class="message--warning"><strong>WARNING: </strong>Update the Kubernetes version of the worker node pool only if the control plane is already at the newer version.</p>

1.  Define the Kubernetes version. Use the letter `v` followed by `major.minor.patch` version.

    ```sh
    export KUBERNETES_VERSION=v1.21.6
    ```

1.  Create a patch file.

    ```sh
    cat <<EOF > md-kubernetes-version-patch.yaml
    apiVersion: cluster.x-k8s.io/v1alpha4
    kind: MachineDeployment
    spec:
      template:
        spec:
          version: ${KUBERNETES_VERSION}
      strategy:
        rollingUpdate:
          maxSurge: 0
          maxUnavailable: 0
    EOF
    ```

    <p class="message--note"><strong>NOTE: </strong>The <code>maxSurge: 0</code> configuration sets the update strategy so that an old machine is deleted before a new machine is created. This strategy is required to perform a rolling update when additional, unused machines are not available.</p>

    <p class="message--warning"><strong>WARNING: </strong>When <code>maxSurge: 0</code> is configured, an update of a one-machine worker node pool interrupts workloads running in that pool.</p>

1.  Update the MachineDeployment

    The MachineDeployment is patched to use a new Kubernetes version.

    ```sh
    kubectl get machinedeployment ${MACHINEDEPLOYMENT_NAME} --output=yaml \
      | kubectl patch --local=true -f- --patch="{\"spec\": {\"template\": {\"spec\": {\"infrastructureRef\": {\"name\": \"$WORKER_TEMPLATE\"} } } } }" --type=merge --output=yaml \
      | kubectl patch --local=true -f- --patch-file=md-kubernetes-version-patch.yaml --type=merge --output=yaml \
      | kubectl apply -f-
    ```

    ```sh
    machinedeployment.cluster.x-k8s.io/my-preprovisioned-cluster-md-0 configured
    ```

1.  Wait for the update to complete.
    When the number of replicas is equal to the number of updated replicas, the update is complete. You can check the status of the update by running the following command.

    <!-- NOTE: `kubectl wait` is the preferred solution, but cannot be used with MachineDeployment, because it does not yet have Conditions (https://github.com/kubernetes-sigs/cluster-api/pull/4625) -->

    ```sh
    kubectl get machinedeployment ${MACHINEDEPLOYMENT_NAME}
    ```

[createnewcluster]: ../../create-cluster
[makeselfmanaged]: ../../self-managed
[imagebuilder]: ../../../../image-builder
