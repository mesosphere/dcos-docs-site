---
layout: layout.pug
navigationTitle: Release Notes
title: Konvoy 2.1 Beta 1 Release Notes
menuWeight: 0
excerpt: View release-specific information for Konvoy 2.1
beta: true
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 2.1 Beta 1 was released on October 14, 2021.**

<!--- [button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p> --->

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.21.3 |
|**Maximum** | 1.21.x |
|**Default** | 1.21.3 |

### New features and capabilities

<!--- #### heading name with sample template for link to more info

Cluster Autoscaler automatically scales up your cluster as soon as you need it, and scales it back down to save you money when you don't. In this release, the [Cluster Autoscaler](../choose_infrastructure/aws/nodepools/cluster_autoscaler) has been reimplemented, making it more responsive to scale up/down requests, as well as making adding/deleting nodes faster. --->

### Component updates

The following components have been upgraded to the listed version:

- Kubernetes 1.21.3
- Cert Manager 1.5.3
- CAPI 0.4.2

<!--
## Fixes and improvements

- Bug fixes with COPS numbers only. -->

## Additional resources

<!-- Add links to external documentation as needed -->

For information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[kubernetes-doc]: https://kubernetes.io/docs/home/
[nfd]: https://kubernetes-sigs.github.io/node-feature-discovery/stable/get-started/index.html
[nfgfd]: https://github.com/NVIDIA/gpu-feature-discovery
