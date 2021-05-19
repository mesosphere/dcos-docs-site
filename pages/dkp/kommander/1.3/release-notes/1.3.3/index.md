---
layout: layout.pug
beta: false
navigationTitle: Release Notes Kommander 1.3.3
title: Release Notes Kommander 1.3.3
menuWeight: 40
excerpt: View release-specific information for Kommander 1.3.3
enterprise: false
---

**D2iQ&reg; Kommander&reg; version 1.3.3 was released on x, May 2021.**

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Konvoy[/button]

To get started with Kommander, [download](/dkp/konvoy/latest/download/) and [install](/dkp/konvoy/latest/install/) the latest version of Konvoy.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

# Release Summary
Kommander provides a command center for all your cloud native management needs in public Information as a Service (IaaS), on-premises, and edge environments. Kommander provides a multi-tenant experience to create, secure, and configure Kubernetes clusters and cloud native workloads. Additionally, Kommander enables teams to unlock federated cost management across multiple clusters, whether they are a new Konvoy cluster or an existing 3rd party/DIY distribution installation.

# Known issues

In versions prior to 1.3.3, Kubecost cost-analyzer by default requests a PVC of size 0.2Gi. This may cause issues with certain provisioners that require a minimum storage size of 1Gi. To resolve this issue, upgrade to 1.3.3 following the upgrade instructions below.

## Upgrading
The default cost-analyzer persistent volume size has been increased to 32Gi. Upgrades may require manual intervention if your provisioner does not support volume expansion. Here are some recommendations from the [Kubecost storage documentation](https://github.com/kubecost/docs/blob/master/storage.md):

**If you are upgrading an existing version of Kommander**
  - If your provisioner does supports volume expansion, we will automatically resize you to a 32GB disk in an upgrade.
  - If your provisioner does not support volume expansion:
    - If you have not added or modified Kubecost configuration from the settings page on the Kubecost frontend, you can safely delete the PV and upgrade.
      - We suggest you delete the old PV, then upgrade Kommander.
    - If you cannot safely delete the PV storing your configs and configure them on a new PV:
      - If you are not on a regional cluster, we recommend that you provision a second PV by setting `kubecost.cost-analyzer.persistentVolume.dbPVEnabled=true` in your cluster.yaml under Kommander values.
      - If you are on a regional cluster,  we recommend that you provision a second PV using a topology-aware storage class ([more info](https://kubernetes.io/blog/2018/10/11/topology-aware-volume-provisioning-in-kubernetes/#getting-started)). You can set this disk’s storage class by setting `kubecost.cost-analyzer.persistentVolume.dbStorageClass=<your-topology-aware-storage-class-name>`.

# Bug fixes

- UI: Resolved kubecost performance issue.
- Increased the default Kubecost cost-analyzer PVC storage size from 0.2Gi to 32Gi to resolve deployment issues that occurred with provisioners that require a minimum size of 1Gi. See Upgrading above if upgrading from a previous version. (COPS-6937)


## Component versions

- Addon: 1.3.3-4
- Chart: 0.15.12
- kommander-federation (yakcl): 0.8.11
- kommander-licensing (yakcl): 0.8.11
- UI: 6.91.3
- kommander-karma: 0.3.12
- kubeaddons-catalog: 0.1.15
- kommander-thanos: 0.1.16
- kubecost: 0.11.0
- grafana: 6.6.0
- karma: 0.70
- thanos: 0.10.1
- cost-analyzer: 1.79.1

