---
layout: layout.pug
beta: true
navigationTitle: Uninstall
title: Uninstall
featureMaturity:
excerpt: Remove Kommander and related infrastructure
category: K-Sphere
menuWeight: 10
---

### How can I remove the Kommander Cluster?

Uninstalling Kommander is roughly the same as [uninstalling Konvoy](/ksphere/konvoy/latest/uninstall) except for one critical difference: Managed clusters created by Kommander should be deleted before uninstalling the management Konvoy clusters, otherwise the state of those clusters will be lost and it would be necessary to manually delete those cluster assets on your cloud provider's console.

<p class="message--warning"><strong>WARNING: </strong>
For a complete deletion remove all managed clusters before uninstalling Kommander.
</p>

You can see more details about uinstalling Konvoy in the [Konvoy Documentation](/ksphere/konvoy/latest/uninstall)

### What happens to my provisioned clusters if I remove the Kommander Cluster?

Managed clusters created by Kommander will not be deleted.
Workloads, even if managed by Kommander, will continue to work as before but managing them centrally won’t be possible anymore.
If you have an Identity Provider (IDP) configured neither the login nor the kubeconfig that uses the IDP will be working. You can still use the administrator kubeconfig that can be loaded from the UI to access your managed cluster.
