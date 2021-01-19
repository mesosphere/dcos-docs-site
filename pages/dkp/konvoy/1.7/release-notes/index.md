---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes Konvoy 1.7 beta 0
menuWeight: 0
excerpt: View release-specific information for Konvoy 1.7
beta: true
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 1.7.0 beta 0 was released on 21, December 2020.**

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.16.x |
|**Maximum** | 1.18.x |
|**Default** | 1.18.13 |
|**Default** | 1.19.x |

### Breaking changes

### New features and capabilities

- Added support for SUSE 15.
- Added FIPS enablement for Kubernetes objects created in Konvoy.
- Periodic container scanning and reporting.
- Support for vSphere virtual machines (VMs) as a provider during cluster provisioning.

#### CLI

- Wait for an addon to be deleted before printing `[OK]` message. (COPS-6692)
- Now cleanup dangling docker container `pinata-sshd` when running `konvoy down`.

#### API

- New `clusterConfiguration.spec.spec.kubernetes.apiserver.targetRamMB` to configure the `targetRamMB` value of the `kube-apiserver`.
- New `clusterConfiguration.spec.loggingOptions` to configure systemd-journald settings.
- For `clusterConfiguration.containerRuntime.data` use the Containerd configuration merge rather than using Golang. Nested data will now be properly merged without requiring to add all parent configuration.

#### Ansible

- Addded retries when adding iptable rules to avoid errors when another program may have a lock on the table.
- Re-enabled coredns caching to reduce unnecessary load on API server.

#### Terraform

- Disabled color output when running without a tty.

#### AWS

- Fixed a regression that prevented adding new tags to EC2 instances after an initial provision run. (COPS-6687)
- Tag AWS key pairs created by Konvoy.
- Fixed the apiserver being spammed by a handshake TLS errors by using an HTTPs instead of a TCP health probe on the `kube-apiserver` ELB.

#### Addons

- Fixed a bug that prevented upgrades when the `kommander` addon is not installed.

#### Kommander

- Validate AWS & Azure credentials are valid before saving them.

#### Diagnose

- New flag `--filter-files`, a comma separated list of regular expressions of files that will not be included in the diagnostics bundle.

#### Kubeaddons

- Removed leader election for the `kubeaddon-controller` deployment to avoid the pod being terminated in the middle of an install operation.
- The kubeaddons-controller-manager now sets a Helm flag to limit the number of releases.

#### Component versions

- Ansible v2.9.15.0
- Calico v3.16.5
- Cluster-autoscaler v0.3.0
- Containerd v1.3.9
- Docker v19.03.14
- Go 1.15.6
- Helm v3.3.4
- kubeaddons-dispatch stable-1.18-1.3.1
- kubeaddons-kommander testing-1.18-1.3.0-beta.0
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

[konvoy-doc]: ../index.md
[kubernetes-doc]: https://kubernetes.io/docs/home/
