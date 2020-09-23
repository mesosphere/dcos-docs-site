---
layout: layout.pug
navigationTitle: Remove Helm V2
title: Remove Helm V2
menuWeight: 7
excerpt: Removing Helm V2 Components
beta: true
enterprise: false
---

<!-- markdownlint-disable MD018 -->

## Before you begin

Ensure that you have [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) installed and configured for the Konvoy cluster which needs Tiller cleanup.

## Purging Helm V2 from Konvoy v1.6

Starting with Konvoy `v1.6.0`, we removed [Helm Version 2](https://v2.helm.sh) in favor of [Version 3](https://v3.helm.sh). This was due to Helm V2 becoming [deprecated over several security and operational issues](https://helm.sh/blog/helm-v2-deprecation-timeline/).

The page describes the procedure to remove Helm V2 when upgrading from Konvoy v1.5.

If you created your cluster with Konvoy `v1.5.x` or lower, the [Tiller](https://v2.helm.sh/docs/install/#installing-tiller) subcomponent of Helm V2 will remain on your cluster until it is manually removed. We recommend you remove it for security reasons.

Remove Tiller with the following command:

```shell
kubectl -n kube-system delete deployment tiller-deploy
```

The will shut down Tiller gracefully and remove all its resources.

## Related information

For information on related topics or procedures, refer to the following:

- [Introduction to KBA](../../addons)
- [Current KBA Release Information](../../release-notes/kubernetes-base-addon)
- [Create an Addon Repository](../../tutorials/addon-repositories)
