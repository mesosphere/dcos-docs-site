---
layout: layout.pug
navigationTitle: Release Notes Konvoy 1.7.4
title: Release Notes Konvoy 1.7.4
menuWeight: 50
excerpt: View release-specific information for Konvoy 1.7.4
beta: false
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 1.7.4 was released on 28, July 2021.**

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

### New features and capabilities

#### Ansible

- Konvoy now updates the Containerd config when the `cluster.yaml` file is modified, ensuring changes to the image registry are propagated to the cluster.  (COPS-6910)
- Update Containerd to v1.4.7, to resolve an issue where the `config.toml` file was missing from the Control Plane after updating Konvoy.  (COPS-6987)

#### AWS

- Update AWS KMS ARN validation to be less strict for partition names.  (COPS-6979)

### Component versions

- Ansible 2.9.16.0
- Calico 3.17.3
- Cluster-autoscaler v0.4.0
- Containerd v1.4.7
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

For information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[kubernetes-doc]: https://kubernetes.io/docs/home/
[konvoy-vsphere]: /../../install/install-vsphere
[konvoy-ccontrol-plane-certificates]: /../../networking/control-plane-certificates/
[security-groups-configuration]: /../../install/install-aws/advanced-provisioning#security-groups
