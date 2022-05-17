---
layout: layout.pug
navigationTitle: Release Notes Konvoy 1.6.2
title: Release Notes Konvoy 1.6.2
menuWeight: 20
excerpt: View release-specific information for Konvoy 1.6.2
beta: false
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 1.6.2 was released on 11 March, 2021.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.16.x |
|**Maximum** | 1.18.x |
|**Default** | 1.18.13 |

### Known Issues

There are some limitations upgrading to this Konvoy version due to the migration of Helm v2 to Helm v3 of large ConfigMaps to Helm v3 Secrets for Prometheus and the need to delete and redeploy this addon.
For more information, see [Helm v2 to v3 migration](../../addons/helmv2-to-v3-migration/)

### New features and capabilities

- Collect diagnostics from bastion machines.
- Fix an issue where a Go panic can occur during reprovisioning of the instances.
- Print a warning message when the disk size allocated to the root volume is less than 78G.
- Set the minimum requirements for CPU and Memory per machine to 2 cores and 2GB.
- Switched the kubeaddons base image to distroless and run the controller as a non-root user. Addresses the static (not executed) CVE-2019-25013 in the prior base image.
- Some supported operating systems cannot support GPU workloads due to limitations in the current deployment architecture for GPU drivers. The documentation has been updated to clarify current issues with GPU support. (COPS-6771)

#### Terraform

- The latest version of Terraform fails when all parameters are empty or nil. This caused an issue when setting the `machine.aws.iam.instanceProfile` value to 0 bastion nodes. This has been fixed.
- Fixed an issue that prevented upgrades when new Terraform plugin versions were released.
- Instance ID changes are no longer ignored and are handled properly by Terraform for the 2nd volume attachment.

#### Updated the Let's Encrypt tutorial

The [Setting up Let's Encrypt certificate](../../access-authentication/letsencrypt) tutorial has been updated to reflect changes introduced with `cert-manager v.1`.

#### Create a cluster with no workers

An issue with creating clusters with no workers was corrected. Clusters can now be created with no workers and then scaled up with workers at a later time or scaled down to zero without issue.

#### Fix deleting certain files during shutdown or reset

A problem with the `konvoy down` or `konvoy reset` commands failing if dedicated named devices were mounted on `/var/lib/kublet` or `/var/lib/containerd` has been corrected. (COPS-6771)

### Component versions

- Ansible v2.9.16.0
- Calico v3.16.8
- Cluster-autoscaler v0.2.4
- Containerd v1.3.9
- Docker v19.03.15
- Go 1.14.15
- Helm v3.3.4
- kubeaddons-dispatch stable-1.18-1.3.0
- kubeaddons-kommander stable-1.18-1.2.1
- kubernetes-base-addons stable-1.18-3.3.0
- Kubernetes v1.18.16
- Kubeaddons v0.24.1
- Mitogen a60c6c14a2473c895162a1b58a81bad0e63d1718
- Terraform v0.13.5
- Terraform AWS plugin ~> 3.0
- Terraform Azure plugin ~> 2.31
- Terraform GCP plugin ~> 3.42

## Additional resources

<!-- Add links to external documentation as needed -->

For information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[kubernetes-doc]: https://kubernetes.io/docs/home/
