---
layout: layout.pug
navigationTitle: Release Notes Konvoy 1.8.5
title: Release Notes Konvoy 1.8.5
menuWeight: 60
excerpt: View release-specific information for Konvoy 1.8.5
beta: false
enterprise: false
---

<!-- markdownlint-disable MD036 -->

**D2iQ&reg; Konvoy&reg; version 1.8.5 was released on February 18, 2022**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**  | 1.18.x   |
| **Maximum**  | 1.20.x   |
| **Default**  | 1.20.13  |

### New features and capabilities

#### CentOS 8 EOL

- CentOS 8 has reached end of life (EOL), and thus is no longer supported by Konvoy.

#### Update logic

- Changes to the Kubernetes or Image Registry configuration are now applied to control plane machines. (COPS-7088)

### Bug fixes

#### TFA

- Updated TFA image version to 3.1.0. (COPS-7145)

#### Docker

The latest tag for the defaultstorageclassprotection addon's Docker image has been removed and replaced with the v0.0.1 tag. (COPS-7184)

### Component versions

<!-- vale Vale.Terms = NO -->
<!-- vale Vale.Spelling = NO -->

- Ansible 2.9.16.0
- Calico 3.20.2
- Cluster-autoscaler v0.5.0
- Containerd v1.4.7
- Docker v19.03.15
- kubeaddons-dispatch stable-1.20-1.4.6
- kubeaddons-kommander stable-1.20-1.4.4
- kubernetes-base-addons stable-1.20-4.4.0
- Kubernetes v1.20.13
- Kubeaddons v0.26.0
- Mitogen a60c6c14a2473c895162a1b58a81bad0e63d1718
- Terraform v0.13.7
- Terraform AWS plugin ~> 3.0
- Terraform Azure plugin ~> 2.31
- Terraform GCP plugin ~> 3.42

<!-- vale Vale.Terms = YES -->
<!-- vale Vale.Spelling = YES -->

## Additional resources

For information about working with native Kubernetes, see the [Kubernetes documentation](https://kubernetes.io/docs/home/).

For a full list of attributed 3rd party software, see [D2IQ Legal](https://d2iq.com/legal/3rd).
