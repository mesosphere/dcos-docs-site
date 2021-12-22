---
layout: layout.pug
navigationTitle: Release Notes Konvoy 2.1.1
title: Release Notes Konvoy 2.1.1
menuWeight: 20
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

#### Easier Air-gapped deployments

Konvoy 2.1 comes with an easier way to deploy in an air gapped environment. Rather than one large package that includes the requirements for all air gapped environments, we now provide air-gapped bundles for individual needs.

#### Other Feature Additions

* Added the ability to provision a cluster using an advanced YAML editor.

### Fixes and Improvements

#### DKP delete fails in AWS

Fixed an issue where the 'dkp delete' command could fail with a SIGSEGV when attempting to delete a DKP cluster from AWS where you have permanent credentials. (COPS-7109)

#### DKP installer fails to follow respective AWS --region or Azure --location flags

Fixed an issue where the AWS `--region` or Azure `--location` installer flags were not being enforced in the target cluster. (COPS-7101)

#### DKP move command not moving some items

We corrected an issue where the `PreprovisionedInventory` object and SSH key secret were not moved to the target cluster when making the cluster self-managing.(COPS-7079)

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
