---
layout: layout.pug
navigationTitle: Helm v2 to v3 Migration
title: Helm v2 to v3 Migration
menuWeight: 6
excerpt: Steps to migrate from Helm v2 to v3 for Konvoy `v1.6.3`
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

If you have the prometheus addon enabled, you must delete the addon before upgrading.

Before you begin the upgrade, run the following command to delete the addon:

```bash
kubectl delete addon prometheus --namespace kubeaddons --wait
```

<p class="message--warning"><strong>NOTE: </strong>Deleting the Prometheus addon won't delete its data, because Prometheus uses a PersistentVolume.</p>

If you've **already run the upgrade and deploying the prometheus addon has failed**, run this command:

```bash
helm2 delete --purge prometheus-kubeaddons
```

This assumes helm2 CLI has been installed. If it hasn't, you will need to install it.
If you've already ran the Konvoy upgrade, the Addon resource has been updated.
After you've deleted this old Helm data from the above command and the failing helm release has been removed, kubeaddons can successfully reconcile the Addon.

If you want to verify the status of your prometheus addon state, you can monitor that with the following:

```bash
kubectl --namespace kubeaddons get addon prometheus --watch
```

The migration of a helm release from Helm v2 to Helm v3 adds additional metadata to the release data structure.
This additional data causes the Prometheus release data to exceed the maximum size of a ConfigMap or Secret.
Newer versions of the Prometheus chart reduces the amount of data held in this release structure, but the conversion will fail preventing the newer Prometheus chart installation from being reached.
Removing the oversized data from Kubernetes allows the replacement to continue.

## Related information

For information on related topics or procedures, refer to the following:

- [Introduction to KBA](../)
- [Current KBA Release Information](../../release-notes/kubernetes-base-addon)
- [Create an Addon Repository](../addon-repositories)
- [Helm Tiller](https://v2.helm.sh/docs/install/#installing-tiller)
