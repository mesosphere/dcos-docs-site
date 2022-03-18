---
layout: layout.pug
navigationTitle: Release Notes
title: Konvoy 2.2 Release Notes
menuWeight: 10
excerpt: View release-specific information for Konvoy 2.2
beta: false
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 2.2 was released on April 6, 2022.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.22.8 |
|**Maximum** | 1.22.x |
|**Default** | 1.22.8 |

### New features and capabilities

#### Updated Cluster API providers to latest available versions

#### Support for provisioning vSphere clusters

#### Ability to upgrade all components in the cluster

#### Enable etcd encryption in new clusters

#### Distribute the CLI as a single combined binary

#### Allow setting docker registry credentials when creating clusters

#### Allow setting HTTP_PROXY settings on all CAPI providers

#### New command to update Azure credentials in running clusters

### Component updates

The following components have been upgraded to the listed version:

- Calico 3.22
- AWS EBS CSI 1.5
- CSI External Snapshotter 5.0.1
- Azure CSI 1.13.0
- Local Static Provisioner CSI 2.4.0
- Cluster Autoscaler 1.23.0
- Node Feature Discovery 0.10.1
- Nvidia Node Feature Discovery 0.4.1

## Additional resources

<!-- Add links to external documentation as needed -->

For information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[kubernetes-doc]: https://kubernetes.io/docs/home/
