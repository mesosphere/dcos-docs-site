---
layout: layout.pug
navigationTitle: Uninstall
title: Uninstall
featureMaturity:
excerpt: Remove Kommander and related infrastructure
category: K-Sphere
menuWeight: 10
---

Uninstalling Kommander is roughly the same as [uninstalling Konvoy](/ksphere/konvoy/latest/uninstall) except for one critical difference: Managed clusters created by Kommander should be deleted before uninstalling the management Konvoy clusters, otherwise the state of those clusters will be lost and it would be necessary to manually delete those cluster assets on your cloud provider's console.

<p class="message--warning"><strong>WARNING: </strong>
To remove all Kommander clusters delete all managed clusters before uninstalling Konvoy.
</p>

You can see more details about uinstalling Konvoy in the [Konvoy Documentation](/ksphere/konvoy/latest/uninstall)
