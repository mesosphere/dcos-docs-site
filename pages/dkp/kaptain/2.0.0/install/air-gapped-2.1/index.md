---
layout: layout.pug
navigationTitle: Add Kaptain air-gapped for DKP 2.1
title: Add Kaptain to your DKP Catalog applications on air-gapped environments for DKP 2.1
menuWeight: 10
excerpt: Add Kaptain to your DKP Catalog applications on air-gapped environments for DKP 2.1
beta: false
enterprise: false
---

<p class="message--important"><strong>IMPORTANT: </strong>Ensure the cluster that you want to use to deploy Kaptain is the only cluster in its workspace. <b>Kaptain is meant to be deployed on workspaces with a single cluster</b>.</p>

<p class="message--note"><strong>NOTE: </strong>All DKP commands in this page assume <code>KUBECONFIG=clusterKubeconfig.conf</code> is set.</p>

## Requirements

For reference values of the required number of worker nodes, CPU, RAM, and storage resources, refer to the [requirements](../requirements/) section.

## Prerequisites

Ensure you meet all [prerequisites](../prerequisites/).

<p class="message--note"><strong>NOTE: </strong>Starting from the 1.3 release, Spark Operator is no longer installed by default with Kaptain.</p>

If you need to run Spark jobs on Kubernetes using Spark Operator, you must install it separately. Use the following instructions to install Spark Operator from Kommander Catalog for [DKP 2.x][install-spark-dkp2].

## DKP 2.1 air-gapped installation

Refer to [DKP install instructions][dkp_install], if you want to deploy Kaptain in a networked environment or to [DKP 2.2 air-gapped instructions][2.2_air] if you are deploying in DKP 2.2.

Kaptain supports installation on an air-gapped (offline or private) DKP managed cluster. Before installing Kaptain, follow the [air-gapped installation guide][konvoy-air-gap] to set up the air-gapped DKP managed cluster. The cluster admin is responsible for configuring the DKP cluster correctly and ensuring container images have been pre-loaded to the private registry, before installing Kaptain.

### Load the Docker images into your Docker registry

1.  Download the image bundle files from the [support portal](https://support.d2iq.com/hc/en-us/articles/4409164864788):

    - Download `kaptain-air-gapped-2.0.0.tar.gz` that will contain the required artifacts to perform an air-gapped installation. Extract the image bundle archive and other files before use.
	  
      ```bash
      mkdir bundle && tar -xvf kaptain-air-gapped-2.0.0.tar.gz -C bundle/
      ```

    - (Optional) Download the custom image artifacts `kaptain-air-gapped-2.0.0_cpu.tar.gz` or `kaptain-air-gapped-2.0.0_gpu.tar.gz` based on whether you need CPU or GPU for your workloads. Extract the image bundle archive and other files before use.
	  
      ```bash
      mkdir bundle-cpu && tar -xvf kaptain-air-gapped-cpu.tar.gz -C bundle-cpu/
      mkdir bundle-gpu && tar -xvf kaptain-air-gapped-gpu.tar.gz -C bundle-gpu/
      ```

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

    <p class="message--note"><strong>NOTE: </strong>This script is slightly different than the Kommander load script and has different image registry filters.</p>

Based on the network latency between the environment of script execution, the Docker registry, and the disk speed, this can take a while to upload all the images to your image registry.

### Install Kaptain using helm

1.  Ensure the `KUBECONFIG=clusterKubeconfig.conf` is set.

1.  Download the `kaptain-2.0.0.tgz` chart archive from the [support portal](https://support.d2iq.com/hc/en-us/articles/4409164864788).

1.  Add the following to a file named 'values.yaml' to pass to the helm install with the following contents:

    ```yaml
    ingress:
      kubeflowIngressGatewayServiceAnnotations:
        service.beta.kubernetes.io/aws-load-balancer-internal: "true"
    ```

1.  Use helm to install Kaptain to your air-gapped cluster:

    ```bash
    helm install kaptain kaptain-2.0.0.tgz --values values.yaml
    ```

    You may need to specify `--kubeconfig=my-air-gap-cluster.conf` for the install.

1.  Check the status of the install with:

    ```bash
    helm status kaptain
    ```

## Uninstall Kaptain

If Kaptain was installed using helm, it can be uninstalled with the following:

```bash
helm uninstall kaptain
```

Refer to the [installation overview](../../install#installation-overview) for next steps.

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
[dkp-install]: /dkp/konvoy/2.2/choose-infrastructure/
