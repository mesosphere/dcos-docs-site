---
layout: layout.pug
navigationTitle: Update Control Plane
title: Update the Control Plane
excerpt: Update the control plane to upgrade Kubernetes and/or change machine properties
menuWeight: 5
enterprise: false
beta: true
---

## Prerequisites

Before you begin, you must:

- [Create a workload cluster][createnewcluster].

## Overview

There are many reasons to update the control plane. This topic covers three of the most common:

1. To upgrade the Kubernetes version.

The control plane is described by a KubeadmControlPlane resource. This topic explains how to patch the KubeadmControlPlane in order to update the control plane.

## Prepare the environment

1.  Set the environment variable to the name you assigned this cluster.

    ```sh
    CLUSTER_NAME=my-preprovisioned-cluster
    ```

    See [define infrastructure](../../define-infrastructure#name-your-cluster) for information on naming your cluster.

1.  **If your workload cluster is self-managed,** as described in [Make the New Cluster Self-Managed][makeselfmanaged], configure `kubectl` to use the kubeconfig for the cluster. **If it's not self-managed, skip this step.**

    ```sh
    export KUBECONFIG=${CLUSTER_NAME}.conf
    ```

1.  Verify that the control plane is ready to be updated.

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
    export KUBEADMCONTROLPLANE_NAME=$(kubectl get kubeadmcontrolplanes --selector=cluster.x-k8s.io/cluster-name=${CLUSTER_NAME} -ojsonpath='{.items[0].metadata.name}')
    ```

1.  Prepare the patch files.

    ```sh
    echo '{}' > control-plane-kubernetes-version-patch.yaml
    ```

## Prepare to update the Kubernetes version

<!-- TODO: Explain which Kubernetes versions Konvoy supports -->

1.  Define the Kubernetes version. Use the letter `v` followed by `major.minor.patch` version.

    ```sh
    export KUBERNETES_VERSION=v1.21.6
    ```

1.  Create a patch file.

    ```sh
    cat <<EOF > control-plane-kubernetes-version-patch.yaml
    apiVersion: controlplane.cluster.x-k8s.io/v1alpha4
    kind: KubeadmControlPlane
    spec:
      version: ${KUBERNETES_VERSION}
      rolloutStrategy:
        rollingUpdate:
          maxSurge: 0
    EOF
    ```

    <p class="message--note"><strong>NOTE: </strong>The `maxSurge: 0` configuration sets the update strategy so that an old machine is deleted before a new machine is created. This strategy is required to perform a rolling update when additional, unused machines are not available.</p>

    <p class="message--warning"><strong>WARNING: </strong>When `maxSurge: 0` is configured, an update of a one-machine control plane is not possible.</p>

1.  Update the KubeadmControlPlane

    The KubeadmControlPlane is patched to use a new Kubernetes version.

    <p class="message--note"><strong>NOTE: </strong>Patching the KubeadmControlPlane starts the control plane update. The control plane nodes will be drained and then cordoned from the cluster. Once this is complete, a job running Konvoy Image Builder will update the Kubernetes version for the Control Plane node in place. Finally once the update is complete, the node will rejoin the cluster with the updated version.</p>

    ```sh
    kubectl get kubeadmcontrolplane ${KUBEADMCONTROLPLANE_NAME} --output=yaml \
      | kubectl patch --local=true -f- --patch-file=control-plane-kubernetes-version-patch.yaml --type=merge --output=yaml \
      | kubectl apply -f-
    ```

    ```sh
    kubeadmcontrolplane.controlplane.cluster.x-k8s.io/my-preprovisioned-cluster-control-plane configured
    ```

1.  Wait for the update to complete.

    When the condition `Ready` is true, the update is complete.

    ```sh
    kubectl wait --timeout=30m kubeadmcontrolplane ${KUBEADMCONTROLPLANE_NAME} --for=condition=Ready
    ```

    <p class="message--note"><strong>NOTE: </strong>This may take longer than 30 minutes, depending on the size of your cluster.</p>

[createnewcluster]: ../../create-cluster
[makeselfmanaged]: ../../self-managed
[imagebuilder]: ../../../../image-builder
