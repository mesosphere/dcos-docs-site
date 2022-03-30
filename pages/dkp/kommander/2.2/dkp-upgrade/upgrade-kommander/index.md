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
- For air-gapped environments only: [Load the Docker images into your Docker registry][load_images]
- For air-gapped environments only: 
  
  Download the Kommander application definitions:

  ```bash
  wget "https://downloads.d2iq.com/dkp/v2.2.0/kommander-applications_v2.2.0.tar.gz"
  ```
  
  Download the Kommander charts bundle:

  ```bash
  wget "https://downloads.d2iq.com/dkp/v2.2.0/dkp-kommander-charts-bundle-v2.2.0.tar.gz"
  ```
  
  If you have any DKP Catalog Applications, download the DKP Catalog Application charts bundle:

  ```bash
  wget "https://downloads.d2iq.com/dkp/v2.2.0/dkp-catalog-applications-charts-bundle-v2.2.0.tar.gz"
  ```

## Upgrade Kommander

Before running the following command, ensure that your `dkp` configuration **references the Kommander Management cluster**, otherwise it attempts to run the upgrade on the bootstrap cluster. You can do this by setting the `KUBECONFIG` environment variable [to the appropriate kubeconfig file's location][k8s_access_to_clusters].

<p class="message--note"><strong>NOTE:</strong> An alternative to initializing the KUBECONFIG environment variable as stated earlier is to use the <code>–kubeconfig=cluster_name.conf</code> flag. This ensures that Kommander upgrades on the workload cluster.</p>

1.  Use the DKP CLI to upgrade Kommander and all the Platform Applications in the Management Cluster:

    For air-gapped:

    ```bash
    dkp upgrade kommander --charts-bundle dkp-kommander-charts-bundle-v.2.2.0.tar.gz --kommander-applications-repository kommander-applications_v.2.2.0.tar.gz
    ```

    For non air-gapped:

    ```bash
    dkp upgrade kommander 
    ```

    An output similar to this appears: 
    
    ```bash
    $ dkp upgrade kommander  --kommander-applications-repository ~/work/git_repos/kommander-applications
    ✓ Ensuring upgrading conditions are met
    ✓ Ensuring application definitions are updated
    ✓ Ensuring helm-mirror implementation is migrated to chartmuseum
    ```

1.  If the upgrade fails, run the following command to get more information on the upgrade process:

    ```bash
    dkp upgrade kommander -v/verbose
    ```

1.  For Enterprise customers (multi-cluster environment): Upgrade your additional [Workspaces][upgrade_workspaces] on a per-Workspace basis to upgrade the Platform Applications on other clusters than the Management Cluster. 
    For Essential customers (single-cluster environment): Proceed with the [Konvoy Upgrade][konvoy_upgrade].

You can always go back to the [DKP Upgrade overview][dkp_upgrade], to review the next steps depending on your environment and license type.

[download_binary]: ../../download/
[AKS]: https://docs.microsoft.com/en-us/azure/aks/upgrade-cluster
[AWS]: /dkp/konvoy/2.2/choose-infrastructure/aws/advanced/update/
[Azure]: /dkp/konvoy/2.2/choose-infrastructure/azure/advanced/update/
[EKS]: https://docs.aws.amazon.com/eks/latest/userguide/update-cluster.html
[pre_provisioned]: /dkp/konvoy/2.2/choose-infrastructure/pre-provisioned/upgrade/control-plane/
[k8s_access_to_clusters]: https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[upgrade_workspaces]: ../../cli/dkp/upgrade/workspace
[release_notes]: ../../release-notes/
[konvoy_upgrade]: /dkp/kommander/2.2/dkp-upgrade/upgrade-konvoy/
[load_images]: ../../install/air-gapped/#load-the-docker-images-into-your-docker-registry
[dkp_upgrade]: ../../dkp-upgrade/
