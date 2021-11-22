---
layout: layout.pug
navigationTitle: Post-upgrade cleanup
title: Remove unneeded Kubernetes resources after the upgrade
menuWeight: 10
excerpt: Steps to manually remove Konvoy 1.8 resources not used by Kommander 2.1
beta: true
---

After upgrade is complete, some Kubernetes objects that belonged to Konvoy 1.8
Addons but are not used by Kommander 2.1 Platform Applications might remain on
the cluster.

While existence of these objects has no impact on the function of Kommander 2.1,
arbitrarily modifying or deleting them can corrupt the Kommander 2.1
installation produced by the upgrade. Therefore, removing these objects
requires specific steps.

## Components of the 1.8 logging stack

After successful upgrade, 1.8 Addons no longer exist. Helm releases of Kibana,
Elacticsearch and Elasticsearch-Curator remain not managed by the Addons
if they were installed.

From then on, you can uninstall the Helm releases manually using Helm from
the command line:

```sh
helm uninstall -n kubeaddons kibana-kubeaddons elasticsearch-curator-kubeaddons elasticsearch-kubeaddons
```

The output sholud look like the following:

```sh
release "kibana-kubeaddons" uninstalled
release "elasticsearch-curator-kubeaddons" uninstalled
release "elasticsearch-kubeaddons" uninstalled
```

## Istio

If Istio is installed on the cluster, upgrade will leave the Helm Secret
that belonged to the 1.8 Istio Addon in the `istio-system` namespace.

It is safe to delete this secret using `kubectl` after successful upgrade:

```sh
kubectl delete -n istio-system secret sh.helm.release.v1.istio-kubeaddons.v1
```

<p class="message--note"><strong>WARNING: </strong>
As long as this secret exists, <code>helm list -n istio-system</code>
will wrongly report existence of a Helm release called "istio-kubeaddons".
If you manipulate this "Helm release" using Helm, it may corrupt the Istio
Platform Application in Kommander, potentially disrupting operation of
Istio workloads.
</p>

## Gatekeeper

If Gatekeeper is installed on the cluster, upgrade will leave a Helm Secret,
Deployments and a Service that belonged to the 1.8 Gatekeeper Addon
in the `kubeaddons` namespace.

It is safe to delete these objects using `kubectl` after successful upgrade:

```sh
kubectl delete -n kubeaddons secret sh.helm.release.v1.gatekeeper-kubeaddons.v1
kubectl delete -n kubeaddons deployments gatekeeper-audit gatekeeper-controller-manager
kubectl delete -n kubeaddons service gatekeeper-webhook-service

```

<p class="message--note"><strong>WARNING: </strong>
As long as the secret exists, <code>helm list -n kubeaddons</code>
will wrongly report existence of a Helm release called "gatekeeper-kubeaddons".
If you manipulate this "Helm release" using Helm, it may corrupt the Gatekeeper
Platform Application in Kommander, potentially making Kubernetes on the cluster
inoperable.
</p>
