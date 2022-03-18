---
layout: layout.pug
navigationTitle: Upgrade Kommander
title: Upgrade Kommander
menuWeight: 20
excerpt: Steps to upgrade Kommander via CLI
beta: false
enterprise: true
---
 
This section automatically upgrades your Kommander cluster and all its Platform Applications to the latest versions. Kommander is installed on your Management cluster and upgrading it must be the first step you take when upgrading DKP, as it will prevent compatibility issues.

<p class="message--note"><strong>NOTE: </strong>It is important that you upgrade Kommander before upgrading Konvoy and Kubernetes. Kommander 2.1 does not support Kubernetes 1.22, and upgrading Kubernetes to 1.22 will be part of the Konvoy upgrade.</p>

## Prerequisites

- [Download][download-binary] and install the latest DKP CLI binary on your computer.
- Ensure you are on DKP version 2.1 or 2.1.1 and Kubernetes version 1.21.
- If you have attached clusters, ensure they are on Kubernetes versions 1.19, 1.20 or 1.21. To upgrade your Kubernetes version, refer to [AKS][AKS], [AWS][AWS], [Azure][Azure], [EKS][EKS], [pre-provisioned][pre-provisioned] documentation. [enterprise type="inline" size="small"/]
- Review the [Platform Application version updates][platform-apps] that are part of this upgrade.

## Upgrade Kommander

1.  In DKP CLI, use this command to upgrade Kommander and all Platform Applications in the Management cluster:

```bash
dkp upgrade kommander
```

<A confirmation message appears once upgrade is complete.>

1.  <Pending step: if confirmation message cannot be added on time, document a way to check the status of the upgrade in Management cluster.>

1.  If your environment has additional Workspaces (Managed and Attached clusters), upgrade your [Workspaces and their Platform applications][upgrade-workspaces] on a per-Workspace basis. If you only have one cluster, proceed with [Konvoy Upgrade][konvoy-upgrade].

[download-binary]: ../../download/
[AKS]: https://docs.microsoft.com/en-us/azure/aks/upgrade-cluster
[AWS]: /dkp/konvoy/2.2/choose-infrastructure/aws/advanced/update/
[Azure]: /dkp/konvoy/2.2/choose-infrastructure/azure/advanced/update/
[EKS]: https://docs.aws.amazon.com/eks/latest/userguide/update-cluster.html
[pre-provisioned]: /dkp/konvoy/2.2/choose-infrastructure/pre-provisioned/upgrade/control-plane/
[platform-apps]: ../../workspaces/applications/catalog-applications/
