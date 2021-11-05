---
layout: layout.pug
navigationTitle: Release Notes Konvoy 1.8.1
title: Release Notes Konvoy 1.8.1
menuWeight: 20
excerpt: View release-specific information for Konvoy 1.8.1
beta: false
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 1.8.1 was released on 09, June 2021.**

<p class="message--warning"><strong>WARNING:</strong> When upgrading to Konvoy 1.7.3 or Konvoy 1.8.1, containerd configuration files are not correctly copied over, leading to unexpected behavior.  New installations are not impacted. Because of this, we recommend you upgrade directly to 1.7.4 or 1.8.2, or review the <a href="https://support.d2iq.com/hc/en-us/articles/4409472623636-Customer-Advisory-Missing-containerd-configurations-when-upgrading-to-Konvoy-1-7-3-or-1-8-1-D2iQ-2021-0004"</a>Product Advisory</a> for a workaround.</p>

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.18.x |
|**Maximum** | 1.20.x |
|**Default** | 1.20.6 |

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
- Cluster-autoscaler v0.5.0
- Containerd v1.4.6
- Docker v19.03.15
- EBS CSI 0.7.x
- Elastic Search 7.10.1
- Gatekeeper 3.4.0
- Go 1.16.2
- Helm v3.5.2
- Istio 1.9.1
- Kibana 7.9.3
- kubeaddons-dispatch stable-1.19-1.4.5
- kubeaddons-kommander stable-1.20-1.4.1
- kubernetes-base-addons stable-1.20-4.1.0
- Kubernetes v1.20.6
- Kubeaddons v0.26.0
- Mitogen a60c6c14a2473c895162a1b58a81bad0e63d1718
- Prometheus 2.22.1
- Prometheus Operator 0.43.0
- snapshot-controller 3.0.2
- Terraform v0.13.7
- Terraform AWS plugin ~> 3.0
- Terraform Azure plugin ~> 2.31
- Terraform GCP plugin ~> 3.42
- Velero >= 1.5

## Additional resources

<!-- Add links to external documentation as needed -->

For information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[konvoy-doc]: ../../introduction
[kubernetes-doc]: https://kubernetes.io/docs/home/
[konvoy-vsphere]: ../../install/install-vsphere
[security-groups-configuration]: ../../install/install-aws/advanced-provisioning#security-groups
