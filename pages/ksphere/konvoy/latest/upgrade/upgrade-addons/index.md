---
layout: layout.pug
navigationTitle: Upgrade platform service add-ons
title: Upgrade platform service add-ons
menuWeight: 25
excerpt: Upgrade individual add-on platform services for your Konvoy cluster
enterprise: false
---

Konvoy platform service add-ons are managed by a library that pulls default configuration details from the [kubeadd-ons-configs](https://github.com/mesosphere/kubeadd-ons-configs) repository.

Versioning for the platform service add-ons is managed by [git tags](https://git-scm.com/book/en/v2/Git-Basics-Tagging) and [github releases](https://help.github.com/en/articles/creating-releases) within the [kubeadd-ons-configs](https://github.com/mesosphere/kubeadd-ons-configs) repository.

Addons are deployed to the cluster as part of the `konvoy deploy` command.
The `konvoy deploy` command uses the version of `kubeadd-ons-configs` declared in the `cluster.yaml` configuration file using the `spec.add-ons.version` setting.
For example:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1alpha1
metadata:
  name: konvoy_v0.0.19
spec:
  add-ons:
    version: v0.0.20
```

You can edit this version setting to deploy a different version of add-ons to your cluster.
After modifying the `cluster.yaml` file, you can update the Konvoy cluster by running the following command:

```bash
konvoy deploy
```
