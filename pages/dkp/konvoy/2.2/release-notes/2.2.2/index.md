---
layout: layout.pug
navigationTitle: DKP 2.2.2 Release Notes
title: DKP 2.2.2 Release Notes
menuWeight: 30
excerpt: View release-specific information for DKP 2.2.2
enterprise: false
beta: false
---
**D2iQ&reg; Konvoy&reg; version 2.2.2 was released on July 7th, 2022.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download DKP[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install DKP.</p>

## Release summary

Welcome to D2iQ Kubernetes Platform (DKP) 2.2.2! This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintains compatibility and support for other packages used in Konvoy.

DKP 2.2.x supports Kubernetes versions between 1.21.0 and 1.22.x. Any cluster you want to attach using DKP 2.2.x must be running a Kubernetes version in this range.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**  | 1.21.0  |
| **Maximum**  | 1.22.x  |
| **Default**  | 1.22.8  |

### Supported FIPS Manifests

|Operating System version   | Kubernetes version  | containerd version  | Manifest URL  |
|---------------------------|---------------------|---------------------|---------------|
| CentOS 7.9 | v1.22.8  | 1.14.13  | [v1.22.8 CentOS 7.9 Manifest][centos7] |
| Oracle 7.9 | v1.22.8  | 1.14.13  | [v1.22.8 OL 7.9 Manifest][oracle7] |
| RHEL 7.9 | v1.22.8  | 1.14.13  | [v1.22.8 EL 7.9 Manifest][rhel7] |
| RHEL 8.2 | v1.22.8  | 1.14.13  | [v1.22.8 EL 8.2 Manifest][rhel82] |
| RHEL 8.4 | v1.22.8  | 1.14.13  | [v1.22.8 EL 8.4 Manifest][rhel84] |

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

### FIPS Upgrade from 2.1.x to 2.2.x

If upgrading a FIPS cluster, there is a bug in the upgrade of `kube-proxy` `DaemonSet` in that it does not get automatically upgraded. To correctly upgrade, run the workaround command shown below:

```bash
kubectl set image -n kube-system daemonset.v1.apps/kube-proxy kube-proxy=docker.io/mesosphere/kube-proxy:v1.22.8_fips.0
```

## Component updates

When upgrading to this release, the following services and service components are upgraded to the listed version:

| Common Application Name | APP ID                                         | Version | Component Versions                                                                                                                        |
| ----------------------- | ---------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Cert Manager            | cert-manager                                   | 1.7.1   | - chart: 1.7.1<br>- cert-manager: 1.7.1                                                                                                 |
| Chartmuseum             | chartmuseum                                    | 3.6.2   | - chart: 3.6.2<br>- chartmuseum: 3.6.2                                                                                                  |
| Containerd              | containerd                                     | 1.4.11  |                                                                                                                                           |
| Dex                     | dex                                            | 2.9.14  | - chart: 2.9.14<br>- dex: 2.22.0                                                                                                        |
| External DNS            | external-dns                                   | 6.1.8   | - chart: 6.1.8<br>- external-dns: 0.10.2                                                                                                |
| Fluent Bit              | fluent-bit                                     | 0.19.20 | - chart: 0.19.20<br>- fluent-bit: 1.8.13                                                                                                |
| Flux                    | kommander-flux                                 | 0.27.4  |                                                                                                                                           |
| Gatekeeper              | gatekeeper                                     | 3.7.0   | - chart: 3.7.0<br>- gatekeeper: 3.7.0                                                                                                   |
| Grafana                 | grafana-logging                                | 6.22.0  | - chart: 6.22.0<br>- grafana: 8.3.6                                                                                                     |
| Loki                    | grafana-loki                                   | 0.33.2  | - chart: 0.33.1<br>- loki: 2.2.1                                                                                                        |
| Istio                   | istio                                          | 1.11.6  | - chart: 1.11.6<br>- istio: 1.11.5                                                                                                      |
| Jaeger                  | jaeger                                         | 2.29.0  | - chart: 2.29.0<br>- jaeger: 1.31.0                                                                                                     |
| Karma                   | karma                                          | 2.0.1   | - chart: 2.0.1<br>- karma: 0.88                                                                                                         |
| Kiali                   | kiali                                          | 1.47.0  | - chart: 1.47.0<br>- kiali: 1.47.0                                                                                                      |
| Knative                 | knative                                        | 0.3.9   | - chart: 0.3.9<br>- knative: 0.22.3                                                                                                     |
| Kube OIDC Proxy         | kube-oidc-proxy                                | 0.3.1   | - chart: 0.3.1<br>- kube-oidc-proxy: 0.3.0                                                                                              |
| Kube Prometheus Stack   | [kube-prometheus-stack][kube-prometheus-stack] | 33.1.6  | - chart: 33.1.5<br>- prometheus-operator: 0.54.1<br>- prometheus: 2.33.4<br>- prometheus alertmanager: 0.23.0<br>- grafana: 8.3.6 |
| Kubecost                | kubecost                                       | 0.23.3  | - chart: 0.23.3<br>- cost-analyzer: 1.91.2                                                                                              |
| Kubefed                 | kubefed                                        | 0.9.1   | - chart: 0.9.1<br>- kubefed: 0.9.1                                                                                                      |
| Kubernetes Dashboard    | kubernetes-dashboard                           | 5.1.1   | - chart: 5.1.1<br>- kubernetes-dashboard: 2.4.0                                                                                         |
| Kubetunnel              | kubetunnel                                     | 0.0.11  | - chart: 0.0.11<br>- kubetunnel: 0.0.11                                                                                                 |
| Logging Operator        | logging-operator                               | 3.17.2  | - chart: 3.17.2<br>- logging-operator: 3.17.2                                                                                           |
| Minio                   | minio-operator                                 | 4.4.10  | - chart: 4.4.10<br>- minio: 4.4.10                                                                                                      |
| NFS Server Provisioner  | nfs-server-provisioner                         | 0.6.0   | - chart: 0.6.0<br>- nfs-provisioner: 2.3.0                                                                                              |
| Nvidia                  | nvidia                                         | 0.4.4   | - chart: 0.4.4<br>- nvidia-device-plugin: 0.9.0                                                                                         |
| Grafana (project)       | project-grafana-logging                        | 6.20.6  | - chart: 6.20.6<br>- grafana: 8.3.6                                                                                                     |
| Loki (project)          | project-grafana-loki                           | 0.33.2  | - chart: 0.33.1<br>- loki: 2.2.1                                                                                                        |
|                         | project-logging                                | 1.0.0   |                                                                                                                                           |
| Prometheus Adapter      | prometheus-adapter                             | 2.17.1  | - chart: 2.17.1<br>- prometheus-adapter: 0.9.1                                                                                          |
| Reloader                | reloader                                       | 0.0.104 | - chart: 0.0.104<br>- reloader: 0.0.104                                                                                                 |
| Thanos                  | thanos                                         | 0.4.6   | - chart: 0.4.6<br>- thanos: 0.9.0                                                                                                       |
| Traefik                 | traefik                                        | 10.9.1  | - chart: 10.9.1<br>- traefik: 2.5.6                                                                                                     |
| Traefik ForwardAuth     | traefik-forward-auth                           | 0.3.6   | - chart: 0.3.6<br>- traefik-forward-auth: 3.1.0                                                                                         |
| Velero                  | velero                                         | 3.2.0   | - chart: 3.2.0<br>- velero: 1.5.2                                                                                                       |

## Additional resources

For more information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

For a full list of attributed 3rd party software, see [d2iq.com/legal/3rd](http://d2iq.com/legal/3rd).

[kube-prometheus-stack]: https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack
[kubernetes-doc]: https://kubernetes.io/docs/home/
[attach-cluster]: ../../clusters/attach-cluster#attaching-a-cluster
[konvoy-self-managed]: /dkp/konvoy/2.1/choose-infrastructure/aws/quick-start-aws#optional-move-controllers-to-the-newly-created-cluster
[project-custom-applications-git-repo]: ../../projects/applications/catalog-applications/custom-applications/add-create-git-repo
[flux-cli]: https://fluxcd.io/docs/installation/
[centos7]: https://downloads.d2iq.com/dkp/fips/v2.2.2/manifest-centos-79.json
[oracle7]: https://downloads.d2iq.com/dkp/fips/v2.2.2/manifest-oracle-79.json.asc
[rhel7]: https://downloads.d2iq.com/dkp/fips/v2.2.2/manifest-rhel-79.json
[rhel82]: https://downloads.d2iq.com/dkp/fips/v2.2.2/manifest-rhel-82.json
[rhel84]: https://downloads.d2iq.com/dkp/fips/v2.2.2/manifest-rhel-84.json
