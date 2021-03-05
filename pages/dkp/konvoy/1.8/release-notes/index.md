---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes Konvoy 1.8
menuWeight: 0
excerpt: View release-specific information for Konvoy 1.8
beta: true
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 1.8.0 beta 0 was released on 26, February 2021.**

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.18.x |
|**Maximum** | 1.20.x |
|**Default** | 1.20.2 |

### Upstream industry changes

The following sections refer to recent changes in the Open Source software used by DKP that may require action on your part as part of an upgrade or installation of D2iQ software.

#### Docker hub rate limiting

Docker Hub announced an [update](https://www.docker.com/blog/scaling-docker-to-serve-millions-more-developers-network-egress/) to their image pull policies in August, 2020. The change results in the need to change cluster configurations to accommodate new account structures that enable image pull rate limiting.

Rate limiting happens on a per-pull basis regardless of whether the pulled image is owned by a paid user. This means D2iQ, as owner of most images used in Konvoy, does not have any influence as to whether your current address is rate-limited or not. Konvoy does not have a strict dependency on Docker Hub accounts or plans.

For more information on addressing this limit, see [Docker hub rate limits](../operations/manage-docker-hub-rate-limits).

### New features and capabilities

#### Addons

- Switched the kubeaddons base image to distroless and run the controller as a non-root user. Addresses the static (not executed) CVE-2019-25013 in the prior base image.

#### Ansible

- Use the correct `k8s.gcr.io/pause:3.2` image.
- Fix an issue where `konvoy reset` would fail when removing Kubernetes directories when that directory is a mount point. (COPS-6771)

#### CLI

- Added support for RHEL/CentOS 7.9.
- The auto-provisioner can be now uninstalled if the `autoProvisioning.disabled` is set to `true` after the initial installation.
- Use the correct GPG key when installing FIPS RPM packages in an air-gapped environment.
- Include the missing `docker.io/mesosphere/pause:3.2` needed for air-gapped FIPS installation.

#### API

#### AWS

#### Azure

#### vSphere

- Terraform `wait_for_guest_net_routable` is now set to `false` to allow for air-gapped installations.

#### Diagnose

#### Kommander

#### Kubeaddons

#### Terraform

### Component versions

- Ansible 2.9.16.0
- Calico 3.17.1
- Cluster-autoscaler v0.5.0
- Containerd v1.3.9
- Docker v19.03.15
- Go 1.15.8
- Helm v3.5.2
- kubeaddons-dispatch stable-1.19-1.4.0
- kubeaddons-kommander testing-1.20-1.4.0-beta.0
- kubernetes-base-addons testing-1.20-4.0.0-alpha.1
- Kubernetes v1.20.2
- Kubeaddons v0.24.0
- Mitogen a60c6c14a2473c895162a1b58a81bad0e63d1718
- Terraform v0.13.5
- Terraform AWS plugin ~> 3.0
- Terraform Azure plugin ~> 2.31
- Terraform GCP plugin ~> 3.42

<!--
##### Previous releases
Add links to previous release notes
-->

## Additional resources

<!-- Add links to external documentation as needed -->

For information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[konvoy-doc]: ../introduction
[kubernetes-doc]: https://kubernetes.io/docs/home/
[konvoy-vsphere]: ../install/install-vsphere
