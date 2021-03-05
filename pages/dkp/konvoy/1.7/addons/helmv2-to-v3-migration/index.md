---
layout: layout.pug
navigationTitle: Helm v2 to v3 Migration
title: Helm v2 to v3 Migration
menuWeight: 6
excerpt: Steps to migrate from Helm v2 to v3 for Konvoy `v1.6.0`
---

<!-- markdownlint-disable MD018 -->

Starting with Konvoy `v1.6.0`, Helm v2 is no longer installed or used to deploy Konvoy Addons because Helm v2 is [deprecated due to security and operational issues](https://helm.sh/blog/helm-v2-deprecation-timeline/). Helm v3 is installed and is the primary mechanism for installation and maintenance of Konvoy Addons.

Upgrading from earlier versions of Konvoy includes an automatic migration process that requires no user input to migrate your Konvoy Addons to Helm v3. During this process, the Tiller (server) for  Helm v2, and any charts deployed with Helm v2, are not removed, but remains on your cluster. We recommend you manually remove the Helm v2 Tiller due to security issues, using the process below.

<p class="message--warning"><strong>WARNING: </strong>Do not remove the Helm v2 Tiller if you have deployed any charts not known by Konvoy. Deleting the Helm v2 Tiller can compromise the execution and integrity of these applications.</p>

## Before you begin

Ensure that you have [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) installed and configured for each Konvoy cluster.

## Remove Helm v2 tiller

Remove Helm v2 Tiller by enter the following command:

```bash
kubectl -n kube-system delete deployment tiller-deploy
```

This command shuts down Tiller gracefully and removes all its resources.

## Related information

For information on related topics or procedures, refer to the following:

- [Introduction to KBA](../)
- [Current KBA Release Information](../../release-notes/kubernetes-base-addon)
- [Create an Addon Repository](../addon-repositories)
- [Helm Tiller](https://v2.helm.sh/docs/install/#installing-tiller)
