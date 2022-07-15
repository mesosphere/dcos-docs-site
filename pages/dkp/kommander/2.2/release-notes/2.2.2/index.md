---
layout: layout.pug
navigationTitle: DKP 2.2.2 Release Notes
title: DKP 2.2.2 Release Notes
menuWeight: 30
excerpt: View release-specific information for DKP 2.2.2
enterprise: false
beta: false
---
**D2iQ&reg; Kommander&reg; version 2.2.2 was released on July 7th, 2022.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download DKP[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install DKP.</p>

## Release summary

Welcome to D2iQ Kubernetes Platform (DKP) 2.2.2! This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintains compatibility and support for other packages used in Kommander.

DKP 2.2.x supports Kubernetes versions between 1.21.0 and 1.22.x. Any cluster you want to attach using DKP 2.2.x must be running a Kubernetes version in this range.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**  | 1.21.0  |
| **Maximum**  | 1.22.x  |
| **Default**  | 1.22.8  |

## Fixes and Improvements

### Added Continuous Deployment(CD)/Gitops to the View role

The CD/Gitops resource was added to the 'View' clusterRole, so that users with only this permission can view the CD/Gitops resources.

### Fixed containerd vulnerability  (COPS-7531)

DKP packages now include updated containerd and FIPS manifests, mitigating a known containerd vulnerability.

### Updated Azure support to fix an issue with specifying Additional Tags (COPS-7346)

The Cluster API Azure (CAPZ) support was updated to resolve a race condition that could prevent the creation of additional resource tags.

### Updated Traefik Forward Auth to support 'clusterStorage' option. (COPS-7344)

The Traefik Forward Auth (TFA) component was updated to support storing of session cookies in-cluster instead of in the browser.

### Kiali Platform Application not working properly (COPS-7336)

An installation issue that caused the Kiali platform application to malfunction has been corrected.

### Updated Dex CRDS (COPS-7341)

The DEX Custom Resource Definitions used for configuring LDAP have been updated to include the correct syntax.

### DKP custom credentials plugin restored (COPS-7343)

The mesosphere/dex-k8s-authenticator docker container now includes the appropriate binaries that allow users to download the referenced 'konvoy-async-plugin' after configuring a cluster using an external IDP for authentication.

## Component updates

When upgrading to this release, the following services and service components are upgraded to the listed version:

| Common Application Name | APP ID                                         | Version | Component Versions                                                                                                                        |
| Common Application Name | APP ID | Version | Component Versions |
|-------------------------|--------|---------|--------------------|
| Centralized Grafana | centralized-grafana | 33.1.6 | - chart: 33.1.6<br>- grafana: 0.55.0 |
| Centralized Kubecost | centralized-kubecost | 0.23.3 | - chart: 0.23.3<br>- kubecost: 1.94.3 |
| Cert Manager | cert-manager | 1.7.1 | - chart: 1.7.1<br>- cert-manager: 1.9.0-beta.1 |
| Chartmuseum | chartmuseum | 3.6.2 | - chart: 3.6.2<br>- chartmuseum: 3.6.2 |
| Dex | dex | 2.9.18 | - chart: 2.9.18<br>- dex: 2.31.0 |
| Dex K8s Authenticator | dex-k8s-authenticator | 1.2.9 | - chart: 1.2.9<br>- dex-k8s-authenticator: 1.2.4 |
| DKP Insights Management | dkp-insights-management | 0.1.6 | - chart: 0.1.6<br>- dkp-insights-management: 0.1.6 |
| External DNS | external-dns | 6.2.7 | - chart: 6.2.7<br>- external-dns: 0.12.0 |
| Fluent Bit | fluent-bit | 0.19.20 | - chart: 0.19.20<br>- fluent-bit: 1.9.5 |
| Gatekeeper | gatekeeper | 3.7.0 | - chart: 3.7.0<br>- gatekeeper: 3.9.0-rc.1 |
| Gitea | gitea | 5.0.6 | - chart: 5.0.6<br>- gitea: 1.16.8 |
| Grafana Logging | grafana-logging | 6.22.0 | - chart: 6.22.0<br>- grafana: 9.0.2 |
| Grafana Loki | grafana-loki | 0.33.1 | - chart: 0.33.1<br>- loki: 2.6.0 |
| Istio | istio | 1.11.6 | - chart: 1.11.6<br>- istio: 1.14.1 |
| Jaeger | jaeger | 2.29.0 | - chart: 2.29.0<br>- jaeger: 1.35.0 |
| Karma | karma | 2.0.1 | - chart: 2.0.1<br>- karma: 0.70 |
| Kiali | kiali | 1.49.0 | - chart: 1.49.0<br>- kiali: 1.53.0 |
| Knative | knative | 0.3.9 | - chart: 0.3.9<br>- knative: 0.22.3 |
| Kube OIDC Proxy | kube-oidc-proxy | 0.3.1 | - chart: 0.3.1<br>- kube-oidc-proxy: 0.3.0 |
| Kube Prometheus Stack | kube-prometheus-stack | 33.1.6 | - chart: 33.1.6<br>- grafana: 8.5.0<br>- prometheus-operator: 0.55.0<br>- prometheus: 2.34.0<br>- prometheus-alertmanager: 0.24.0 |
| Kubecost | kubecost | 0.23.3 | - chart: 0.23.3<br>- kubecost: 1.94.3 |
| Kubefed | kubefed | 0.9.2 | - chart: 0.9.2<br>- kubefed: 0.9.2 |
| Kubernetes Dashboard | kubernetes-dashboard | 5.1.1 | - chart: 5.1.1<br>- kubernetes-dashboard: 2.6.0 |
| Kubetunnel | kubetunnel | 0.0.11 | - chart: 0.0.11<br>- kubetunnel: 0.0.13 |
| Logging Operator | logging-operator | 3.17.2 | - chart: 3.17.2<br>- logging-operator: 3.17.7 |
| Metallb | metallb | 0.12.3 | - chart: 0.12.3<br>- metallb: 0.8.1 |
| MinIO Operator | minio-operator | 4.4.10 | - chart: 4.4.10<br>- minio-operator: 4.4.25 |
| NFS Server Provisioner | nfs-server-provisioner | 0.6.0 | - chart: 0.6.0<br>- nfs-server-provisioner: 2.3.0 |
| Nvidia | nvidia | 0.4.4 | - chart: 0.4.4<br>- nvidia-device-plugin: 0.1.4 |
| Grafana (project) | project-grafana-logging | 6.22.0 | - chart: 6.22.0<br>- grafana: 9.0.2 |
| Grafana Loki (project) | project-grafana-loki | 0.33.1 | - chart: 0.33.1<br>- loki: 2.6.0 |
| Prometheus Adapter | prometheus-adapter | 2.17.1 | - chart: 2.17.1<br>- prometheus-adapter: 0.9.1 |
| Reloader | reloader | 0.0.104 | - chart: 0.0.104<br>- reloader: 0.0.117 |
| Thanos | thanos | 0.4.6 | - chart: 0.4.6<br>- thanos: 0.17.1 |
| Traefik | traefik | 10.9.1 | - chart: 10.9.1<br>- traefik: 2.8.0 |
| Traefik ForwardAuth | traefik-forward-auth | 0.3.8 | - chart: 0.3.8<br>- traefik-forward-auth: 3.1.0 |
| Velero | velero | 3.1.5 | - chart: 3.1.5<br>- velero: 1.5.2 |

## Additional resources

For more information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

For a full list of attributed 3rd party software, see [d2iq.com/legal/3rd](http://d2iq.com/legal/3rd).

[kube-prometheus-stack]: https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack
[kubernetes-doc]: https://kubernetes.io/docs/home/
