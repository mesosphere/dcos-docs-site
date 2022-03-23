---
layout: layout.pug
navigationTitle: Upgrade Kommander
title: Upgrade Kommander
menuWeight: 20
excerpt: Steps to upgrade Kommander via CLI
beta: false
---
 
This section describes how to upgrade your Kommander Management cluster and all Platform Applications to their latest versions. To prevent compatibility issues, you must first upgrade Kommander on your Management Cluster before upgrading to DKP.

<p class="message--note"><strong>NOTE: </strong>It is important you upgrade Kommander BEFORE upgrading the Kubernetes version (or Konvoy version for Managed Konvoy clusters) in attached clusters, due to the previous versions' incompatibility with 1.22.</p>

## Prerequisites

- [Download][download-binary] and install the latest DKP CLI binary on your computer.
- Ensure you are on DKP version 2.1 or 2.1.1 and Kubernetes version 1.21.
- If you have attached clusters, ensure they are on Kubernetes versions 1.19, 1.20 or 1.21. To upgrade your Kubernetes version, refer to the appropriate documentation for your environment: [AKS][AKS], [AWS][AWS], [Azure][Azure], [EKS][EKS], [pre-provisioned][pre-provisioned].
- Review the [Platform Application version updates][release-notes] that are part of this upgrade.
- Download the following air-gapped bundles: [images bundle][images-bundle], [charts bundle][charts-bundle] and [Catalog Application charts bundle][cat-apps-bundle]. **Skip this if you are not running in an air-gapped environment**.  

### Load the Docker images into your Docker registry (skip this section if you are running in an **air-gapped environment**)

1.  Download the image bundle file:

    ```bash
    wget "https://downloads.mesosphere.com/kommander/airgapped/v2.2.0/kommander_image_bundle_v2.2.0_linux_amd64.tar" -O kommander-image-bundle.tar
    ```

1.  Place the bundle in a location where you can load and push the images to your private Docker registry.

1.  Ensure you set the `REGISTRY_URL` and `AIRGAPPED_TAR_FILE` variable appropriately, then use the following script to load the air-gapped image bundle:

    ```bash
    #!/usr/bin/env bash
    set -euo pipefail
    IFS=$'\n\t'

    readonly AIRGAPPED_TAR_FILE=${AIRGAPPED_TAR_FILE:-"kommander-image-bundle.tar"}
    readonly REGISTRY_URL=${REGISTRY_URL?"Need to set REGISTRY_URL. E.g: 10.23.45.67:5000"}

    docker load <"${AIRGAPPED_TAR_FILE}"

    while read -r IMAGE; do
        echo "Processing ${IMAGE}"
        REGISTRY_IMAGE="$(echo "${IMAGE}" | sed -E "s@^(quay|gcr|ghcr|docker).io@${REGISTRY_URL}@")"
        docker tag "${IMAGE}" "${REGISTRY_IMAGE}"
        docker push "${REGISTRY_IMAGE}"
    done < <(tar xfO "${AIRGAPPED_TAR_FILE}" "index.json" | grep -oP '(?<="io.containerd.image.name":").*?(?=",)')
    ```

Based on the network latency between the environment of script execution and the docker registry, it can take a while to upload all the images to your image registry.

## Upgrade Kommander

Before running the following command, ensure that your `dkp` configuration **references the Kommander Management cluster**, otherwise it attempts to run the upgrade on the bootstrap cluster. You can do this by setting the `KUBECONFIG` environment variable [to the appropriate kubeconfig file's location][k8s-access-to-clusters].

<p class="message--note"><strong>NOTE:</strong> An alternative to initializing the KUBECONFIG environment variable as stated earlier is to use the <code>–kubeconfig=cluster_name.conf</code> flag. This ensures that Kommander upgrades on the workload cluster.</p>

1.  Use the DKP CLI to upgrade Kommander and all the Platform Applications in the Management Cluster:

    For air-gapped:

    ```bash
    dkp upgrade kommander --charts-bundle bundle.tar.gz
    ```

    For non air-gapped:

    ```bash
    dkp upgrade kommander
    ```

    <--! A confirmation message appears once upgrade is complete.--! >

1.  < --!Pending step: if confirmation message cannot be added on time, document a way to check the status of the upgrade in Management Cluster. --! >

1.  Upgrade your additional [Workspaces][upgrade-workspaces] on a per-Workspace basis to upgrade the Platform Applications on other clusters than the Management Cluster. Do this only if your environment has additional Workspaces (with Managed and Attached clusters). Otherwise, proceed with the [Konvoy Upgrade][konvoy-upgrade]. < --! we need to reference this file once it is created-->

[download-binary]: ../../download/
[AKS]: https://docs.microsoft.com/en-us/azure/aks/upgrade-cluster
[AWS]: /dkp/konvoy/2.2/choose-infrastructure/aws/advanced/update/
[Azure]: /dkp/konvoy/2.2/choose-infrastructure/azure/advanced/update/
[EKS]: https://docs.aws.amazon.com/eks/latest/userguide/update-cluster.html
[pre-provisioned]: /dkp/konvoy/2.2/choose-infrastructure/pre-provisioned/upgrade/control-plane/
[k8s-access-to-clusters]: https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[upgrade-workspaces]: ../../workspaces/applications/catalog-applications/
[release-notes]: ../../release-notes/
[images-bundle]: /downloads.mesosphere.io/kommander/airgapped/v2.2.0/kommander_image_bundle_v2.2.0_linux_amd64.tar.gz
[charts-bundle]: /downloads.mesosphere.io/kommander/airgapped/v2.2.0/dkp-kommander-charts-bundle_v2.2.0.tar.gz
[cat-apps-bundle]: /downloads.mesosphere.io/kommander/airgapped/v2.2.0/dkp-catalog-applications-charts-bundle_v2.2.0.tar.gz
