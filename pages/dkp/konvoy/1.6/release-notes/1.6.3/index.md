---
layout: layout.pug
navigationTitle: Release Notes Konvoy 1.6.3
title: Release Notes Konvoy 1.6.3
menuWeight: 30
excerpt: View release-specific information for Konvoy 1.6.3
beta: false
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 1.6.3 was released on 25 March, 2021.**

<p class="message--warning"><strong>WARNING: </strong> We recommend users upgrading from Konvoy 1.5.x to Konvoy 1.6.x, first upgrade to Konvoy 1.5.6 then upgrade to Konvoy 1.6.3. Failure to follow this specific upgrade path causes Prometheus upgrade failures.</p>

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.16.x |
|**Maximum** | 1.18.x |
|**Default** | 1.18.13 |

### Known Issues

### New features and capabilities

#### Terraform

- Fix a bug where running `konvoy` in AWS may destroy machines when `subnetIDs` are specified and the cluster is deployed in multiple Availability Zones. (COPS-6816)

### Component versions

- Ansible v2.9.16.0
- Calico v3.16.8
- Cluster-autoscaler v0.2.4
- Containerd v1.3.9
- Docker v19.03.15
- Go 1.14.15
- Helm v3.3.4
- kubeaddons-dispatch stable-1.18-1.3.0
- kubeaddons-kommander stable-1.18-1.2.2
- kubernetes-base-addons stable-1.18-3.3.0
- Kubernetes v1.18.16
- Kubeaddons v0.25.0
- Mitogen a60c6c14a2473c895162a1b58a81bad0e63d1718
- Terraform v0.13.5
- Terraform AWS plugin ~> 3.0
- Terraform Azure plugin ~> 2.31
- Terraform GCP plugin ~> 3.42
