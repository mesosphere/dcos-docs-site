---
layout: layout.pug
navigationTitle: Update Control Plane
title: Update the Control Plane
excerpt: Update the control plane to upgrade Kubernetes and/or change machine properties
menuWeight: 0
---

## Prerequisites

Before you begin, you must:

- [Create a workload cluster][createnewcluster].

## Overview

You may have many reasons to update the control plane. This topic covers one of the most common:

1. To upgrade the Kubernetes version.

The control plane is described by a KubeadmControlPlane resource. This references an immutable AzureMachineTemplate resource. This topic explains how to patch the KubeadmControlPlane in order to update the control plane.

## Prepare the environment

1.  Set the environment variable to the name you assigned this cluster.

    ```bash
    CLUSTER_NAME=my-azure-cluster
    ```

    See [Get Started with Azure][createnewcluster_name] for information on naming your cluster.

1.  If your workload cluster is self-managed, as described in [Make the New Cluster Self-Managed][makeselfmanaged], configure `kubectl` to use the kubeconfig for the cluster.

    ```bash
    export KUBECONFIG=${CLUSTER_NAME}.conf
    ```

1.  Verify that the control plane is ready to be updated.

    ```bash
    kubectl get kubeadmcontrolplane ${CLUSTER_NAME}-control-plane
    ```

    The replicas, ready replicas, and updated replicas counts should be equal, as seen here:

    ```sh
    NAME                             INITIALIZED   API SERVER AVAILABLE   VERSION   REPLICAS   READY   UPDATED   UNAVAILABLE
    my-azure-cluster-control-plane        true          true                   v1.21.6   3          3       3
    ```

1.  Define the names of the resources.

    ```bash
    export KUBEADMCONTROLPLANE_NAME=$(kubectl get kubeadmcontrolplanes --selector=cluster.x-k8s.io/cluster-name=${CLUSTER_NAME} -ojsonpath='{.items[0].metadata.name}')
    export CURRENT_TEMPLATE_NAME=$(kubectl get kubeadmcontrolplanes ${KUBEADMCONTROLPLANE_NAME} -ojsonpath='{.spec.machineTemplate.infrastructureRef.name}')
    export NEW_TEMPLATE_NAME=${KUBEADMCONTROLPLANE_NAME}-v1216
    ```

1.  Prepare the patch file.

    ```bash
    echo '{}' > control-plane-kubernetes-version-patch.yaml
    ```

## Prepare to update the Kubernetes version

<!-- TODO: Explain which Kubernetes versions Konvoy supports -->

1.  Verify that the Kubernetes version has a compatible machine image

    If you use a custom image built with your own tooling, follow the tooling documentation to verify the image's Kubernetes version.

    If you do not use a custom machine image, Konvoy uses an Ubuntu 18.04 default machine image. Check that a default machine image is available for the Kubernetes version in [Azure][azuredefaultmachineimages].

    <p class="message--warning"><strong>WARNING: </strong>If the machine image used in this step is not built for the Kubernetes version used in the previous step, the control plane machines will be unable to join the cluster.</p>

1.  Define the Kubernetes version. Use the letter `v` followed by `major.minor.patch` version.

    ```bash
    export KUBERNETES_VERSION=v1.21.6
    ```

1.  Create a patch file.

    ```yaml
    cat <<EOF > control-plane-kubernetes-version-patch.yaml
    apiVersion: controlplane.cluster.x-k8s.io/v1alpha4
    kind: KubeadmControlPlane
    spec:
      version: ${KUBERNETES_VERSION}
    EOF
    ```

## Apply all prepared updates

1.  Update the KubeadmControlPlane

    The KubeadmControlPlane is patched to reference the new AzureMachineTemplate created in the previous step, and to use a new Kubernetes version, if one was provided.

    <p class="message--note"><strong>NOTE: </strong>Patching the KubeadmControlPlane starts the control plane update. Machines with updated properties are created, and machines with out-of-date properties are deleted. The update is "rolling." New machines replace old machines one at a time. The update waits for each new machine to successfully join the control plane. Regardless of the specified replica count the update works the same way.

    ```bash
    kubectl get kubeadmcontrolplane ${KUBEADMCONTROLPLANE_NAME} --output=yaml \
      | kubectl patch --local=true -f- --patch="{\"spec\": {\"machineTemplate\": {\"infrastructureRef\": {\"name\": \"$NEW_TEMPLATE_NAME\"} } } }" --type=merge --output=yaml \
      | kubectl patch --local=true -f- --patch-file=control-plane-kubernetes-version-patch.yaml --type=merge --output=yaml \
      | kubectl apply -f-
    ```

    ```sh
    kubeadmcontrolplane.controlplane.cluster.x-k8s.io/my-azure-cluster-control-plane configured
    ```

1.  Wait for the update to complete.

    When the condition `Ready` is true, the update is complete.

    ```bash
    kubectl wait --timeout=10m kubeadmcontrolplane ${KUBEADMCONTROLPLANE_NAME} --for=condition=Ready
    ```

<!--
## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

-->

[createnewcluster]: ../../new
[createnewcluster_name]: ../../new/index.md#create-a-new-azure-kubernetes-cluster
[makeselfmanaged]: ../../self-managed
[azuredefaultmachineimages]: https://capz.sigs.k8s.io/topics/custom-images.html?highlight=images#reference-images
[imagebuilder]: ../../../../../image-builder
