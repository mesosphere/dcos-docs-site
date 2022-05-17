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
    curl -o konvoy-image-bundle.tar.gz -O http://downloads.d2iq.com/konvoy/airgapped/v2.1.1/konvoy_image_bundle_v2.1.1_linux_amd64.tar.gz
    ```

<p class="message--note"><strong>NOTE: </strong>This docker image includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">GNU Affero General Public License 3.0</a>. Complete source code for MinIO is available <a href="https://github.com/minio/minio">here</a>.</p>

1. Place the bundle in a location where you can load and push the images to your private docker registry.

1. Ensure you set the REGISTRY_URL and AIRGAPPED_TAR_FILE variable appropriately, then use the following script to load the air-gapped image bundle:

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
