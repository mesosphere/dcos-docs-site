---
layout: layout.pug
navigationTitle: Release Notes Konvoy 1.8.4
title: Release Notes Konvoy 1.8.4
menuWeight: 50
excerpt: View release-specific information for Konvoy 1.8.4
beta: false
enterprise: false
---
<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 1.8.4 was released on December 14, 2021**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**  | 1.18.x  |
| **Maximum**  | 1.20.x  |
| **Default**  | 1.20.13  |

### New features and capabilities

#### Networking

- Calico has been updated to v3.20.2 to address an issue that prevented container deletion. (COPS-7092)
<<<<<<< HEAD

#### Autoscaling

- Fixed an issue installing the auto-provisioning component in an Ubuntu environment. (COPS-7102)
=======
>>>>>>> 8c15784257 (Update index.md)

#### Air-Gapped

- RHEL 8 FIPS packages have been updated to produce the necessary SHA256 signatures during installation. (COPS-7066)

<<<<<<< HEAD
### Bug Fixes

#### Authentication

- Users within the system:authenticated group are now able to access group-appropriate URLs. (COPS-7067)
=======
- Fixed an issue installing the auto-provisioning component in an Ubuntu environment. (COPS-7102)

#### Air-Gapped

- Rhel8 FIPS packages have been updated to produce the necessary SHA256 signatures during installation. (COPS-7066)
- Users within the system:authenticated group are now able to access group-appropriate URLs. (COPS-7067)

### Bug Fixes
>>>>>>> 8c15784257 (Update index.md)

### Known Issues

<<<<<<< HEAD
-  Prometheus addon upgrades fail due to a missing alertmanager CRD. To work around this issue, manually apply the missing CRD to the cluster prior to upgrading by running: `kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/v0.47.0/example/prometheus-operator-crd/monitoring.coreos.com_alertmanagers.yaml`
=======
-  Prometheus addon upgrades now appropriately upgrade the alertmanager CRD.
>>>>>>> 8c15784257 (Update index.md)

### Component versions

- Ansible 2.9.16.0
- Calico 3.20.2
- Cluster-autoscaler v0.5.0
- Containerd v1.4.7
- Docker v19.03.15
- kubeaddons-dispatch stable-1.20-1.4.6
- kubeaddons-kommander stable-1.20-1.4.3
- kubernetes-base-addons stable-1.20-4.3.0
- Kubernetes v1.20.13
- Kubeaddons v0.26.0
- Mitogen a60c6c14a2473c895162a1b58a81bad0e63d1718
- Terraform v0.13.7
- Terraform AWS plugin ~> 3.0
- Terraform Azure plugin ~> 2.31
- Terraform GCP plugin ~> 3.42


## Additional resources

For information about working with native Kubernetes, see the [Kubernetes documentation](https://kubernetes.io/docs/home/).
