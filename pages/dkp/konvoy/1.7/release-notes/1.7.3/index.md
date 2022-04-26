---
layout: layout.pug
navigationTitle: Release Notes Konvoy 1.7.3
title: Release Notes Konvoy 1.7.3
menuWeight: 40
excerpt: View release-specific information for Konvoy 1.7.3
beta: false
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 1.7.3 was released on 9 June, 2021.**

<p class="message--warning"><strong>WARNING:</strong> When upgrading to Konvoy 1.7.3 or Konvoy 1.8.1, containerd configuration files are not correctly copied over, leading to unexpected behavior.  New installations are not impacted. Because of this, we recommend you upgrade directly to 1.7.4 or 1.8.2, or review the <a href="https://support.d2iq.com/hc/en-us/articles/4409472623636-Customer-Advisory-Missing-containerd-configurations-when-upgrading-to-Konvoy-1-7-3-or-1-8-1-D2iQ-2021-0004"</a>Product Advisory</a> for a workaround.</p>

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

<p class="message--note"><strong>NOTE: </strong>If you are upgrading to v1.7.3 with FIPS mode enabled, see the <a href="https://support.d2iq.com/hc/en-us/articles/4409472683796-Upgrading-Konvoy-V1-7-0-and-V1-7-1-FIPS-mode-clusters"</a>Upgrading Konvoy Knowledge Base article</a> before beginning.</p>

### New features and capabilities

#### Ansible

- Improve the automatic detection of the interface name for the keepalived configuration on on-prem Konvoy control-plane nodes. (COPS-6911)
- Use Python3 instead of Python2 on SLES. (COPS-6952)
- Update Containerd to v1.4.6 to address CVE-2021-30465. (COPS-6948)

#### CLI

- Provide a better error message when Docker daemon is not running. (COPS-6929)
- The airgapped bundle now contains an additional set of packages used to deploy Konvoy onto airgapped Red Hat Enterprise Linux 8 hosts. (COPS-6904)

### Component versions

- Ansible 2.9.16.0
- Calico 3.17.3
- Cluster-autoscaler v0.4.0
- Containerd v1.3.9
- Docker v19.03.15
- Go 1.15.8
- Helm v3.3.5
- kubeaddons-dispatch stable-1.19-1.4.1
- kubeaddons-kommander stable-1.19-1.3.3
- kubernetes-base-addons stable-1.19-3.5.0
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
