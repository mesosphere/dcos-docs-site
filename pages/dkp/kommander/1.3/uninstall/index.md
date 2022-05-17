---
layout: layout.pug
beta: false
navigationTitle: Uninstall
title: Uninstall
excerpt: Remove Kommander and related infrastructure
menuWeight: 13
---

## Remove a Kommander Cluster

Uninstalling Kommander is similar to [uninstalling Konvoy][uninstall-konvoy] except for one critical difference: Managed clusters created by Kommander must be deleted before uninstalling the management Konvoy clusters, otherwise the state of those clusters will be lost and it would be necessary to manually delete those cluster assets on your cloud provider's console.

<p class="message--warning"><strong>WARNING: </strong>
For complete deletion remove all managed clusters before uninstalling Kommander.
</p>

For more details about uninstalling Konvoy, see the [Konvoy Documentation][uninstall-konvoy].

**What happens to my provisioned clusters if I remove the Kommander Cluster?**

Managed clusters created by Kommander will not be deleted. Workloads, even if managed by Kommander, will continue to work as before but managing them centrally won’t be possible anymore.
If you have an Identity Provider (IDP) configured, neither the login nor the kubeconfig that uses the IDP will be working. You can still use the administrator kubeconfig, which can be loaded from the UI to access your managed cluster.

[uninstall-konvoy]: /dkp/konvoy/1.7/uninstall
