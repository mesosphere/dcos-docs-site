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

There are many reasons to update the control plane. This topic covers three of the most common:

1. To upgrade the Kubernetes version.
1. To update the machine image (AMI).
1. To update the machine hardware (instance type).

The control plane is described by a KubeadmControlPlane resource. This references an immutable AWSMachineTemplate resource. This topic explains how to create a new AWSMachineTemplate and patch the KubeadmControlPlane in order to update the control plane.

## Prepare the environment

1.  Define your cluster name. This example uses the cluster name defined in [Create a New Cluster][createnewcluster].

    ```bash
    export CLUSTER_NAME=$(whoami)-aws-cluster
    ```

1.  If your workload cluster is self-managing, as described in [Make the New Cluster Self-Managing][makeselfmanaging], configure `kubectl` to use the kubeconfig for the cluster.

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
    aws-example-control-plane        true          true                   v1.21.3   1          1       1
    ```

1.  Define the names of the resources.

    ```bash
    export KUBEADMCONTROLPLANE_NAME=$(kubectl get kubeadmcontrolplanes --selector=cluster.x-k8s.io/cluster-name=${CLUSTER_NAME} -ojsonpath='{.items[0].metadata.name}')
    export CURRENT_TEMPLATE_NAME=$(kubectl get kubeadmcontrolplanes ${KUBEADMCONTROLPLANE_NAME} -ojsonpath='{.spec.machineTemplate.infrastructureRef.name}')
    export NEW_TEMPLATE_NAME=${KUBEADMCONTROLPLANE_NAME}-$(([[ $OSTYPE == 'darwin'* ]] && uuidgen || cat /proc/sys/kernel/random/uuid) | head -c4 | tr "[:upper:]" "[:lower:]")
    ```

1.  Prepare the patch files.

    ```bash
    echo '{}' > control-plane-machine-image-patch.yaml
    echo '{}' > control-plane-machine-type-patch.yaml
    echo '{}' > control-plane-kubernetes-version-patch.yaml
    ```

## Prepare to update the Kubernetes version

<!-- TODO: Explain which Kubernetes versions Konvoy supports -->

If you do not want to update the Kubernetes version, go to the [next section](#prepare-to-update-the-machine-image).

1.  Verify that the Kubernetes version has a compatible machine image

    If you use a custom image built with your own tooling, follow the tooling documentation to verify the image's Kubernetes version.

    If you use a custom image built with [Konvoy Image Builder][imagebuilder], the image's Kubernetes version is written to the `kubernetes_version` tag.

    If you do not use a custom machine image, Konvoy uses an Ubuntu 18.04 default machine image. Check that a default machine image is available for the Kubernetes version in [AWS][awsdefaultmachineimages].

    <p class="message--warning"><strong>WARNING: </strong>If the machine image used in this step is not built for the Kubernetes version used in the previous step, the control plane machines will be unable to join the cluster.</p>

1.  Define the Kubernetes version. Use the letter `v` followed by `major.minor.patch` version.

    ```bash
    export KUBERNETES_VERSION=v1.21.3
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

## Prepare to update the machine image

If you do not want to update the machine image, go to the [next section](#prepare-to-update-the-instance-type).

1.  Ensure the machine image is built for the Kubernetes version.

    If you use a custom image built with your own tooling, follow the tooling documentation to verify the image's Kubernetes version.

    If you use a custom image built with [Konvoy Image Builder][imagebuilder], the image's Kubernetes version is written to the `kubernetes_version` tag.

    If you do not use a custom machine image, Konvoy uses an Ubuntu 18.04 default machine image. Check that a default machine image is available for the Kubernetes version in [AWS][awsdefaultmachineimages].

    <p class="message--warning"><strong>WARNING: </strong>If the machine image used in this step is not built for the Kubernetes version used in the previous step, the control plane machines will be unable to join the cluster.</p>

1.  Define the machine image identifier.

    ```bash
    export AMI_ID=ami-my-identifier
    ```

1.  Create a patch file.

    ```yaml
    cat <<EOF > control-plane-machine-image-patch.yaml
    apiVersion: infrastructure.cluster.x-k8s.io/v1alpha4
    kind: AWSMachineTemplate
    spec:
      template:
        spec:
          ami:
            id: ${AMI_ID}
    EOF
    ```

## Prepare to update the instance type

If you do not want to update the instance type, go to the [next section](#apply-all-prepared-updates).

1.  Define the instance type, using an instance type that is valid for the region.

    ```bash
    export INSTANCE_TYPE=m5.large
    ```

1.  Create a patch file.

    ```yaml
    cat <<EOF > control-plane-machine-type-patch.yaml
    apiVersion: infrastructure.cluster.x-k8s.io/v1alpha4
    kind: AWSMachineTemplate
    spec:
      template:
        spec:
          instanceType: ${INSTANCE_TYPE}
    EOF
    ```

## Apply all prepared updates

1.  Create a new AWSMachineTemplate.

    The new AWSMachineTemplate is a copy of the currently used AWSMachineTemplate, patched with the up-to-date machine properties.

    <p class="message--note"><strong>NOTE: </strong>Creating the new AWSMachineTemplate does not by itself update the control plane.</p>

    ```bash
    kubectl get awsmachinetemplate ${CURRENT_TEMPLATE_NAME} --output=yaml \
      | kubectl patch --local=true -f- --patch="{\"metadata\": {\"name\": \"$NEW_TEMPLATE_NAME\"} }" --type=merge --output=yaml \
      | kubectl patch --local=true -f- --patch-file=control-plane-machine-image-patch.yaml --type=merge --output=yaml \
      | kubectl patch --local=true -f- --patch-file=control-plane-machine-type-patch.yaml --type=merge --output=yaml \
      | kubectl create -f-
    ```

    ```sh
    awsmachinetemplate.infrastructure.cluster.x-k8s.io/aws-example-control-plane-6244 created
    ```

1.  Update the KubeadmControlPlane

    The KubeadmControlPlane is patched to reference the new AWSMachineTemplate created in the previous step, and to use a new Kubernetes version, if one was provided.

    <p class="message--note"><strong>NOTE: </strong>Patching the KubeadmControlPlane starts the control plane update. Machines with updated properties are created, and machines with out-of-date properties are deleted. The update is "rolling". New machines replace old machines one at a time. The update waits for each new machine to successfully join the control plane. Regardless of the specified replica count the update works the same way.

    ```bash
    kubectl get kubeadmcontrolplane ${KUBEADMCONTROLPLANE_NAME} --output=yaml \
      | kubectl patch --local=true -f- --patch="{\"spec\": {\"machineTemplate\": {\"infrastructureRef\": {\"name\": \"$NEW_TEMPLATE_NAME\"} } } }" --type=merge --output=yaml \
      | kubectl patch --local=true -f- --patch-file=control-plane-kubernetes-version-patch.yaml --type=merge --output=yaml \
      | kubectl apply -f-
    ```

    ```sh
    kubeadmcontrolplane.controlplane.cluster.x-k8s.io/aws-example-control-plane configured
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
[makeselfmanaging]: ../../self-managing
[awsdefaultmachineimages]: https://cluster-api-aws.sigs.k8s.io/amis.html
[imagebuilder]: ../../../../../image-builder
