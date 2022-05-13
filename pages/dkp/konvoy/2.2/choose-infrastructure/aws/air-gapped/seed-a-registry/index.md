---
layout: layout.pug
navigationTitle: Seed Docker Registry
title: Seed Docker Registry
menuWeight: 10
excerpt: Seed your docker registry
enterprise: false
---

## Seed your docker registry

Before creating a Kubernetes cluster you must have the required images in a local docker registry. This registry must be accessible from both the bastion machine and the AWS EC2 instances that will be created for the Kubernetes cluster.

1.  Download the images bundle.

    ```bash
    curl -o konvoy-image-bundle.tar.gz -O https://downloads.d2iq.com/dkp/v2.2.0/konvoy_image_bundle_v2.2.0_linux_amd64.tar.gz
    ```

    <p class="message--note"><strong>NOTE: </strong>This docker image includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">GNU Affero General Public License 3.0</a>. For more information, refer to <a href="https://github.com/minio/minio">MinIO's source code</a>.</p>

1.  Place the bundle in a location where you can load and push the images to your private docker registry.

1.  Set an environment variable with your registry address.

    ```bash
    export DOCKER_REGISTRY_ADDRESS=<registry-address>:<registry-port>
    export DOCKER_REGISTRY_USERNAME=<username>
    export DOCKER_REGISTRY_PASSWORD=<password>
    ```

2.  Run the following command to load the air-gapped image bundle into your private Docker registry.

    ```bash
    dkp push image-bundle --image-bundle konvoy-image-bundle.tar.gz --to-registry $DOCKER_REGISTRY_ADDRESS --to-registry-username $DOCKER_REGISTRY_USERNAME --to-registry-password $DOCKER_REGISTRY_PASSWORD
    ```

It may take a while to push all the images to your image registry, depending on the performance of the network between the machine you are running the script on and the Docker registry.


Then, [begin creating the bootstrap cluster][bootstrap].

[bootstrap]: ../bootstrap
