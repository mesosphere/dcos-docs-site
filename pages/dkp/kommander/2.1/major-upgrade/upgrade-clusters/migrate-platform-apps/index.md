---
layout: layout.pug
navigationTitle: Adapt Applications
title: Adapt addons/platform applications to Kommander
menuWeight: 10
excerpt: Adapt Konvoy addons to Kommander
beta: false
---

In previous versions of Konvoy, D2IQ provided a set of predefined, pre-configured open source applications. These applications provided a better environment for your installation. These applications were referred to as _Kubernetes Based Addons (KBAs)_. The architecture and terminology has now changed. Konvoy no longer has _KBAs_. These are now stored and managed through Kommander and are known as _platform applications_.

<p class="message--note"><strong>NOTE: </strong>Kubernetes distributions contain their own set of _addons_. These _addons_ are not part of the adaptation process.</p>

This command automatically adapts your Konvoy addons to Kommander platform applications. Certain applications may need [manual configuration changes](./prepare-apps) prior to adapting.

## Prerequisites

To successfully adapt your applications you must have the following configurations:

- A Konvoy 1.8 cluster.

<p class="message--note"><strong>NOTE: </strong>On your Konvoy cluster ensure that Kommander is not running. The <code>kommander</code> addon must not be enabled in your <code>cluster.yaml</code> file.</p>

- The Kommander CLI binary installed on your computer. Refer to the **Download** topic to install Kommander.

<!-- Put link to download here. -->

<p class="message--note"><strong>NOTE: </strong>For the adaption to complete successfully, Kommander must not be running.</p>

## Move your applications

The following step describes how to adapt your existing platform applications to Kommander.

Enter the following command to start the adaption process:

```sh
kommander migrate -y
```

As the command progresses, your output looks like the following:

```sh
 ✓ Checking if migration from DKP 1.x is necessary
Found the following Konvoy 1.x addons:
cert-manager
dashboard
dex
dex-k8s-authenticator
konvoyconfig
kube-oidc-proxy
metallb
nvidia
opsportal
reloader
traefik
traefik-forward-auth
velero
...
 ✓ Checking if migration from DKP 1.x is necessary
 ✓ Ensuring applications repository fetcher is deployed
 ✓ Ensuring base resources are deployed
 ✓ Ensuring Flux is deployed
 ✓ Ensuring helm repository configuration is deployed
 ✓ Ensuring Kommander Root CA is deployed
 ✓ Ensuring Gitea is deployed
 ✓ Ensuring Application definitions are deployed
 ✓ Ensuring Bootstrap repository is deployed
 ✓ Ensuring Age encryption is deployed
 ✓ Ensuring Flux configuration is deployed
 ✓ Ensuring Kommander App Management is deployed
 ✓ Ensuring Konvoy Config is migrated
 ✓ Ensuring Traefik ingress controller is migrated
 ✓ Ensuring Gatekeeper is migrated
 ✓ Ensuring Reloader is migrated
 ✓ Ensuring External DNS is migrated
 ✓ Ensuring MetalLB is migrated
 ✓ Ensuring Dex is migrated
 ✓ Ensuring Traefik Forward Auth is migrated
 ✓ Ensuring Kubernetes OIDC proxy is migrated
 ✓ Ensuring Dex authenticator is migrated
 ✓ Ensuring Kubernetes Dashboard is migrated
 ✓ Ensuring Nvidia is migrated
 ✓ Ensuring Velero is migrated
 ✓ Ensuring Fluent-Bit is migrated and the DKP 2.x Logging Stack is installed
 ✓ Ensuring deletion of Addon elasticsearch orphaning its Helm release
 ✓ Ensuring deletion of Addon elasticsearch-curator orphaning its Helm release
 ✓ Ensuring deletion of Addon kibana orphaning its Helm release
 ✓ Ensuring deletion of Addon prometheus-elasticsearch-exporter orphaning its Helm release
 ✓ Ensuring KubePrometheusStack (Prometheus and Grafana) is migrated
 ✓ Ensuring Prometheus Adapter is migrated
 ✓ Ensuring Istio is migrated
 ✓ Ensuring Jaeger Operator is migrated
 ✓ Ensuring Kiali is migrated
 ✓ Ensuring deletion of ClusterAddon kommander orphaning its Helm release
 ✓ Ensuring deletion of ClusterAddon awsebscsiprovisioner orphaning its Helm release
 ✓ Ensuring deletion of ClusterAddon cert-manager orphaning its Helm release
 ✓ Ensuring deletion of ClusterAddon defaultstorageclass-protection orphaning its Helm release
 ✓ Ensuring deletion of Addon konvoyconfig orphaning its Helm release
 ✓ Ensuring deletion of Addon opsportal orphaning its Helm release
 ✓ Ensuring deletion of Addon gatekeeper orphaning its Helm release
 ✓ Ensuring check that there remain no addons and deletion of the Kubeaddons controller

Refer to the [Verify installation](../../../install/networked#verify-installation) topic to ensure successfull completion.

## Optional post-upgrade cleanup

If you had certain applications installed, upgrade might leave Kubernetes
objects that belonged to Konvoy but are not used by Kommander. While you can
safely disregard these objects, you should not arbitrarily remove or modify
them, or use third-party tools (like Helm) that expect these objects to be
in a correct state against these objects.

If you want to clean these objects up, you need to perform
[specific steps](./cleanup) after a successful upgrade.

<p class="message--note"><strong>NOTE: </strong>Error messages may display during the adaptation process. These messages show a temporary state. These processes will eventually succeed.</p>

Refer to the [Verify installation](../install/networked#verify_installation) topic to ensure successfull completion.

## Related Information

- [Supported applications](./supported-apps)
