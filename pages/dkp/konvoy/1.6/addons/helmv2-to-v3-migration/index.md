---
layout: layout.pug
navigationTitle: Helm v2 to v3 Migration
title: Helm v2 to v3 Migration
menuWeight: 6
excerpt: Steps to migrate from Helm v2 to v3 for Konvoy `v1.6.2`
beta: false
enterprise: false
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

## Upgrading Prometheus

If you have the prometheus and prometheusadapter addons enabled and are upgrading those, you need to take additional steps to ensure they deploy successfully. You must delete the addons and then upgrade and deploy them.

Before you begin the upgrade, you can run this command to get delete them:

```bash
kubectl delete addon prometheus -n kubeaddons
helm2 delete --purge prometheus-kubeaddons
```

If you've already ran the upgrade and deploying the prometheus and the prometheusadapter addons have failed, run these commands:

```bash
kubectl delete addon prometheus -n kubeaddons
helm2 delete --purge prometheus-kubeaddons
konvoy deploy addons
```

The reason for these failures is because there are limitations on the size of large configmaps in the migration of Helm v2 to Helm v3.

## Related information

For information on related topics or procedures, refer to the following:

- [Introduction to KBA](../)
- [Current KBA Release Information](../../release-notes/kubernetes-base-addon)
- [Create an Addon Repository](../addon-repositories)
- [Helm Tiller](https://v2.helm.sh/docs/install/#installing-tiller)
