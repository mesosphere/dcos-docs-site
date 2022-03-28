---
layout: layout.pug
navigationTitle: Upgrade Kommander
title: Upgrade Kommander
menuWeight: 20
excerpt: Steps to upgrade Kommander via CLI
beta: false
---
 
This section describes how to upgrade your Kommander Management cluster and all Platform Applications to their latest versions in networked, air-gapped and on-prem environments. To prevent compatibility issues, you must first upgrade Kommander on your Management Cluster before upgrading to DKP.

<p class="message--note"><strong>NOTE: </strong>It is important you upgrade Kommander BEFORE upgrading the Kubernetes version (or Konvoy version for Managed Konvoy clusters) in attached clusters, due to the previous versions' incompatibility with 1.22.</p>

## Prerequisites

- [Download][download_binary] and install the latest DKP CLI binary on your computer.
- Ensure you are on DKP version 2.1 or 2.1.1 and Kubernetes version 1.21.
- If you have attached clusters, ensure they are on Kubernetes versions 1.19, 1.20 or 1.21. To upgrade your Kubernetes version, refer to the appropriate documentation for your environment: [AKS][AKS], [AWS][AWS], [Azure][Azure], [EKS][EKS], [pre-provisioned][pre_provisioned].
- Review the [Platform Application version updates][release_notes] that are part of this upgrade.
- For air-gapped environments only: Download the [images bundle][images_bundle], [charts bundle][charts_bundle] and [Catalog Application charts bundle][cat_apps_bundle].  
- For air-gapped environments only: [Load the Docker images into your Docker registry][load_images]
- For air-gapped environments only: Download the Kommander charts bundle: 

```bash
wget "https://downloads.mesosphere.com/dkp/dkp-kommander-charts-bundle_${VERSION}.tar.gz"
```

- For air-gapped environments only: Download the Kommander application definitions:

```bash
wget "https://downloads.mesosphere.com/dkp/kommander-applications_${VERSION}.tar.gz"
```

## Upgrade Kommander

Before running the following command, ensure that your `dkp` configuration **references the Kommander Management cluster**, otherwise it attempts to run the upgrade on the bootstrap cluster. You can do this by setting the `KUBECONFIG` environment variable [to the appropriate kubeconfig file's location][k8s_access_to_clusters].

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

1.  For Enterprise customers: Upgrade your additional [Workspaces][upgrade_workspaces] on a per-Workspace basis to upgrade the Platform Applications on other clusters than the Management Cluster. 
    For Essential customers: Proceed with the [Konvoy Upgrade][konvoy_upgrade].

[download_binary]: ../../download/
[AKS]: https://docs.microsoft.com/en-us/azure/aks/upgrade-cluster
[AWS]: /dkp/konvoy/2.2/choose-infrastructure/aws/advanced/update/
[Azure]: /dkp/konvoy/2.2/choose-infrastructure/azure/advanced/update/
[EKS]: https://docs.aws.amazon.com/eks/latest/userguide/update-cluster.html
[pre_provisioned]: /dkp/konvoy/2.2/choose-infrastructure/pre-provisioned/upgrade/control-plane/
[k8s_access_to_clusters]: https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[upgrade_workspaces]: ../../workspaces/applications/catalog-applications/
[release_notes]: ../../release-notes/
[images_bundle]: https://downloads.mesosphere.io/kommander/airgapped/v2.2.0/kommander_image_bundle_v2.2.0_linux_amd64.tar.gz
[charts_bundle]: https://downloads.mesosphere.io/kommander/airgapped/v2.2.0/dkp-kommander-charts-bundle_v2.2.0.tar.gz
[cat_apps_bundle]: https://downloads.mesosphere.io/kommander/airgapped/v2.2.0/dkp-catalog-applications-charts-bundle_v2.2.0.tar.gz
[konvoy_upgrade]: /dkp/kommander/2.2/dkp-upgrade/upgrade-konvoy/
[load_images]: ../../install/air-gapped/#load-the-docker-images-into-your-docker-registry
