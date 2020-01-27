---
layout: layout.pug
navigationTitle: Upgrade platform service addons
title: Upgrade platform service addons
menuWeight: 25
excerpt: Upgrade individual addon platform services for your Konvoy cluster
enterprise: false
---

Konvoy platform service addons are managed by a library that pulls default configuration details from the [kubernetes-base-addons](https://github.com/mesosphere/kubernetes-base-addons) repository.

Versioning for the platform service addons is managed by [git tags](https://git-scm.com/book/en/v2/Git-Basics-Tagging) and [github releases](https://help.github.com/en/articles/creating-releases) within the [kubernetes-base-addons](https://github.com/mesosphere/kubernetes-base-addons) repository.

Addons are deployed to the cluster as part of the `konvoy deploy` command.
The `konvoy deploy` command uses the version of `kubernetes-base-addons` declared in the `cluster.yaml` configuration file using the `spec.addons.version` setting.
For example:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1alpha1
metadata:
  name: konvoy_v0.0.19
spec:
  addons:
    version: v0.0.20
```

You can edit this version setting to deploy a different version of addons to your cluster.
After modifying the `cluster.yaml` file, you can update the Konvoy cluster by running the following command:

```bash
konvoy deploy
```
