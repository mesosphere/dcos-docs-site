---
layout: layout.pug
navigationTitle: Upgrade
title: Upgrade
menuWeight: 5
excerpt: Upgrade Kommander
enterprise: false
---

Kommander is an addon running on a Konvoy cluster, it will be updated in the same way every [Konvoy addon is upgraded][addons-upgrade].

When upgrading Kommander, it is recommended to use the equivalent [new version of konvoy CLI and update][konvoy-upgrade] your `cluster.yaml` file according to the instructions.

## Kommander cluster creation before Konvoy v1.4.3

In versions before Konvoy v1.4.3 (where Kommander version is v1.0), new Kommander clusters cannot be created. It is recommended to upgrade to the latest version of Konvoy (v1.5.0), which includes Kommander 1.1.0 to be able to create new Kommander clusters.

## Kommander cluster limitations

Currently, when you upgrade Konvoy with Kommander, you can create Kommander clusters from the pre-upgraded version, and those clusters are available and can be managed from the upgraded version of Konvoy and Kommander. However, users cannot delete the cluster from the Kommander UI, after the Konvoy version was upgraded. The version of Konvoy, on the Kommander-created cluster, will also not upgrade after the user upgrades the Konvoy CLI. Users can not upgrade Kubernetes to a version greater than what was initially available when the cluster was created, in previous versions.

[addons-upgrade]: /ksphere/konvoy/latest/upgrade/upgrade-kubernetes-addons/#prepare-for-addons-upgrade
[konvoy-upgrade]: /ksphere/konvoy/latest/upgrade/upgrade-cli/
