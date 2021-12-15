---
layout: layout.pug
navigationTitle: Release Notes
title: Konvoy 2.1 Release Notes
menuWeight: 10
excerpt: View release-specific information for Konvoy 2.1
beta: false
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 2.1 was released on November 18, 2021.**

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

#### FIPS Support

In Konvoy 2.1, customers who require FIPS 140-2 encryption ciphers, have an easier way to validate that specific components and services are FIPS-compliant according to the NIST FIPS 140-2 standard by checking the signatures of the files against a signed signature file. For more information on running FIPS validation commands, see Validate FIPS in Cluster.

For more information on using FIPS with Konvoy, see [FIPS 140-2 Compliance](../fips/)

#### Diagnostics Bundle

In DKP 2.1, we provide you a single command for collecting metrics and generating a diagnostic bundle. This allows you to easily upload the bundle to our support team, resulting in less downtime. The diagnostic bundle includes node-level instrumentation around CPU, memory, and disk usage, OS health.

For more information on creating and sending a Konvoy Diagnostics Bundle, see [Generate a Support Bundle](../troubleshooting/generate-a-support-bundle).

#### Support for NVIDIA 470 Driver

Konvoy 2.1 supports the upgraded Nvidia 470.x driver and DCGM exporter 2.2.9, which enables technology for running DKP on NVIDIA DGX. NVIDIA DGX customers now have a robust Kubernetes platform in Konvoy and Kommander that vastly simplifies the process of getting the infrastructure needed for applications up and running on this powerful hardware platform.

For more information on using Nvidia with Konvoy, see the [GPU](../choose-infrastructure/aws/gpu) documentation.

#### Easier Air-gapped deployments

Konvoy 2.1 comes with an easier way to deploy in an air gapped environment. Rather than one large package that includes the requirements for all air gapped environments, you can now create a smaller package that is specific to your requirements and can fit on a laptop or USB.

#### DKP Licensing through Amazon Marketplace

You can purchase a license for Konvoy or Kommander through the AWS Marketplace, and then add it to Kommander. In the Kommander UI, you can see information such as the license status (valid or expired), the license capacity (number of cores or clusters), and expiration date.

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

### Building on a CentOS OS using Pre-provisioned

If you are deploying to CentOS using the [pre-provisioned provider](../choose-infrastructure/pre-provisioned) method, ensure this setting is followed on your machines:

First, check your `/etc/fstab` file:

```sh
cat /etc/fstab
```

If there is the line, you will need to comment that out:

```sh
/dev/mapper/centos-swap swap                    swap    defaults        0 0
```

This will then look like this:

```sh
# /dev/mapper/centos-swap swap                    swap    defaults        0 0
```

Then, run:

```sh
swapoff /dev/mapper/centos-swap
```

Now you will be able to install a pre-provisioned DKP cluster on a CentOS machine.

## Additional resources

<!-- Add links to external documentation as needed -->

For information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[kubernetes-doc]: https://kubernetes.io/docs/home/
