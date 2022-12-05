---
layout: layout.pug
navigationTitle: Release Notes Konvoy 2.1.5
title: Release Notes Konvoy 2.1.5
menuWeight: 60
excerpt: View release-specific information for Konvoy 2.1.5
enterprise: false
beta: false
---

**D2iQ&reg; Konvoy&reg; version 2.1.5 was released on December 1st, 2022.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

To get started with Konvoy, [download](../../download/) and [install](../../choose-infrastructure/) the latest version of Konvoy.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

## Fixes and Improvements

<!-- vale Vale.Avoid = NO -->
### Wrong MachineDeployment (nodepool) names after Konvoy v1.8.5 to DKP v2.1.3 upgrade (D2IQ-93614)
<!-- vale Vale.Avoid = YES -->

Corrected an issue where a `MachineDeployment` would be incorrectly named when running `dkp describe cluster` after upgrading from Konvoy v1.8. to v2.1.

<!-- vale Vale.Avoid = NO -->
### Pre-provisioned cluster adoption is broken (D2IQ-94144)
<!-- vale Vale.Avoid = YES -->

Corrected an issue that prevented the upgrade of pre-provisioned clusters in Konvoy 2.1.

### Konvoy Image Builder (KIB) Update to version 1.5.2
An update for KIB has been included with this release. Refer to the [public repository][publicrepo] for more information.

## Component updates

The following services and service components are upgraded to the listed version:

| Common Application Name | APP ID | Version | Component Versions |
|-------------------------|--------|---------|--------------------|
| Centralized Grafana | centralized-grafana | 18.1.3 | - chart: 18.1.3<br>- prometheus-operator: 0.50.0 |
| Centralized Kubecost | centralized-kubecost | 0.20.0 | - chart: 0.20.0<br>- kubecost: 1.88.0 |
| Cert Manager | cert-manager | 0.2.7 | - chart: 0.2.7<br>- cert-manager: 1.0.3 |
| Dex | dex | 2.9.10 | - chart: 2.9.10<br>- dex: 2.22.0 |
| Dex K8s Authenticator | dex-k8s-authenticator | 1.2.9 | - chart: 1.2.9<br>- dex-k8s-authenticator: 1.2.2 |
| External DNS | external-dns | 2.20.5 | - chart: 2.20.5<br>- external-dns: 0.7.0 |
| Fluent Bit | fluent-bit | 0.16.2 | - chart: 0.16.2<br>- fluent-bit: 1.8.3 |
| Gatekeeper | gatekeeper | 0.6.9 | - chart: 0.6.9<br>- gatekeeper: 3.4.0-rc.1 |
| Gitea | gitea | 4.1.1 | - chart: 4.1.1<br>- gitea: 1.15.3 |
| Grafana Logging | grafana-logging | 6.16.14 | - chart: 6.16.14<br>- grafana: 8.2.1 |
| Grafana Loki | grafana-loki | 0.33.1 | - chart: 0.33.1<br>- loki: 2.2.1 |
| Istio | istio | 1.9.1 | - chart: 1.9.1<br>- istio: 1.9.1 |
| Jaeger | jaeger | 2.21.0 | - chart: 2.21.0<br>- jaeger: 1.22.0 |
| Karma | karma | 2.0.0 | - chart: 2.0.0<br>- karma: 0.70 |
| Kiali | kiali | 1.29.1 | - chart: 1.29.1<br>- kiali: 1.29.1 |
| Knative | knative | 0.3.9 | - chart: 0.3.9<br>- knative: 0.22.3 |
| Kube OIDC Proxy | kube-oidc-proxy | 0.2.5 | - chart: 0.2.5<br>- kube-oidc-proxy: 0.2.0 |
| Kube Prometheus Stack | kube-prometheus-stack | 18.1.3 | - chart: 18.1.3<br>- prometheus-operator: 0.50.0<br>- grafana: 8.2.1<br>- prometheus: 2.28.1<br>- prometheus-alertmanager: 0.22.2 |
| Kubecost | kubecost | 0.20.0 | - chart: 0.20.0<br>- kubecost: 1.88.0 |
| Kubefed | kubefed | 0.9.0 | - chart: 0.9.0<br>- kubefed: 0.9.0 |
| Kubernetes Dashboard | kubernetes-dashboard | 5.0.2 | - chart: 5.0.2<br>- kubernetes-dashboard: 2.3.1 |
| Kubetunnel | kubetunnel | 0.0.8 | - chart: 0.0.8<br>- kubetunnel: 0.0.8 |
| Logging Operator | logging-operator | 3.15.0 | - chart: 3.15.0<br>- logging-operator: 3.15.0 |
| Metallb | metallb | 0.12.2 | - chart: 0.12.2<br>- metallb: 0.8.1 |
| MinIO Operator | minio-operator | 4.1.7 | - chart: 4.1.7<br>- minio-operator: 4.1.3 |
| NFS Server Provisioner | nfs-server-provisioner | 0.6.0 | - chart: 0.6.0<br>- nfs-server-provisioner: 2.3.0 |
| Nvidia | nvidia | 0.4.3 | - chart: 0.4.3<br>- nvidia-device-plugin: 0.2.0 |
| Grafana (project) | project-grafana-logging | 6.16.14 | - chart: 6.16.14<br>- grafana: 8.2.1 |
| Grafana Loki (project) | project-grafana-loki | 0.33.1 | - chart: 0.33.1<br>- loki: 2.2.1 |
| Prometheus Adapter | prometheus-adapter | 2.11.1 | - chart: 2.11.1<br>- prometheus-adapter: 0.8.3 |
| Reloader | reloader | 0.0.99 | - chart: 0.0.99<br>- reloader: 0.0.99 |
| Thanos | thanos | 0.4.5 | - chart: 0.4.5<br>- thanos: 0.17.1 |
| Traefik | traefik | 10.3.0 | - chart: 10.3.0<br>- traefik: 2.5.0 |
| Traefik ForwardAuth | traefik-forward-auth | 0.3.2 | - chart: 0.3.2<br>- traefik-forward-auth: 3.0.2 |
| Velero | velero | 3.1.5 | - chart: 3.1.5<br>- velero: 1.5.2 |

## Additional resources

For more information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

For a full list of attributed 3rd party software, see [d2iq.com/legal/3rd](http://d2iq.com/legal/3rd).

[kubernetes-doc]: https://kubernetes.io/docs/home/
[konvoy-self-managed]: /dkp/konvoy/2.1/choose-infrastructure/aws/advanced/self-managed
[flux-cli]: https://fluxcd.io/docs/installation/
[acme]: https://cert-manager.io/docs/configuration/acme/
[config_kub]: https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[selfsigned]: https://cert-manager.io/docs/configuration/selfsigned/
[publicrepo]: https://github.com/mesosphere/konvoy-image-builder/releases/tag/v1.5.2
