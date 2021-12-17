---
layout: layout.pug
navigationTitle: Post-upgrade cleanup
title: Remove unneeded Kubernetes resources after the upgrade
menuWeight: 10
excerpt: Steps to manually remove Konvoy 1.8 resources not used by Kommander 2.1
beta: false
---

<!-- markdownlint-disable MD0013 MD030 -->

After you complete the upgrade, some Kubernetes objects that belonged to Konvoy 1.8 addons, but are not used by Kommander 2.1 Platform Applications, could remain on the cluster. The existence of these objects has no impact on the function of Kommander 2.1. However, modifying or deleting these objects might corrupt the Kommander 2.1 installation produced by the upgrade. As a result, you should remove these objects using the following procedure:

## Components of the 1.8 logging stack

After a successful upgrade, the 1.8 addons no longer exist. Helm releases of Kibana, Elasticsearch, and Elasticsearch-Curator remain but are not managed by the addons, if they were installed.

Uninstall these Helm releases from the command line, using the command:

```sh
helm uninstall -n kubeaddons kibana-kubeaddons elasticsearch-curator-kubeaddons elasticsearch-kubeaddons elasticsearchexporter-kubeaddons
```

The output looks like the following:

```sh
release "kibana-kubeaddons" uninstalled
release "elasticsearch-curator-kubeaddons" uninstalled
release "elasticsearch-kubeaddons" uninstalled
release "elasticsearchexporter-kubeaddons" uninstalled
```

## Istio

If Istio is installed on the cluster, the upgrade retains the Helm Secret that belonged to the 1.8 Istio addon in the `istio-system` namespace.

<p class="message--note"><strong>WARNING: </strong>As long as this secret exists, <code>helm list -n istio-system</code> incorrectly reports the existence of an "istio-kubeaddons" Helm release. If you manipulate this "Helm release" using Helm, it might corrupt the Istio Platform Application in Kommander, which can disrupt operation of Istio workloads.</p>

Delete this secret using the `kubectl` command:

```sh
kubectl delete -n istio-system secret sh.helm.release.v1.istio-kubeaddons.v1
```

## Gatekeeper

If Gatekeeper is installed on the cluster, the upgrade leaves a Helm Secret, Deployments, and a Service that belonged to the 1.8 Gatekeeper addon in the `kubeaddons` namespace.

<p class="message--note"><strong>WARNING: </strong>As long as the secret exists, <code>helm list -n kubeaddons</code> incorrectly reports the existence of a "gatekeeper-kubeaddons" Helm release. If you manipulate this "Helm release" using Helm, it might corrupt the Gatekeeper Platform Application in Kommander, potentially making Kubernetes on the cluster inoperable.</p>

Delete these objects using the `kubectl`commands:

```sh
kubectl delete -n kubeaddons secret sh.helm.release.v1.gatekeeper-kubeaddons.v1
kubectl delete -n kubeaddons deployments gatekeeper-audit gatekeeper-controller-manager
kubectl delete -n kubeaddons service gatekeeper-webhook-service
```

<p class="message--note"><strong>WARNING: </strong>As long as the secret exists, <code>helm list -n kubeaddons</code> wrongly reports the existence of a "gatekeeper-kubeaddons" Helm release.
If you manipulate this "Helm release" using Helm, it might corrupt the Gatekeeper Platform Application in Kommander, potentially making Kubernetes on the cluster inoperable.</p>
