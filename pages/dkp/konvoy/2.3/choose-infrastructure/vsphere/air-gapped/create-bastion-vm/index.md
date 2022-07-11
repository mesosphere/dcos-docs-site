---
layout: layout.pug
navigationTitle: Create and Prepare a Bastion VM Host
title: Create and Prepare a Bastion VM Host
menuWeight: 15
excerpt: Create and Prepare a Bastion VM host for use with a vSphere air-gapped cluster
enterprise: false
---

## Prerequisites

Before you start this procedure, ensure that you complete the [Prerequisites][prereqs].

## Create a vSphere Bastion VM Host Template
When creating an air-gapped vSphere cluster, the bastion VM hosts the installation DKP Konvoy bundles and images, and the Docker registry, needed to create and operate your vSphere cluster. The bastion VM must have access to the vSphere API Server (vCenter Server).

1.  Create a bastion VM host template for the cluster nodes to use within the air-gapped network. This bastion VM host also needs access to a Docker registry in lieu of an Internet connection for pulling Docker images. The recommended template naming pattern is `../folder-name/dkp-e2e-bastion-template` or similar.

1.  Find and record the bastion VM's IP or host name.

1.  [Download][download] the following required DKP Konvoy binaries and installation bundles appropriate for your environment directly to the bastion host, or transfer them using your environment's approved methods:

    - dkp_v2.3.0_darwin_amd64.tar.gz

    - dkp_v2.3.0_linux_amd64.tar.gz

    - konvoy_image_bundle_v2.3.0_linux_amd64.tar.gz (air-gapped) - This bundle contains air-gapped images that you must push to a registry.)

    - konvoy-bootstrap_v2.3.0.tar (air-gapped) - This bundle contains the KIND bootstrap image to load with the `docker load` command when you create the bootstrap cluster in a later step.

1.  Use your credentials to SSH into the bastion VM host with the command:

    ```bash
    ssh -i </path/to/private_key> <USER>@<BASTION_IP>
    ```

1.  Set the following vSphere environment variables on the bastion VM host:

    ```bash
    export VSPHERE_SERVER=your_vCenter_APIserver_URL
    export VSPHERE_USERNAME=your_vCenter_user_name
    export VSPHERE_PASSWORD=your_vCenter_password
    ```

1.  Set the following environment variables to enable connection to an existing Docker registry:

    <p class="message--important"><strong>IMPORTANT: </strong>You must create the VM template with the <a href="https://github.com/mesosphere/konvoy-image-builder">konvoy-image-builder</a> project to be able to use the registry mirror feature.</p>

    ```bash
    export DOCKER_REGISTRY_ADDRESS=<https/http>://<registry-address>:<registry-port>
    export DOCKER_REGISTRY_CA=<path to the CA on the bastion host>
    ```

    - `DOCKER_REGISTRY_ADDRESS`: the address of an existing Docker registry accessible in the vSphere Zone where the new cluster nodes will be configured, to use a mirror registry when pulling images.

    - `DOCKER_REGISTRY_CA`: (optional) the path on the bastion host to the Docker registry CA. Konvoy configures the cluster nodes to trust this CA. This value is only needed if the registry is using a self-signed certificate and the VMs are not already configured to trust this CA.

When you complete this procedure, the next step is to [create a bootstrap cluster][bootstrap].

[download]: ../../../../download/
[prereqs]: ../../prerequisites/
[bootstrap]: ../bootstrap/
[set-up-mirrored-registry]: ../set-up-mirrored-registry/
