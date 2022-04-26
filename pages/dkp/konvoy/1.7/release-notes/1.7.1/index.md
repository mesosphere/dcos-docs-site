---
layout: layout.pug
navigationTitle: Release Notes Konvoy 1.7.1
title: Release Notes Konvoy 1.7.1
menuWeight: 20
excerpt: View release-specific information for Konvoy 1.7.1
beta: false
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 1.7.1 was released on 11 March, 2021.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.17.x |
|**Maximum** | 1.19.x |
|**Default** | 1.19.8 |

### New features and capabilities

#### Ansible

- Fix an error when `ansible_ssh_private_key_file` is not defined and SSH key is only provided in the `ssh-agent`.
- Use the correct `k8s.gcr.io/pause:3.2` image.

#### Airgapped

- Include the missing `docker.io/mesosphere/pause:3.2` image needed for air-gapped FIPS installation.

#### Updated the Let's Encrypt tutorial

The [Setting up Let's Encrypt certificate](../../access-authentication/letsencrypt) tutorial has been updated to reflect changes introduced with `cert-manager v.1`.

#### Fixed vSphere machine creation issues in airgapped environments

Previously, in airgapped environments, Terraform would not create new vSphere machines if it did not find a default gateway. With this release, Terraform no longer waits to find a default gateway nor does it check IP addresses with any discovered default gateways before creating new machines.

#### CentOS 7.9 support

This version update now supports the CentOS operating system version 7.9.

#### Create a cluster with no workers

In certain environments, attempting to create a cluster without workers can fail. This should not be a failure state. This version update can now create clusters with no workers. These clusters can be scaled up with workers at a later time or scaled down to zero without issue.

#### Fix deleting certain files during shutdown or reset

A problem with the `konvoy down` or `konvoy reset` commands failing if dedicated named devices were mounted on `/var/lib/kublet` or `/var/lib/containerd` has been corrected. (COPS-6771)

#### Fix issue reporting incorrect status update of addons upon deploying

There was an issue where some Addons were marked as "OK" status when not all components of that addon were available. This happened during the `Deploying Enabled Addons` stage of a `konvoy up` or `konvoy deploy addons` command. This has been fixed and the status now reflects when the addon is ready. (COPS-6883)

### Component versions

- Ansible 2.9.16.0
- Calico 3.17.3
- Cluster-autoscaler v0.4.0
- Containerd v1.3.9
- Docker v19.03.15
- Go 1.15.8
- Helm v3.3.5
- kubeaddons-dispatch stable-1.19-1.4.1
- kubeaddons-kommander stable-1.19-1.3.1
- kubernetes-base-addons stable-1.19-3.2.0
- Kubernetes v1.19.8
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
