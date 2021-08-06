---
layout: layout.pug
navigationTitle: Release Notes
title: Konvoy 2.0 Release Notes
menuWeight: 0
excerpt: View release-specific information for Konvoy 2.0
beta: true
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 2.0 beta 2 was released on 08, July 2021.**

<!--
[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>
-->

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.21.3 |
|**Maximum** | 1.21.x |
|**Default** | 1.21.3 |

### New features and capabilities

#### Pre-baked AMI (Amazon Machine Image)

Konvoy can now use pre-baked AMIs. AMI images contain configuration information and software to create a specific, preconfigured, operating environment.

#### Improved cluster autoscaling

Cluster Autoscaler automatically scales up your cluster as soon as you need it, and scales it back down to save you money when you don't. In this release, we've improved the performance of Cluster Autoscaler. For more information, see [Cluster Autoscaler](../nodepools/cluster_autoscaler/)

### Component updates

The following components have been upgraded to the listed version:

- Kubernetes 1.21.3
- Calico 3.19
- AWS EBS CSI 1.1.0
- Cluster Autoscaler 1.21.0

<!--
## Fixes and improvements

- Bug fixes with COPS numbers only. -->

## Additional resources

<!-- Add links to external documentation as needed -->

For information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[kubernetes-doc]: https://kubernetes.io/docs/home/
