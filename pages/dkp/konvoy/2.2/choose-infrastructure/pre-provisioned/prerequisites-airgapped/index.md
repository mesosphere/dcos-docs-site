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

1.  Set an environment variable with the DKP version.
    
    ```bash
    export DKP_VERSION=v2.2.0
    ```

2.  Download the bootstrap docker image on a machine that has access to this artifact.

    ```docker
    curl -O https://downloads.d2iq.com/dkp/$DKP_VERSION/konvoy-bootstrap_$DKP_VERSION.tar
    ```

3.  Load the bootstrap docker image on your bastion machine.

    ```docker
    docker load -i konvoy-bootstrap_$DKP_VERSION.tar
    ```

## Copy air-gapped artifacts onto cluster hosts 

Using the [Konvoy Image Builder](../../../image-builder), you can copy the required artifacts onto your cluster hosts.

1.  Create the directories where you will place the air-gapped bundles:

    ```
    mkdir artifacts
    mkdir artifacts/images
    ```

1.  Define an environment variable for the Kubernetes version that corresponds with Konvoy release you are installing. You can find the correct Kubernetes version by checking the release notes for the release you are installing.

    ```bash
    export VERSION=1.22.8
    ```

1.  Set an environment variable for the AMI's OS you are will be using.
    The OS packages bundles will contain the RPMs for Containerd, Kubernetes and all of their dependencies required to install these packages without access to any external RPM repositories.
    The available options are:

    * `centos_7_x86_64`
    * `centos_7_x86_64_fips`
    * `redhat_7_x86_64`
    * `redhat_7_x86_64_fips`
    * `redhat_8_x86_64`
    * `redhat_8_x86_64_fips`

    ```
    export BUNDLE_OS=centos_7_x86_64
    ```

1.  Download the OS packages bundle:

    ```
    curl --output artifacts/"$VERSION"_"$BUNDLE_OS".tar.gz -O https://downloads.d2iq.com/dkp/airgapped/os-packages/"$VERSION"_"$BUNDLE_OS".tar.gz
    ```

1.  Download the Kubernetes images bundle. This bundle includes the necessary images for `kubeadm` to bootstrap a Kubernete `Node`.

    The available options for each Kubernetes version are:

    * `<version>_images.tar.gz`
    * `<version>_images_fips.tar.gz`

    ```
    curl --output artifacts/images/"$VERSION"_images.tar.gz -O https://downloads.d2iq.com/dkp/airgapped/kubernetes-images/"$VERSION"_images.tar.gz
    ```

1.  Download the PIP packages. This bundle includes a few packages required by DKP to boostrap machines.

    ```
    curl --output artifacts/pip-packages.tar.gz -O https://downloads.d2iq.com/dkp/airgapped/pip-packages/pip-packages.tar.gz
    ```

1.  Export these environment variables:

    ```bash
    export CONTROL_PLANE_1_ADDRESS="<control-plane-address-1>"
    export CONTROL_PLANE_2_ADDRESS="<control-plane-address-2>"
    export CONTROL_PLANE_3_ADDRESS="<control-plane-address-3>"
    export WORKER_1_ADDRESS="<worker-address-1>"
    export WORKER_2_ADDRESS="<worker-address-2>"
    export WORKER_3_ADDRESS="<worker-address-3>"
    export WORKER_4_ADDRESS="<worker-address-4>"
    export SSH_USER="<ssh-user>"
    export SSH_PRIVATE_KEY_SECRET_NAME="$CLUSTER_NAME-ssh-key"
    ```

2.  Generate an `inventory.yaml` to be used with `konvoy-image upload` in the next step.

    ```yaml
    cat <<EOF > inventory.yaml
    all:
      vars:
        ansible_user: $SSH_USER
        ansible_port: 22
        ansible_ssh_private_key_file: $SSH_PRIVATE_KEY_SECRET_NAME
      hosts:
        $CONTROL_PLANE_1_ADDRESS:
          ansible_host: $CONTROL_PLANE_1_ADDRESS
        $CONTROL_PLANE_2_ADDRESS:
          ansible_host: $CONTROL_PLANE_2_ADDRESS
        $CONTROL_PLANE_2_ADDRESS:
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

3.  Copy the artifacts onto cluster hosts.

    ```
    konvoy-image upload artifacts --container-images-dir=./artifacts/images/ --os-packages-bundle=./artifacts/"$VERSION"_"$BUNDLE_OS".tar.gz --pip-packages-bundle=./artifacts/pip-packages.tar.gz
    ```

## Seed your docker registry

Before creating a Kubernetes cluster you must have the required images in a local docker registry. This registry must be accessible from both the bastion machine and the machines that will be created for the Kubernetes cluster.

1.  Set an environment variable with the DKP version.
    
    ```bash
    export DKP_VERSION=v2.2.0
    ```

1.  Download the images bundle.

    ```
    curl -o konvoy-image-bundle.tar.gz -O downloads.d2iq.com/dkp/$DKP_VERSION/konvoy_image_bundle_"$DKP_VERSION"_linux_amd64.tar.gz
    ```

1.  Place the bundle in a location where you can load and push the images to your private docker registry.

1.  Set an environment variable with your registry address

    ```
    export DOCKER_REGISTRY_ADDRESS=<https/http>://<registry-address>:<registry-port>
    ```

1.  Run the following command to load the air-gapped image bundle into your private Docker registry.

    ```bash
    dkp push image-bundle --image-bundle konvoy-image-bundle.tar.gz --to-registry <DOCKER_REGISTRY_ADDRESS>
    ```

It may take a while to push all the images to your image registry, depending on the performance of the network between the machine you are running the script on and the Docker registry.

Then [begin creating the bootstrap cluster][bootstrap].

[bootstrap]: ../bootstrap
