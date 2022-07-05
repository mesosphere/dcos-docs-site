---
layout: layout.pug
navigationTitle: DKP 2.3.0 Release Notes
title: DKP 2.3 Release Notes
menuWeight: 10
excerpt: View release-specific information for DKP 2.3.0
enterprise: false
beta: false
---

**D2iQ&reg; Kommander&reg; (DKP&reg;) version 2.3 was released on <!-- xxxxx -->.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download DKP[/button]


[Download](../../download/) and [install](../../install/) the latest version to get started.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download Kommander. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install this product.</p>

## Release summary

Welcome to D2iQ Kubernetes Platform (DKP) 2.3! This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

DKP 2.3 supports Kubernetes versions between 1.21.0 and 1.23.x. Any cluster you want to attach using DKP 2.3 must be running a Kubernetes version in this range.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.21.0 |
|**Maximum** | 1.23.x |
|**Default** | 1.23.0|

## New features and capabilities

The following features and capabilities are new for Version 2.2.

### Feature 1

<!-- placeholder -->

### Custom domains and certificates for Workload (Managed and Attached) clusters

If you have an Enterprise license, you can now set up a custom domain and certificate for your Managed or Attached cluster. For more information on how to do this, refer to the [Configuration instructions](../../clusters/custom-domain-certificate/configuration/).

## Component updates

When upgrading to this release, the following services and service components are upgraded to the listed version:

| Common Application Name | APP ID | Version | Component Versions |
|----------------------|--------------------- |---------|--------------------|
| Cert Manager | cert-manager | 1.7.1 | - chart: 1.7.1<br>- cert-manager: 1.7.1 |
| Chartmuseum | chartmuseum | 3.6.2 | - chart: 3.6.2<br>- chartmuseum: 3.6.2 |
| Dex | dex | 2.9.14  | - chart: 2.9.14<br>- dex: 2.22.0 |
| External DNS | external-dns | 6.1.8  | - chart: 6.1.8<br>- external-dns: 0.10.2 |
| Fluent Bit | fluent-bit | 0.19.20 | - chart: 0.19.20<br>- fluent-bit: 1.8.13 |
| Flux | kommander-flux | 0.27.4 |  |
| Gatekeeper | gatekeeper | 3.7.0 | - chart: 3.7.0<br>- gatekeeper: 3.7.0 |
| Grafana | grafana-logging | 6.22.0 | - chart: 6.22.0<br>- grafana: 8.3.6 |
| Loki | grafana-loki | 0.33.2 | - chart: 0.33.1<br>- loki: 2.2.1  |
| Istio | istio | 1.11.6 | - chart: 1.11.6<br>- istio: 1.11.5 |
| Jaeger | jaeger | 2.29.0  | - chart: 2.29.0<br>- jaeger: 1.31.0 |
| Karma | karma | 2.0.1 | - chart: 2.0.1<br>- karma: 0.88 |
| Kiali | kiali | 1.47.0 | - chart: 1.47.0<br>- kiali: 1.47.0 |
| Knative | knative | 0.3.9 | - chart: 0.3.9<br>- knative: 0.22.3 |
| Kube OIDC Proxy | kube-oidc-proxy | 0.3.1 | - chart: 0.3.1<br>- kube-oidc-proxy: 0.3.0 |
| Kube Prometheus Stack | [kube-prometheus-stack][kube-prometheus-stack] | 33.1.5 | - chart: 33.1.5 <br>- prometheus-operator: 0.54.1<br>- prometheus: 2.33.4<br>- prometheus alertmanager: 0.23.0<br>- grafana: 8.3.6 |
| Kubecost | kubecost | 0.23.3 | - chart: 0.23.3<br>- cost-analyzer: 1.91.2 |
| Kubefed | kubefed | 0.9.1 | - chart: 0.9.1<br>- kubefed: 0.9.1 |
| Kubernetes Dashboard | kubernetes-dashboard | 5.1.1 | - chart: 5.1.1<br>- kubernetes-dashboard: 2.4.0 |
| Kubetunnel | kubetunnel | 0.0.11 | - chart: 0.0.11<br>- kubetunnel: 0.0.11 |
| Logging Operator | logging-operator | 3.17.2 | - chart: 3.17.2<br>- logging-operator: 3.17.2 |
| Minio | minio-operator | 4.4.10 | - chart: 4.4.10<br>- minio: 4.4.10 |
| NFS Server Provisioner | nfs-server-provisioner | 0.6.0 | - chart: 0.6.0<br>- nfs-provisioner: 2.3.0 |
| Nvidia | nvidia | 0.4.4 | - chart: 0.4.4<br>- nvidia-device-plugin: 0.9.0 |
| Grafana (project) | project-grafana-logging| 6.20.6 | - chart: 6.20.6<br>- grafana: 8.3.6 |
| Loki (project) | project-grafana-loki | 0.33.2 | - chart: 0.33.1<br>- loki: 2.2.1 |
|  | project-logging | 1.0.0 |  |
| Prometheus Adapter | prometheus-adapter | 2.17.1 | - chart: 2.17.1<br>- prometheus-adapter: 0.9.1 |
| Reloader | reloader | 0.0.104 | - chart: 0.0.104<br>- reloader: 0.0.104 |
| Thanos | thanos | 0.4.6 | - chart: 0.4.6<br>- thanos: 0.9.0 |
| Traefik | traefik | 10.9.1 | - chart: 10.9.1<br>- traefik: 2.5.6 |
| Traefik ForwardAuth | traefik-forward-auth | 0.3.6 | - chart: 0.3.6<br>- traefik-forward-auth: 3.1.0 |
| Velero | velero | 3.2.0 | - chart: 3.2.0<br>- velero: 1.5.2 |

## Known issues


## Additional resources

<!-- Add links to external documentation as needed -->

For more information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[kube-prometheus-stack]: https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack
[kubernetes-doc]: https://kubernetes.io/docs/home/
