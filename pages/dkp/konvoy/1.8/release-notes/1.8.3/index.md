---
layout: layout.pug
navigationTitle: Release Notes Konvoy 1.8.3
title: Release Notes Konvoy 1.8.3
menuWeight: 40
excerpt: View release-specific information for Konvoy 1.8.3
beta: false
enterprise: false
---
<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 1.8.3 was released on September 23, 2021.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**  | 1.18.x  |
| **Maximum**  | 1.20.x  |
| **Default**  | 1.20.11  |

### New features and capabilities

#### CLI

- Do not fail but print a warning when SELinux is enabled.

#### Air-gapped environment

- Konvoy 1.8.1 was failing to deploy in an air-gapped cluster running in FIPS mode. (COPS-6992, COPS-6998)
- Include typha container image in the air-gap bundle. (COPS-6967)
- Include missing vSphere CSI image. (COPS-7008)

#### Autoscaling

- Konvoy Autoscaling was failing with Terraform overwrites. (COPS-7005)

#### vSphere

- Fix segmentation fault when vSphere Server URL is not defined, or an empty string. (COPS-6907)

#### Prometheus

- Fixed an issue where Prometheus was raising alerts about missing rule evaluations. (COPS-7011)

### Component versions

<!-- vale Vale.Terms = NO -->

- Ansible 2.9.16.0
- Calico 3.17.3
- Cluster-autoscaler v0.5.0
- Containerd v1.4.7
- Docker v19.03.15
- kubeaddons-dispatch stable-1.19-1.4.5
- kubeaddons-kommander stable-1.20-1.4.2
- kubernetes-base-addons stable-1.20-4.2.0
- Kubernetes v1.20.11
- Kubeaddons v0.26.0
- Mitogen a60c6c14a2473c895162a1b58a81bad0e63d1718
- Terraform v0.13.7
- Terraform AWS plugin ~> 3.0
- Terraform Azure plugin ~> 2.31
- Terraform GCP plugin ~> 3.42

<!-- vale Vale.Terms = YES -->

## Additional resources

For information about working with native Kubernetes, see the [Kubernetes documentation](https://kubernetes.io/docs/home/).

This Docker image includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the GNU Affero General Public License 3.0. The complete source code for the version of MinIO packaged with DKP/Konvoy 1.8/Kommander 1.4 is available at this URL: https://github.com/minio/minio/tree/RELEASE.2020-12-03T05-49-24Z

For a full list of attributed 3rd party software, see [D2IQ Legal](https://d2iq.com/legal/3rd).
