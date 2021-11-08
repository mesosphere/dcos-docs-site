---
layout: layout.pug
navigationTitle: Release Notes Konvoy 1.7.2
title: Release Notes Konvoy 1.7.2
menuWeight: 30
excerpt: View release-specific information for Konvoy 1.7.2
beta: false
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 1.7.2 was released on 8 April, 2021.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.17.x |
|**Maximum** | 1.19.x |
|**Default** | 1.19.9 |

<p class="message--note"><strong>NOTE: </strong>If you are upgrading to 1.7.2 with FIPS mode enabled, see the <a href="https://support.d2iq.com/s/article/Upgrading-Konvoy-V1-7-0-and-V1-7-1-FIPS-mode-clusters"</a>Upgrading Konvoy Knowledge Base article</a> before beginning.</p>

### New features and capabilities

#### CLI

- Fix a cluster configuration validation error that marked AWS GovCloud KMS ARNs invalid. (COPS-6884)
- Validate that Konvoy is not being run from a host in the Kubernetes cluster. (COPS-6878)

#### Terraform

- Fix a bug where running `konvoy` in AWS may destroy machines when `subnetIDs` are specified and the cluster is deployed in multiple Availability Zones. (COPS-6816)

#### Ansible

- Properly handle relative SSH key path in the `inventory.yaml` file. (COPS-6889)

#### Disable Calico Encapsulation

- Allow for setting `spec.containerNetworking.calico.encapsulation` to `none` to disable Calico encapsulation. (COPS-6836)

### Component versions

- Ansible 2.9.16.0
- Calico 3.17.3
- Cluster-autoscaler v0.4.0
- Containerd v1.3.9
- Docker v19.03.15
- Go 1.15.8
- Helm v3.3.5
- kubeaddons-dispatch stable-1.19-1.4.1
- kubeaddons-kommander stable-1.19-1.3.2
- kubernetes-base-addons stable-1.19-3.4.1
- Kubernetes v1.19.9
- Kubeaddons v0.24.1
- Mitogen a60c6c14a2473c895162a1b58a81bad0e63d1718
- Terraform v0.13.5
- Terraform AWS plugin ~> 3.0
- Terraform Azure plugin ~> 2.31

## Additional resources

<!-- Add links to external documentation as needed -->

For information about installing and using Konvoy, see the [Konvoy documentation][konvoy-doc].

For information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[konvoy-doc]: ../../
[kubernetes-doc]: https://kubernetes.io/docs/home/
