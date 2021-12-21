---
layout: layout.pug
navigationTitle: Release Notes Konvoy 2.1.1
title: Release Notes Konvoy 2.1.1
menuWeight: 10
excerpt: View release-specific information for Konvoy 2.1.1
beta: false
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 2.1 was released on December 23rd, 2021.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.21.6 |
|**Maximum** | 1.21.x |
|**Default** | 1.21.6 |

### New features and capabilities

#### DKP Major Version Upgrade

Konvoy and Kommander 2.1 represent a major version upgrade that moves forward DKP architecture to give you access to D2iQ's next generation centralized Kubernetes and smart cloud native applications. It incorporates ClusterAPI as a major re-architecture in its management of production Kubernetes clusters. [ClusterAPI](https://cluster-api.sigs.k8s.io/introduction.html), or CAPI, enables declarative creation, configuration, and management of clusters. Declarative mode is a Kubernetes best practice that simplifies lifecycle tasks, making them more consistent and more repeatable. 2.1 enhances your existing clusters to use a new architecture.

#### Other Feature Additions

* Provision a cluster using an advanced YAML editor.

* More bootstrap images are included with air-gapped bundles that contain OS packages.

### Bug Fixes

* The 'dkp delete' command no longer results in a segmentation violation or segmentation fault (SIGSEGV). [COPS-7109]

* DKP installer now obeys the appropriate region flags. [COPS-7101]

### Component updates

The following components have been upgraded to the listed version:

- Calico 3.20
- AWS EBS CSI 1.4
- CSI External Snapshotter 4.2.1
- Azure CSI 1.8.0
- Local Static Provisioner CSI 2.4.0
- Cluster Autoscaler 1.21.0
- Node Feature Discovery 0.8.2
- Nvidia Node Feature Discovery 0.4.1

## Additional resources

<!-- Add links to external documentation as needed -->

For information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[kubernetes-doc]: https://kubernetes.io/docs/home/
