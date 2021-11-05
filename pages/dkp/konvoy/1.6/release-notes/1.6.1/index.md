---
layout: layout.pug
navigationTitle: Release Notes Konvoy 1.6.1
title: Release Notes Konvoy 1.6.1
menuWeight: 2
excerpt: View release-specific information for Konvoy 1.6.1
beta: false
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ Konvoy version 1.6.1 was released on 17, December 2020.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

<p class="message--note"><strong>NOTE: </strong>A note on upgrading from 1.5.x to 1.6.1: There are some limitations upgrading to this Konvoy version due to the migration of Helm v2 to Helm v3 of large ConfigMaps to Helm v3 Secrets for Prometheus and the need to delete and redeploy this addon.
For more information, see <a href="../../addons/helmv2-to-v3-migration/">Helm v2 to v3 migration</a>.</p>

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.16.x |
|**Maximum** | 1.18.x |
|**Default** | 1.18.13 |

### New features and capabilities

- Added support for SUSE 15.

#### CLI

- Wait for an addon to be deleted before printing `[OK]` message. (COPS-6692)

#### API

- New `clusterConfiguration.spec.spec.kubernetes.apiserver.targetRamMB` to configure the `targetRamMB` value of the `kube-apiserver`.

#### Ansible

- Re-enabled coredns caching to reduce unnecessary load on API server.

#### AWS

- Fixed a regression that prevented adding new tags to EC2 instances after an initial provision run. (COPS-6687)

#### Addons

- Fixed a bug that prevented upgrades when the `kommander` addon is not installed. (COPS-6679)

#### Kubeaddons

- The kubeaddons-controller-manager now sets a Helm flag to limit the number of releases.
- Removed leader election for the `kubeaddon-controller` deployment to avoid the pod being terminated in the middle of an install operation.

#### Component versions

- Ansible v2.9.15.0
- Calico v3.16.5
- Containerd v1.3.9
- Docker v19.03.14
- Go 1.14.15
- Helm v3.3.4
- kubeaddons-dispatch stable-1.18-1.3.0
- kubeaddons-kommander stable-1.18-1.2.0
- kubernetes-base-addons stable-1.18-3.0.1
- Kubernetes v1.18.13
- Kubeaddons v0.23.7
- Mitogen a60c6c14a2473c895162a1b58a81bad0e63d1718
- Terraform v0.13.5
- Terraform AWS plugin ~> 3.0
- Terraform Azure plugin ~> 2.31
- Terraform GCP plugin ~> 3.42

<!--
##### Previous releases
Add links to previous release notes
-->

##### Additional resources

<!-- Add links to external documentation as needed -->

For information about installing and using Konvoy, see the [Konvoy documentation][konvoy-doc].

For information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[konvoy-doc]: ../../index.md
[kubernetes-doc]: https://kubernetes.io/docs/home/
