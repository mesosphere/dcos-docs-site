---
layout: layout.pug
navigationTitle: Helm v2 to v3 Migration
title: Helm v2 to v3 Migration
menuWeight: 6
excerpt: We discuss the migration from Helm v2 to v3 in Konvoy `v1.6.0`
beta: true
enterprise: false
---

<!-- markdownlint-disable MD018 -->

## Helm v2 to v3 Migration

Starting with Konvoy `v1.6.0`, Helm v2 will not be installed nor used to deploy Addons. Instead, Helm v3 is the primary mechanism for installation and maintenance of charts.

Upgrading from previous versions of Konvoy will include a migration process for each installed Addon.

The migration process itself is automatic and does not require any user input. However, Helm v2's Tiller will not be removed, nor any charts deployed with Helm v2.

To remove Tiller please refer below.

## Removing Helm v2 from Konvoy v1.6

### Before you begin

Ensure that you have [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) installed and configured for the Konvoy cluster which needs Tiller cleanup.

### Removing Tiller

Starting with Konvoy `v1.6.0`, we removed [Helm Version 2](https://v2.helm.sh) in favor of [Version 3](https://v3.helm.sh). This was due to Helm v2 becoming [deprecated over several security and operational issues](https://helm.sh/blog/helm-v2-deprecation-timeline/).

The page describes the procedure to remove Helm v2 when upgrading from Konvoy v1.5.

If you created your cluster with Konvoy `v1.5.x` or lower, the [Tiller](https://v2.helm.sh/docs/install/#installing-tiller) subcomponent of Helm v2 will remain on your cluster until it is manually removed. We recommend you remove it for security reasons.

Remove Tiller with the following command:

```shell
kubectl -n kube-system delete deployment tiller-deploy
```

The will shut down Tiller gracefully and remove all its resources.

## Related information

For information on related topics or procedures, refer to the following:

- [Introduction to KBA](../)
- [Current KBA Release Information](../../release-notes/kubernetes-base-addon)
- [Create an Addon Repository](../../tutorials/addon-repositories)
