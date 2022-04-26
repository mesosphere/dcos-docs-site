---
layout: layout.pug
navigationTitle: Release Notes Konvoy 1.7.0
title: Release Notes Konvoy 1.7.0
menuWeight: 10
excerpt: View release-specific information for Konvoy 1.7.0
beta: false
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 1.7.0 was released on 10 February, 2021.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.17.x |
|**Maximum** | 1.19.x |
|**Default** | 1.19.7 |

### New features and capabilities

#### FIPS 140-2 Support

Konvoy 1.7 introduces support for FIPS 140-2 encryption ciphers according to the NIST FIPS 140-2 standard.

In this release:

- Control plane Kubernetes components use FIPS-approved ciphers.
- A verification tool shows whether select Kubernetes objects in a cluster are using approved ciphers, and which ciphers are in use.
- Use `konvoy up --mode fips` command to create a new `cluster.yaml` with the required configuration to create a FIPS-approved cluster.
- Use `konvoy check fips` command to verify the cluster is using FIPS-approved ciphers.

#### Security Vulnerability Scanning and Reporting

Konvoy now scans for common vulnerabilities and exposures (CVE) and reports them publicly. For more information on the most current Konvoy CVE scans, see [Security Updates](https://docs.d2iq.com/dkp/security-updates/).

#### Support for VMWare vSphere

- Konvoy now supports `vsphere` as a provisioner to create clusters in your [VMware vSphere][vsphere] environment. For more information, see the [Konvoy vSphere topic][konvoy-vsphere].

#### GPU Support

- The Nvidia GPU driver now runs on the host system by default. See [Konvoy GPU docs](../../gpu) for details.

#### Addons

- Fixed a bug that prevented upgrades when the `kommander` addon was not installed.

#### Ansible

- Added retries when adding iptable rules to avoid errors when another program may have a lock on the table.
- Re-enabled coredns caching to reduce unnecessary load on API server.
- Retry ssh-connections that could cause `unreachable` failures when using a bastion node.
- Better verification of when a machine is ready before trying to run Ansible.
- Fix a regression with old versions of `ip route` that could result in an error when `keepalived` is enabled. (COPS-6791)

#### CLI

- Wait for an addon to be deleted before printing `[OK]` message. (COPS-6692)
- Clean up dangling docker container `pinata-sshd` when running `konvoy down`.
- Fail if root volume disk usage exceeds 85%.
- Fail if machines do nothave 2 CPUs or 2GB of Memory.
- Remove support for Kubernetes `v1.16`.

#### API

- Added `clusterConfiguration.spec.kubernetes.apiserver.targetRamMB` to configure the `targetRamMB` value of the `kube-apiserver`. This option is only valid for Kubernetes versions `v1.18.x` and `v1.17.x`, this field will be removed in a future version.
- Added `clusterConfiguration.spec.loggingOptions` to configure systemd-journald settings.
- The way `clusterConfiguration.containerRuntime.data` information is merged was changed so that nested data is now properly merged without requiring to add all parent configuration.
- Added `clusterConfiguration.spec.autoProvisioning.disabled` to disable the deployment of auto-provisioning.

#### AWS

- Fixed a regression that prevented adding new tags to EC2 instances after an initial provision run. (COPS-6687)
- Tag AWS key pairs created by Konvoy.
- Fixed the `kube-apiserver` being spammed by a handshake TLS errors by using an HTTPs instead of a TCP health probe on the `kube-apiserver` ELB.
- Fix an issue when setting `machine.aws.iam.instanceProfile` value to 0 bastion nodes would cause a Terraform failure.
- Added `spec.nodePools.machine.aws.kmsKeyID` to specify a KMS encryption key for the AWS instance block volumes created by Konvoy.

#### Azure

- Decrease the default number of nodes to 4. (COPS-6770)

#### Diagnose

- Added a new flag, `--filter-files`, which is a comma separated list of regular expressions of files that should not be included in the diagnostics bundle.
- Collect diagnostics from bastion machines.
- Collect diagnostics from `knative-serving` and `kubeflow` namespaces.

#### Kommander

- Ensure AWS & Azure credentials are valid before saving them.

#### Kubeaddons

- Removed leader election for the `kubeaddon-controller` deployment to avoid the pod being terminated in the middle of an install operation.
- Added a Helm flag to limit the number of Helm releases. Prior to this, the large number of releases could lead to a slowdown in etcd.

#### Terraform

- Disabled color output when running without a tty.
- Instance ID changes are no longer ignored by Terraform for the 2nd volume attachment.

#### SUSE

- Added support for SUSE 15.

## Upstream industry changes

The following sections refer to recent changes in the Open Source software used by DKP that may require action on your part as part of an upgrade or installation of D2iQ software.

### Docker hub rate limiting

Docker Hub announced an [update](https://www.docker.com/blog/scaling-docker-to-serve-millions-more-developers-network-egress/) to their image pull policies in August, 2020. The change results in the need to change cluster configurations to accommodate new account structures that enable image pull rate limiting.

Rate limiting happens on a per-pull basis regardless of whether the pulled image is owned by a paid user. This means D2iQ, as owner of most images used in Konvoy, does not have any influence as to whether your current address is rate-limited or not. Konvoy does not have a strict dependency on Docker Hub accounts or plans.

For more information on addressing this limit, see [Docker hub rate limits](../../operations/manage-docker-hub-rate-limits).

### KUDO Spark Operator Upgrade Prior to Konvoy Upgrade or Install

Custom Resource Definitions of KUDO Spark Operator versions prior to 3.0.0-1.1.0 do not specify default values for `x-kubernetes-list-map-keys` properties and will fail validation on Kubernetes versions 1.18.x and later.

Perform these steps prior to upgrading or installing Konvoy to prevent or mitigate disruption of currently-running Spark jobs and invalidating Spark CRDs:

1. Wait for the KUDO Spark Operator jobs to finish, or terminate the running jobs.
1. [Uninstall the KUDO Spark Operator](/dkp/kommander/latest/projects/platform-services/platform-services-catalog/kudo-spark#uninstalling-the-spark-operator).
1. [Install the new KUDO Spark version](/dkp/kommander/latest/projects/platform-services/platform-services-catalog/kudo-spark#installation).
1. [Upgrade](../../upgrade) or [install](../../install) Konvoy.

### Component versions

- Ansible 2.9.16.0
- Calico 3.17.1
- Cluster-autoscaler v0.4.0
- Containerd v1.3.9
- Docker v19.03.14
- Go 1.15.6
- Helm v3.3.4
- kubeaddons-dispatch stable-1.19-1.4.0
- kubeaddons-kommander stable-1.19-1.3.0
- kubernetes-base-addons stable-1.19-3.2.0
- Kubernetes v1.19.7
- Kubeaddons v0.23.7
- Mitogen a60c6c14a2473c895162a1b58a81bad0e63d1718
- Terraform v0.13.5
- Terraform AWS plugin ~> 3.0
- Terraform Azure plugin ~> 2.31
- Terraform GCP plugin ~> 3.42

<!--
##### Previous releases
Add links to previous release notes
-->

## Additional resources

<!-- Add links to external documentation as needed -->

For information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[konvoy-doc]: ../../introduction
[kubernetes-doc]: https://kubernetes.io/docs/home/
[konvoy-vsphere]: ../../install/install-vsphere
[vsphere]: https://www.vmware.com/products/vsphere.html
