---
layout: layout.pug
navigationTitle: Release Notes Konvoy 1.8.2
title: Release Notes Konvoy 1.8.2
menuWeight: 30
excerpt: View release-specific information for Konvoy 1.8.2
beta: false
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 1.8.2 was released on 28, July 2021.**

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

- Konvoy now updates the Containerd config when the `cluster.yaml` file is modified, ensuring changes to the image registry are propagated to the cluster.  (COPS-6910)
- Update Containerd to v1.4.7, to resolve an issue where the `config.toml` file was missing from the Control Plane after updating Konvoy.  (COPS-6987)

#### AWS

- Update AWS KMS ARN validation to be less strict for partition names.  (COPS-6979)

### Component versions

- Ansible 2.9.16.0
- Calico 3.17.3
- Cluster-autoscaler v0.5.0
- Containerd v1.4.7
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

[kubernetes-doc]: https://kubernetes.io/docs/home/
[konvoy-vsphere]: /../../install/install-vsphere
[konvoy-ccontrol-plane-certificates]: /../../networking/control-plane-certificates/
[security-groups-configuration]: /../../install/install-aws/advanced-provisioning#security-groups
