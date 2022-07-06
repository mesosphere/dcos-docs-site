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
    curl --remote-name https://downloads.d2iq.com/dkp/v2.3.0/konvoy-bootstrap_v2.3.0.tar
    ```

1.  Load the bootstrap docker image on your bastion machine:

    ```docker
    docker load -i konvoy-bootstrap_v2.3.0.tar
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
    export VERSION=1.23.7
    ```

1.  Set an environment variable for the image's OS you want to use.
    The OS packages bundles will contain the RPMs for Containerd, Kubernetes and all of their dependencies required to install these packages without access to any external RPM repositories.
    The available options are:

    * `centos_7_x86_64`
    * `centos_7_x86_64_fips`
    * `redhat_7_x86_64`
    * `redhat_7_x86_64_fips`
    * `redhat_8_x86_64`
    * `redhat_8_x86_64_fips`

    ```bash
    export BUNDLE_OS=centos_7_x86_64
    ```

1.  Download the OS packages bundle:

    ```bash
    curl --output artifacts/"$VERSION"_"$BUNDLE_OS".tar.gz --location https://downloads.d2iq.com/dkp/airgapped/os-packages/"$VERSION"_"$BUNDLE_OS".tar.gz
    ```

1.  Download the Kubernetes images bundle. This bundle includes the necessary images for `kubeadm` to bootstrap a Kubernetes `Node`.

    The available options for each Kubernetes version are:

    * `<version>_images.tar.gz`
    * `<version>_images_fips.tar.gz`

    ```bash
    curl --output artifacts/images/"$VERSION"_images.tar.gz --location https://downloads.d2iq.com/dkp/airgapped/kubernetes-images/"$VERSION"_images.tar.gz
    ```

1.  Download the PIP packages. This bundle includes a few packages required by DKP to boostrap machines.

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

Before creating a Kubernetes cluster you must have the required images in a local docker registry. This registry must be accessible from both the bastion machine and the machines that will be created for the Kubernetes cluster.


1.  Download the images bundle:

    ```bash
    curl --output konvoy-image-bundle.tar.gz --location https://downloads.d2iq.com/dkp/v2.3.0/konvoy_image_bundle_v2.3.0_linux_amd64.tar.gz
    ```

1.  Place the bundle in a location where you can load and push the images to your private docker registry.

1.  Set an environment variable with your registry address:

    ```bash
    export DOCKER_REGISTRY_ADDRESS=<registry-address>:<registry-port>
    ```

2.  Run the following command to load the air-gapped image bundle into your private Docker registry:

    ```bash
    dkp push image-bundle --image-bundle konvoy-image-bundle.tar.gz --to-registry $DOCKER_REGISTRY_ADDRESS
    ```

It may take a while to push all the images to your image registry, depending on the performance of the network between the machine you are running the script on and the Docker registry.

Then [begin creating the bootstrap cluster][bootstrap].

[bootstrap]: ../bootstrap
