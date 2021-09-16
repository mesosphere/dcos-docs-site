---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes Konvoy 1.8.3
menuWeight: 40
excerpt: View release-specific information for Konvoy 1.8.3
beta: false
enterprise: false
---
<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 1.8.3 was released on September 23, 2021.**

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**  | 1.18.x  |
| **Maximum**  | 1.20.x  |
| **Default**  | 1.20.10  |

### New features and capabilities

#### Air gapped

- Konvoy 1.8.1 was failing to deploy in an air-gapped cluster running in FIPS mode. (COPS-6992, COPS-6998)
- Include typha container image in the air-gap bundle. (COPS-6967)

#### Autoscaling

- Konvoy Autoscaling was failing with Terraform overwrites. (COPS-7005)

#### vSphere

- Fix segmentation fault when vSphere Server URL is not defined, or an empty string. (COPS-6907)

#### Prometheus

- Fixed an issue where Prometheus was raising alerts about missing rule evaluations. (COPS-7011)

### Component versions

- Ansible 2.9.16.0
- Calico 3.17.3
- Cluster-autoscaler v0.5.0
- Containerd v1.4.7
- Docker v19.03.15
- kubeaddons-dispatch stable-1.19-1.4.5
- kubeaddons-kommander stable-1.20-1.4.2
- kubernetes-base-addons stable-1.20-4.2.0
- Kubernetes v1.20.10
- Kubeaddons v0.26.0
- Mitogen a60c6c14a2473c895162a1b58a81bad0e63d1718
- Terraform v0.13.7
- Terraform AWS plugin ~> 3.0
- Terraform Azure plugin ~> 2.31
- Terraform GCP plugin ~> 3.42

## Additional resources

For information about working with native Kubernetes, see the [Kubernetes documentation](https://kubernetes.io/docs/home/).

[kubernetes-doc](https://kubernetes.io/docs/home/)
[konvoy-vsphere](/../../install/install-vsphere)
[konvoy-ccontrol-plane-certificates](/../../networking/control-plane-certificates/)
[security-groups-configuration](/../../install/install-aws/advanced-provisioning#security-groups)
