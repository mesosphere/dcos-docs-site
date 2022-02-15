---
layout: layout.pug
beta: false
navigationTitle: Upgrade
title: Upgrade
menuWeight: 5
excerpt: Upgrade Kommander
enterprise: false
---

Kommander is also an addon running on a Konvoy cluster. It is updated in the same way as every [Konvoy addon is upgraded][addons-upgrade].

When upgrading Kommander, use the equivalent [new version of the Konvoy CLI and update][konvoy-upgrade] for your `cluster.yaml` file according to the instructions. Confirm that you are using the `configVersion` for [Kommander that matches the version of the Konvoy CLI][version-support-policy] you are deploying.

[addons-upgrade]: /dkp/konvoy/1.8/upgrade/upgrade-kubernetes-addons/#prepare-for-addons-upgrade
[konvoy-upgrade]: /dkp/konvoy/1.8/upgrade/upgrade-cli/
[version-support-policy]: ../version-policy/
