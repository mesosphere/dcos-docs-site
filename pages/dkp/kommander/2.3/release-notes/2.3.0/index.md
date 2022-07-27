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
|-------------------------|--------|---------|--------------------|
| Centralized Grafana | centralized-grafana | 34.9.3 | - chart: 34.9.3<br>- prometheus-operator: 0.55.0 |
| Centralized Kubecost | centralized-kubecost | 0.26.0 | - chart: 0.26.0<br>- kubecost: 1.95.0 |
| Cert Manager | cert-manager | 1.7.1 | - chart: 1.7.1<br>- cert-manager: 1.7.1 |
| Chartmuseum | chartmuseum | 3.9.0 | - chart: 3.9.0<br>- chartmuseum: 3.9.0 |
| Dex | dex | 2.9.18 | - chart: 2.9.18<br>- dex: 2.31.0 |
| Dex K8s Authenticator | dex-k8s-authenticator | 1.2.13 | - chart: 1.2.13<br>- dex-k8s-authenticator: 1.2.4 |
| DKP Insights Management | dkp-insights-management | 0.2.2 | - chart: 0.2.2<br>- dkp-insights-management: 0.2.2 |
| External DNS | external-dns | 6.5.5 | - chart: 6.5.5<br>- external-dns: 0.12.0 |
| Fluent Bit | fluent-bit | 0.19.20 | - chart: 0.19.20<br>- fluent-bit: 1.8.13 |
| Gatekeeper | gatekeeper | 3.8.1 | - chart: 3.8.1<br>- gatekeeper: 3.8.1 |
| Gitea | gitea | 5.0.9 | - chart: 5.0.9<br>- gitea: 1.16.8 |
| Grafana Logging | grafana-logging | 6.28.0 | - chart: 6.28.0<br>- grafana: 8.5.0 |
| Grafana Loki | grafana-loki | 0.48.4 | - chart: 0.48.4<br>- loki: 2.5.0 |
| Istio | istio | 1.14.1 | - chart: 1.14.1<br>- istio: 1.14.1 |
| Jaeger | jaeger | 2.32.2 | - chart: 2.32.2<br>- jaeger: 1.34.1 |
| Karma | karma | 2.0.1 | - chart: 2.0.1<br>- karma: 0.70 |
| Kiali | kiali | 1.52.0 | - chart: 1.52.0<br>- kiali: 1.52.0 |
| Knative | knative | 0.4.0 | - chart: 0.4.0<br>- knative: 0.22.3 |
| Kube OIDC Proxy | kube-oidc-proxy | 0.3.1 | - chart: 0.3.1<br>- kube-oidc-proxy: 0.3.0 |
| Kube Prometheus Stack | kube-prometheus-stack | 34.9.3 | - chart: 34.9.3<br>- prometheus-operator: 0.55.0<br>- prometheus: 2.34.0<br>- prometheus-alertmanager: 0.24.0<br>- grafana: 8.5.0 |
| Kubecost | kubecost | 0.26.0 | - chart: 0.26.0<br>- kubecost: 1.95.0 |
| Kubefed | kubefed | 0.9.2 | - chart: 0.9.2<br>- kubefed: 0.9.2 |
| Kubernetes Dashboard | kubernetes-dashboard | 5.1.1 | - chart: 5.1.1<br>- kubernetes-dashboard: 2.4.0 |
| Kubetunnel | kubetunnel | 0.0.13 | - chart: 0.0.13<br>- kubetunnel: 0.0.13 |
| Logging Operator | logging-operator | 3.17.7 | - chart: 3.17.7<br>- logging-operator: 3.17.7 |
| Metallb | metallb | 0.12.3 | - chart: 0.12.3<br>- metallb: 0.8.1 |
| MinIO Operator | minio-operator | 4.4.25 | - chart: 4.4.25<br>- minio-operator: 4.4.25 |
| NFS Server Provisioner | nfs-server-provisioner | 0.6.0 | - chart: 0.6.0<br>- nfs-server-provisioner: 2.3.0 |
| Nvidia | nvidia | 0.4.4 | - chart: 0.4.4<br>- nvidia-device-plugin: 0.1.4 |
| Grafana (project) | project-grafana-logging | 6.28.0 | - chart: 6.28.0<br>- grafana: 8.5.0 |
| Grafana Loki (project) | project-grafana-loki | 0.48.3 | - chart: 0.48.3<br>- loki: 2.5.0 |
| Prometheus Adapter | prometheus-adapter | 2.17.1 | - chart: 2.17.1<br>- prometheus-adapter: 0.9.1 |
| Reloader | reloader | 0.0.110 | - chart: 0.0.110<br>- reloader: 0.0.110 |
| Thanos | thanos | 0.4.6 | - chart: 0.4.6<br>- thanos: 0.17.1 |
| Traefik | traefik | 10.9.1 | - chart: 10.9.1<br>- traefik: 2.5.6 |
| Traefik ForwardAuth | traefik-forward-auth | 0.3.8 | - chart: 0.3.8<br>- traefik-forward-auth: 3.1.0 |
| Velero | velero | 3.2.3 | - chart: 3.2.3<br>- velero: 1.5.2 |

## Known issues


## Additional resources

<!-- Add links to external documentation as needed -->

For more information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[kube-prometheus-stack]: https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack
[kubernetes-doc]: https://kubernetes.io/docs/home/
