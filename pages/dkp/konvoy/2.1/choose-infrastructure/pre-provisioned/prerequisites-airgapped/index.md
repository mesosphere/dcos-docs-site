---
layout: layout.pug
navigationTitle: Prerequisites when Air-Gapped
title: Prerequisites when Air-Gapped
menuWeight: 20
excerpt: Fulfill the prerequisites for using a pre-provisioned infrastructure when Air-Gapped
enterprise: false
beta: false
---

## Download the bootstrap image

1.  Download the bootstrap docker image on a machine that has access to this artifact:

    ```docker
    curl --remote-name http://downloads.mesosphere.io/konvoy/airgapped/v2.1.1/konvoy-bootstrap_v2.1.1.tar
    ```

1.  Load the bootstrap docker image on your bastion machine:

    ```docker
    docker load -i konvoy-bootstrap_v2.1.1.tar
    ```

## Copy air-gapped artifacts onto cluster hosts

Using the [Konvoy Image Builder](../../../image-builder), you can copy the required artifacts onto your cluster hosts.

1.  Create the directories where you will place the air-gapped bundles:

    ```bash
    mkdir artifacts
    mkdir artifacts/images
    ```

1.  Define an environment variable for the Kubernetes version that corresponds with Konvoy release you are installing. You can find the correct Kubernetes version by checking the release notes for the release you are installing:

    ```bash
    export VERSION=1.21.6
    ```

1.  Download the OS packages bundle:

    ```bash
    curl --output artifacts/"$VERSION"_x86_64_rpms.tar.gz --location http://downloads.d2iq.com/konvoy/airgapped/os-packages_"$VERSION"_x86_64_rpms.tar.gz
    ```

1.  Download the Kubernetes images bundle. This bundle includes the necessary images for `kubeadm` to bootstrap a Kubernetes `Node`.

    ```bash
    curl --output artifacts/images/"$VERSION"_images.tar.gz --location http://downloads.d2iq.com/konvoy/airgapped/kubernetes_image_bundle_v"$VERSION"_linux_amd64.tar.gz
    ```

1.  Download the PIP packages. This bundle includes a few packages required by DKP to bootstrap machines.

    ```bash
    curl --output artifacts/pip-packages.tar.gz --location https://downloads.d2iq.com/dkp/airgapped/pip-packages/pip-packages.tar.gz
    ```

1.  Export the following environment variables, ensuring that all control plane and worker nodes are included:

    ```bash
    export CONTROL_PLANE_1_ADDRESS="<control-plane-address-1>"
    export CONTROL_PLANE_2_ADDRESS="<control-plane-address-2>"
    export CONTROL_PLANE_3_ADDRESS="<control-plane-address-3>"
    export WORKER_1_ADDRESS="<worker-address-1>"
    export WORKER_2_ADDRESS="<worker-address-2>"
    export WORKER_3_ADDRESS="<worker-address-3>"
    export WORKER_4_ADDRESS="<worker-address-4>"
    export SSH_USER="<ssh-user>"
    export SSH_PRIVATE_KEY_FILE="<private key file>"
    ```

    `SSH_PRIVATE_KEY_FILE` must be either the name of the SSH private key file in your working directory or an absolute path to the file in your user's home directory.

1.  Generate an `inventory.yaml` to be used with `konvoy-image upload` in the next step:

    ```yaml
    cat <<EOF > inventory.yaml
    all:
      vars:
        ansible_user: $SSH_USER
        ansible_port: 22
        ansible_ssh_private_key_file: $SSH_PRIVATE_KEY_FILE
      hosts:
        $CONTROL_PLANE_1_ADDRESS:
          ansible_host: $CONTROL_PLANE_1_ADDRESS
        $CONTROL_PLANE_2_ADDRESS:
          ansible_host: $CONTROL_PLANE_2_ADDRESS
        $CONTROL_PLANE_3_ADDRESS:
          ansible_host: $CONTROL_PLANE_3_ADDRESS
        $WORKER_1_ADDRESS:
          ansible_host: $WORKER_1_ADDRESS
        $WORKER_2_ADDRESS:
          ansible_host: $WORKER_2_ADDRESS
        $WORKER_3_ADDRESS:
          ansible_host: $WORKER_3_ADDRESS
        $WORKER_4_ADDRESS:
          ansible_host: $WORKER_4_ADDRESS
    EOF
    ```

1.  Copy the artifacts onto cluster hosts:

    ```bash
    konvoy-image upload artifacts --container-images-dir=./artifacts/images/ --os-packages-bundle=./artifacts/"$VERSION"_"$BUNDLE_OS".tar.gz --pip-packages-bundle=./artifacts/pip-packages.tar.gz
    ```

## Seed your docker registry

Before creating a Kubernetes cluster you must have the required images in a local docker registry. This registry must be accessible from both the bastion machine and the AWS EC2 instances that will be created for the Kubernetes cluster.

1.  Download the images bundle.

    ```bash
    curl --output konvoy-image-bundle.tar.gz --location https://downloads.d2iq.com/konvoy/airgapped/v2.1.1/konvoy_image_bundle_v2.1.1_linux_amd64.tar.gz
    ```

1.  Place the bundle in a location where you can load and push the images to your private docker registry.

1.  Ensure you set the REGISTRY_URL and AIRGAPPED_TAR_FILE variable appropriately, then use the following script to load the air-gapped image bundle:

    ``` sh
    #!/usr/bin/env bash
    set -euo pipefail
    IFS=$'\n\t'

    readonly AIRGAPPED_TAR_FILE=${AIRGAPPED_TAR_FILE:-"kommander-image-bundle.tar"}
    readonly REGISTRY_URL=${REGISTRY_URL?"Need to set REGISTRY_URL. E.g: 10.23.45.67:5000"}

    docker load <"${AIRGAPPED_TAR_FILE}"

    while read -r IMAGE; do
      echo "Processing ${IMAGE}"
      REGISTRY_IMAGE="$(echo "${IMAGE}" | sed -E "s@^(quay|gcr|ghcr|docker|k8s.gcr).io@${REGISTRY_URL}@")"
      docker tag "${IMAGE}" "${REGISTRY_IMAGE}"
      docker push "${REGISTRY_IMAGE}"
    done < <(tar xfO "${AIRGAPPED_TAR_FILE}" "index.json" | grep -oP '(?<="io.containerd.image.name":").*?(?=",)')
    ```

It may take a while to push all the images to your image registry, depending on the performance of the network between the machine you are running the script on and the Docker registry.

Then, [begin creating the bootstrap cluster][bootstrap].

[bootstrap]: ../bootstrap

This Docker image includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the GNU Affero General Public License 3.0. The complete source code for the versions of MinIO packaged with DKP/Kommander/Konvoy 2.1.1 are available at these URLs: 
https://github.com/minio/minio/tree/RELEASE.2021-07-30T00-02-00Z
https://github.com/minio/minio/tree/RELEASE.2021-02-14T04-01-33Z

For a full list of attributed 3rd party software, see [D2IQ Legal](https://d2iq.com/legal/3rd).
