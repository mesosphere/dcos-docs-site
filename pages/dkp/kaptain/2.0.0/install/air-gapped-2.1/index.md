---
layout: layout.pug
navigationTitle: Add Kaptain air-gapped for DKP 2.1
title: Add Kaptain to your DKP Catalog applications on air-gapped environments for DKP 2.1
menuWeight: 10
excerpt: Add Kaptain to your DKP Catalog applications on air-gapped environments for DKP 2.1
beta: false
enterprise: false
---

<p class="message--warning"><strong>WARNING: </strong>
You can deploy Kaptain to a cluster in a selected workspace. If you do not intend to deploy Kaptain to a certain cluster, you must switch the workspace you are deploying to or move that cluster to another workspace.
</p>

## DKP 2.1 air-gapped installation

Refer to [DKP install instructions][dkp_install], if you want to deploy Kaptain in a networked environment or to [DKP 2.2 air-gapped instructions][2.2_air] if you are deploying in DKP 2.2.

Kaptain supports installation on an air-gapped (a.k.a. offline or private) DKP managed cluster. Before installing Kaptain, please follow the [air-gapped installation guide][konvoy-air-gap] to set up the air-gapped DKP managed cluster. The cluster admin is responsible for configuring the DKP cluster correctly and ensuring container images have been pre-loaded to the private registry before installing Kaptain.

## Prerequisites

-   A DKP cluster with the following Platform applications enabled:

    - Istio
    - Knative (optional, if KServe is configured to work in `RawDeployment` mode)

-   [`kubectl`][kubectl] on your installation machine

-   For customers deploying in a multi-cluster environment (Enterprise): Ensure you have configured [Kaptain to authenticate with a Management Cluster][dex].

-   Ensure the following applications are enabled in Kommander:

    1. Use the existing Kommander configuration file, or initialize the default one:

		```bash
		dkp install kommander --init > kommander-config.yaml
		```

    1. Ensure the following applications are enabled in the config:

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

    1. Apply the new configuration to Kommander:

		```bash
		dkp install kommander --installer-config kommander-config.yaml
		```

<!-- TODO: Reference doc for DKP, as commands are different depending on the installation and delete only this step or the whole "Ensure the following applications are enabled in Kommander:" part?-->

  Review the [Kommander installation documentation][kommander-install] for more information.

<p class="message--note"><strong>NOTE: </strong>Starting from the 1.3 release, Spark Operator is no longer installed by default with Kaptain.</p>

In case you need to run Spark jobs on Kubernetes using Spark Operator, it needs to be installed separately.
Use the following instructions to install Spark Operator from Kommander Catalog for [DKP 2.x][install-spark-dkp2].

### Load the Docker images into your Docker registry

1.  Download the image bundle file:

    - Download `kaptain_air_gapped.tar` that will contain the required artifacts to perform an air-gapped installation.
    - (Optional) Download the custom image artifacts `kaptain_air_gapped_cpu.tar` or `kaptain_air_gapped_gpu.tar` based on whether you need CPU or GPU for your workloads.

1.  Place the bundle in a location where you can load and push the images to your private Docker registry.

1.  Ensure you set the `REGISTRY_URL` and `AIRGAPPED_TAR_FILE` variable appropriately, then use the following script to load the air-gapped image bundle:

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

   _Note: this script is slightly different than the Kommander load script and has different image registry filters._

   Based on the network latency between the environment of script execution, the Docker registry, and the disk speed, this can take a while to upload all the images to your image registry.

<!-- 1.  Run other seed script -->

## Add Kaptain to your DKP Catalog Applications via CLI

If you installed DKP with Kaptain as a workspace application in the Kommander installation file, you do not need to create a Git Repository for Kaptain.

If you added Kaptain after installing DKP, you must make it available by creating a Git Repository. Use the CLI to create the GitRepository resource and add a new repository.

### Create a Git repository for Kaptain

<!-- TODO: 1.  add a section for the helm install for DKP 2.1 -->

## Deploy Kaptain on selected workspaces

You have installed Kaptain by adding it to the DKP Catalog applications. The next step is to enable and deploy Kaptain on all clusters in a selected workspace. For this, refer to [Deploy Kaptain][deploy] instructions.

[install-spark-dkp2]: /dkp/kommander/2.2/workspaces/applications/catalog-applications/dkp-applications/spark-operator/
[kommander-install]: /dkp/kommander/latest/install/
[kommander-gpu]: /dkp/kommander/latest/gpu/
[konvoy-gpu]: /dkp/konvoy/2.2/gpu/
[kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[dex]: ../../configuration/external-dex/
[dkp_install]: ../dkp
[kommander-install]: /dkp/kommander/2.2/install/air-gapped/
[konvoy-air-gap]: /dkp/konvoy/2.2/choose-infrastructure/aws/air-gapped/
[deploy]: ../deploy-kaptain/
[2.2_air]: ../air-gapped-2.2
