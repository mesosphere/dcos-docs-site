---
layout: layout.pug
navigationTitle: Install air-gapped on DKP 2.x
title: Install Kaptain on an air-gapped DKP 2.x cluster
menuWeight: 10
excerpt: Install Kaptain on an air-gapped DKP 2.x cluster
beta: false
enterprise: false
---

## DKP 2.x Air-Gapped Installation

<p class="message--note"><strong>IMPORTANT: </strong>The air-gapped installation procedure is still in beta, so the process may change in the future.</p>

Kaptain supports installation on an air-gapped (a.k.a. offline or private) Konvoy cluster. Before installing Kaptain, please follow the [Konvoy Air-Gapped Installation Guide][konvoy-air-gap] to set up the air-gapped Konvoy cluster. The cluster admin is responsible for configuring the Konvoy cluster correctly and ensuring container images have been pre-loaded to the private registry before installing Kaptain.

### Prerequisites for DKP 2.x

For DKP 2.x, ensure the following applications are enabled in Kommander:
* Use the existing Kommander configuration file, or initialize the default one:  
  ```
  kommander install --init > kommander-config.yaml
  ```
* Ensure the following applications are enabled in the config:
  ```yaml
  apiVersion: config.kommander.mesosphere.io/v1alpha1
  kind: Installation
  apps:
    ...
    dex:
    dex-k8s-authenticator:
    kube-prometheus-stack:
    istio:
    knative:
    minio-operator:
    traefik:
    nvidia:  # to enable GPU support
    ...   
  ```
* Apply the new configuration to Kommander:
  ```
  kommander install --installer-config kommander-config.yaml
  ```
Check [Kommander installation documentation][kommander-install] for more information.

<p class="message--note"><strong>NOTE: </strong>Starting from the 1.3 release, Spark Operator is no longer installed by default with Kaptain.</p>

In case you need to run Spark jobs on Kubernetes using Spark Operator, it needs to be installed separately.
Use the following instructions to install Spark Operator from Kommander Catalog for [DKP 2.x][install-spark-dkp2].

### Load the Docker images into your Docker registry

1. Download the image bundle file:
    * Download `kaptain_air_gapped.tar` that will contain the required artifacts to perform an air-gapped installation. Extract the image bundle archive and other files before use:
  
      ```bash
      mkdir bundle && tar -xvf kaptain-air-gapped.tar.gz -C bundle/
      ```
    * (Optional) Download the custom image artifacts `kaptain_air_gapped_cpu.tar` or `kaptain_air_gapped_gpu.tar` based on whether you need CPU or GPU for your workloads. To do so, extract the image bundle archive and other files before use:
  
      ```bash
      mkdir bundle-cpu && tar -xvf kaptain-air-gapped-cpu.tar.gz -C bundle-cpu/
      mkdir bundle-gpu && tar -xvf kaptain-air-gapped-gpu.tar.gz -C bundle-gpu/
      ```
2. Place the bundle in a location where you can load and push the images to your private Docker registry. Extract the image bundle archive and other files before use:
    
    ```bash
    mkdir bundle && tar -xvf kaptain-air-gapped.tar.gz -C bundle/
    ```

3. Ensure you set the `REGISTRY_URL` and `AIRGAPPED_TAR_FILE` variable appropriately, then use the following script to load the air gapped image bundle:

    ```bash
    #!/usr/bin/env bash
    set -euo pipefail
    IFS=$'\n\t'

    readonly AIRGAPPED_TAR_FILE=${AIRGAPPED_TAR_FILE:-"kaptain-image-bundle.tar"}
    readonly REGISTRY_URL=${REGISTRY_URL#https://}

    docker load --input "${AIRGAPPED_TAR_FILE}"

    while read -r IMAGE; do
        echo "Processing ${IMAGE}"
        REGISTRY_IMAGE="$(echo "${IMAGE}" | sed -E "s@^(quay|gcr|ghcr|docker|k8s.gcr|nvcr).io|public.ecr.aws|mcr.microsoft.com@${REGISTRY_URL}@")"
        docker image tag "${IMAGE}" "${REGISTRY_IMAGE}"
        docker image push "${REGISTRY_IMAGE}"
    done < <(tar xfO "${AIRGAPPED_TAR_FILE}" "index.json" | grep -oP '(?<="io.containerd.image.name":").*?(?=",)')
    ```

    *Note: this script is slightly different than the Kommander load script and has different image registry filters.*

    Based on the network latency between the environment of script execution and the Docker registry as well as the disk speed, this can take a while to upload all the images to your image registry.

### Install Kaptain

* When the Konvoy cluster is ready and the images are pushed to the registry, [install Kaptain][install-kaptain].

[install-kaptain]: ../konvoy-dkp/
[install-spark-dkp2]: /dkp/kommander/2.1/workspaces/applications/catalog-applications/dkp-applications/spark-operator/
[install-spark-konvoy1]: /dkp/kommander/1.4/projects/platform-services/platform-services-catalog/kudo-spark/
[kommander-install]: /dkp/kommander/2.1/install/air-gapped/
[konvoy-air-gap]: /dkp/konvoy/2.1/choose-infrastructure/aws/air-gapped/
[konvoy_deploy_addons]: /dkp/konvoy/1.8/upgrade/upgrade-kubernetes-addons/#prepare-for-addons-upgrade
