---
layout: layout.pug
navigationTitle: DKP 2.2.3 Release Notes
title: DKP 2.2.3 Release Notes
menuWeight: 30
excerpt: View release-specific information for DKP 2.2.3
enterprise: false
beta: false
---
**D2iQ&reg; Kommander&reg; version 2.2.3 was released on October 25th, 2022.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download DKP[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install DKP.</p>

## Release summary

Welcome to D2iQ Kubernetes Platform (DKP) 2.2.3! This release fixes reported issues, integrates changes from previous releases, and maintains compatibility and support for other packages used in Kommander.

DKP 2.2.x supports Kubernetes versions between 1.21.0 and 1.22.x. Any cluster you want to attach using DKP 2.2.x must be running a Kubernetes version in this range.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**  | 1.21.0  |
| **Maximum**  | 1.22.x  |
| **Default**  | 1.22.8  |

## Fixes and Improvements

### Workload clusters cannot be successfully attached when the management cluster uses a custom domain and certificate (D2IQ-93002)

A problem that caused the kommander federation-controller to use system certificates instead of the configured custom certificates was corrected. The federation-controller now uses custom certificates if they are present.  

### Missing Cert-manager images in air-gapped bundles (D2IQ-93002)

The air-gapped image bundles did not include images for cert-manager, which prevented successful deployment of the platform applications to managed and attached clusters in those environments. The bundle has been updated to include the correct images.

## Component and Application updates

When upgrading to this release, the following services and service components are upgraded to the listed version:

### Components

- CAPPPVersion = "v0.8.4"
- CAPZVersion  = "v1.3.1"
- Containerd 1.4.13
- KIB v1.17.2

### Applications

| Common Application Name | APP ID | Version | Component Versions |
|-------------------------|--------|---------|--------------------|
| Centralized Grafana | centralized-grafana | 33.1.6 | - chart: 33.1.6<br>- prometheus-operator: 0.54.1 |
| Centralized Kubecost | centralized-kubecost | 0.23.3 | - chart: 0.23.3<br>- kubecost: 1.91.2 |
| Cert Manager | cert-manager | 1.7.1 | - chart: 1.7.1<br>- cert-manager: 1.7.1 |
| Chartmuseum | chartmuseum | 3.6.2 | - chart: 3.6.2<br>- chartmuseum: 3.6.2 |
| Dex | dex | 2.9.18 | - chart: 2.9.19<br>- dex: 2.31.0 |
| Dex K8s Authenticator | dex-k8s-authenticator | 1.2.10 | - chart: 1.2.9<br>- dex-k8s-authenticator: 1.2.2 |
| DKP Insights Management | dkp-insights-management | 0.1.6 | - chart: 0.1.6<br>- dkp-insights-management: 0.1.6 |
| External DNS | external-dns | 6.2.7 | - chart: 6.2.7<br>- external-dns: 0.11.0 |
| Fluent Bit | fluent-bit | 0.19.20 | - chart: 0.19.20<br>- fluent-bit: 1.8.13 |
| Gatekeeper | gatekeeper | 3.7.0 | - chart: 3.7.0<br>- gatekeeper: 3.7.0 |
| Gitea | gitea | 5.0.6 | - chart: 5.0.6<br>- gitea: 1.16.6 |
| Grafana Logging | grafana-logging | 6.22.0 | - chart: 6.22.0<br>- grafana: 8.3.6 |
| Grafana Loki | grafana-loki | 0.33.3 | - chart: 0.33.1<br>- loki: 2.2.1 |
| Istio | istio | 1.11.6 | - chart: 1.11.6<br>- istio: 1.11.5 |
| Jaeger | jaeger | 2.29.0 | - chart: 2.29.0<br>- jaeger: 1.31.0 |
| Karma | karma | 2.0.1 | - chart: 2.0.1<br>- karma: 0.70 |
| Kiali | kiali | 1.49.1 | - chart: 1.49.0<br>- kiali: 1.49.0 |
| Knative | knative | 0.3.9 | - chart: 0.3.9<br>- knative: 0.22.3 |
| Kube OIDC Proxy | kube-oidc-proxy | 0.3.1 | - chart: 0.3.1<br>- kube-oidc-proxy: 0.3.0 |
| Kube Prometheus Stack | kube-prometheus-stack | 33.1.6 | - chart: 33.1.6<br>- prometheus-operator: 0.54.1<br>- grafana: 8.3.6<br>- prometheus: 2.33.4<br>- prometheus-alertmanager: 0.23.0 |
| Kubecost | kubecost | 0.23.3 | - chart: 0.23.3<br>- kubecost: 1.91.2 |
| Kubefed | kubefed | 0.9.2 | - chart: 0.9.2<br>- kubefed: 0.9.2 |
| Kubernetes Dashboard | kubernetes-dashboard | 5.1.1 | - chart: 5.1.1<br>- kubernetes-dashboard: 2.4.0 |
| Kubetunnel | kubetunnel | 0.0.11 | - chart: 0.0.11<br>- kubetunnel: 0.0.11 |
| Logging Operator | logging-operator | 3.17.3 | - chart: 3.17.2<br>- logging-operator: 3.17.2 |
| Metallb | metallb | 0.12.3 | - chart: 0.12.3<br>- metallb: 0.8.1 |
| MinIO Operator | minio-operator | 4.4.10 | - chart: 4.4.10<br>- minio-operator: 4.4.10 |
| NFS Server Provisioner | nfs-server-provisioner | 0.6.0 | - chart: 0.6.0<br>- nfs-server-provisioner: 2.3.0 |
| Nvidia | nvidia | 0.4.4 | - chart: 0.4.4<br>- nvidia-device-plugin: 0.2.0 |
| Grafana (project) | project-grafana-logging | 6.20.6 | - chart: 6.22.0<br>- grafana: 8.3.6 |
| Grafana Loki (project) | project-grafana-loki | 0.33.3 | - chart: 0.33.1<br>- loki: 2.2.1 |
| Prometheus Adapter | prometheus-adapter | 2.17.1 | - chart: 2.17.1<br>- prometheus-adapter: 0.9.1 |
| Reloader | reloader | 0.0.104 | - chart: 0.0.104<br>- reloader: 0.0.104 |
| Thanos | thanos | 0.4.6 | - chart: 0.4.6<br>- thanos: 0.17.1 |
| Traefik | traefik | 10.9.1 | - chart: 10.9.1<br>- traefik: 2.5.6 |
| Traefik ForwardAuth | traefik-forward-auth | 0.3.8 | - chart: 0.3.8<br>- traefik-forward-auth: 3.1.0 |
| Velero | velero | 3.1.5 | - chart: 3.1.5<br>- velero: 1.5.2 |

## Additional resources

For more information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

For a full list of attributed 3rd party software, see [d2iq.com/legal/3rd](http://d2iq.com/legal/3rd).

[kube-prometheus-stack]: https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack
[kubernetes-doc]: https://kubernetes.io/docs/home/
