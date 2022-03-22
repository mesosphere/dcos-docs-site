---
layout: layout.pug
navigationTitle: Upgrade Kommander
title: Upgrade Kommander
menuWeight: 20
excerpt: Steps to upgrade Kommander via CLI
beta: false
enterprise: true
---
 
This section describes how to upgrade your Kommander Management cluster and all Platform Applications to their latest versions. To prevent compatibility issues, you must first upgrade Kommander on your Management Cluster before upgrading to DKP.

<p class="message--note"><strong>NOTE: </strong>It is important you upgrade Kommander BEFORE upgrading the Kubernetes version (or Konvoy version for Managed Konvoy clusters) in attached clusters, due to the previous versions' incompatibility with 1.22.</p>

## Prerequisites

- [Download][download-binary] and install the latest DKP CLI binary on your computer.
- Ensure you are on DKP version 2.1 or 2.1.1 and Kubernetes version 1.21.
- If you have attached clusters, ensure they are on Kubernetes versions 1.19, 1.20 or 1.21. To upgrade your Kubernetes version, refer to the appropriate documentation for your environment: [AKS][AKS], [AWS][AWS], [Azure][Azure], [EKS][EKS], [pre-provisioned][pre-provisioned].
- Review the [Platform Application version updates][platform-apps] that are part of this upgrade.

## Upgrade Kommander

1.  Before running the following command, ensure that your `dkp` configuration **references the Kommander Management cluster**, otherwise it attempts to run the upgrade on the bootstrap cluster. You can do this by setting the `KUBECONFIG` environment variable [to the appropriate kubeconfig file's location][k8s-access-to-clusters].

    <p class="message--note"><strong>NOTE:</strong> An alternative to initializing the KUBECONFIG environment variable as stated earlier is to use the <code>–kubeconfig=cluster_name.conf</code> flag. This ensures that Kommander is upgraded on the workload cluster.</p>

1.  Use the DKP CLI to upgrade Kommander and all the Platform Applications in the Management cluster:

    ```bash
    dkp upgrade kommander
    ```

    <A confirmation message appears once upgrade is complete.>

1.  <Pending step: if confirmation message cannot be added on time, document a way to check the status of the upgrade in Management cluster.>

1.  If your environment has additional Workspaces (Managed and Attached clusters), upgrade your [Workspaces and their Platform applications][upgrade-workspaces] on a per-Workspace basis. If you only have a Management cluster, proceed with [Konvoy Upgrade][konvoy-upgrade].

[download-binary]: ../../download/
[AKS]: https://docs.microsoft.com/en-us/azure/aks/upgrade-cluster
[AWS]: /dkp/konvoy/2.2/choose-infrastructure/aws/advanced/update/
[Azure]: /dkp/konvoy/2.2/choose-infrastructure/azure/advanced/update/
[EKS]: https://docs.aws.amazon.com/eks/latest/userguide/update-cluster.html
[pre-provisioned]: /dkp/konvoy/2.2/choose-infrastructure/pre-provisioned/upgrade/control-plane/
[k8s-access-to-clusters]: https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[platform-apps]: ../../workspaces/applications/catalog-applications/
