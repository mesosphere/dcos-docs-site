---
layout: layout.pug
navigationTitle: Release Notes
title: Konvoy 2.0 Release Notes
menuWeight: 0
excerpt: View release-specific information for Konvoy 2.0
beta: false
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 2.0 was released on 26, August 2021.**

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>

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

Konvoy can now use pre-baked AMIs. AMI images contain configuration information and software to create a specific, pre-configured, operating environment.

#### Improved cluster autoscaling

Cluster Autoscaler automatically scales up your cluster as soon as you need it, and scales it back down to save you money when you don't. In this release, the [Cluster Autoscaler](../choose_infrastructure/aws/nodepools/cluster_autoscaler) has been reimplemented, making it more responsive to scale up/down requests, as well as making adding/deleting nodes faster.

#### Pre-provisioned providers

You can now create on-premises Konvoy clusters using a new `cluster-api-provider-preprovisioned` [pre-provisioned provider](../choose_infrastructure/pre-provisioned).

#### Support for Flatcar Container Linux

Konvoy now supports Flatcar Container Linux version 2905.2.1 and higher as a [supported operating systems](../supported-operating-systems) with the pre-provisioned provider.

#### Node pool management

Konvoy comes with new CLI commands to create, scale and delete [node pools](../choose_infrastructure/aws/nodepools).

#### Kubernetes node feature discovery

All Konvoy clusters are now automatically deployed with Kubernetes [Node Feature Discovery][nfd] and [NVIDIA GPU feature discovery][nfgfd]. Konvoy automatically discovers and labels Kubernetes nodes with host level information that can be used for application scheduling decisions.

#### Automatic Kubernetes certificate renewal

You can now configure Konvoy to automatically [renew Kubernetes cluster certificates](../choose_infrastructure/aws/advanced/certificate_renewal).

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
[nfd]: https://kubernetes-sigs.github.io/node-feature-discovery/stable/get-started/index.html
[nfgfd]: https://github.com/NVIDIA/gpu-feature-discovery
