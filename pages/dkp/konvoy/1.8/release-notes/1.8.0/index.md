---
layout: layout.pug
navigationTitle: Release Notes Konvoy 1.8.0
title: Release Notes Konvoy 1.8.0
menuWeight: 10
excerpt: View release-specific information for Konvoy 1.8.0
beta: false
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Konvoy&reg; version 1.8.0 was released on 05, May 2021.**

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

#### Addons

- Switched the kubeaddons base image to distroless and run the controller as a non-root user. Addresses the static (not executed) CVE-2019-25013 in the prior base image.

#### Ansible

- Use the correct `k8s.gcr.io/pause:3.2` image.
- Fix an issue where `konvoy reset` fails when removing Kubernetes directories when that directory is a mount point. (COPS-6771)

#### CLI

- Added support for RHEL/CentOS 7.9.
- You can now uninstall the auto-provisioner if `autoProvisioning.disabled` is set to `true` after the initial installation.
- Use the correct GPG key when installing FIPS RPM packages in an air-gapped environment.
- Include the missing `docker.io/mesosphere/pause:3.2` needed for air-gapped FIPS installation.
- Added support for using a custom CA when generating certificates for the Kubernetes control plane by copying the `ca.crt` and `ca.key` files from `extras/pki` in the working directory, see the [Konvoy documentation][konvoy-control-plane-certificates].
- Validate that Konvoy is not being run from a host in the Kubernetes cluster. (COPS-6878)
- Fix to allow for upgrading Konvoy v1.7.0 and v1.7.1 to any later version of Konvoy while running in FIPS mode.

#### API

- Set the default image to CentOS 7.9.
- Allow for setting `spec.containerNetworking.calico.encapsulation` to `none` to disable Calico encapsulation (COPS-6836).
- New configuration option `clusterConfiguration.spec.ntp.autoConfigure`. This can be set to `false` to disable installing and configuring Chrony. (COPS-6282)

#### AWS

- Existing SecurityGroups can now be assigned to nodes, VPC endpoints, and the kube-apiserver ELB. See [AWS advanced install documentation][security-groups-configuration].
- Fix a bug where running `konvoy` may destroy machines when `subnetIDs` are specified. (COPS-6816)
- Fix a cluster configuration validation error that marked AWS GovCloud KMS ARNs as invalid. (COPS-6884)

#### vSphere

- Terraform `wait_for_guest_net_routable` is now set to `false` to allow for air-gapped installations.

### Upstream industry changes

The following sections refer to recent changes in the Open Source software DKP uses. That may require action on your part as part of an upgrade or installation of D2iQ software.

#### Docker hub rate limiting

Docker Hub announced an [update](https://www.docker.com/blog/scaling-docker-to-serve-millions-more-developers-network-egress/) to their image pull policies in August, 2020. The change results in the need to change cluster configurations to accommodate new account structures that enable image pull rate limiting.

Rate limiting happens on a per-pull basis regardless of whether the pulled image is owned by a paid user. This means D2iQ, as owner of most images used in Konvoy, does not have any influence as to whether your current address is rate-limited or not. Konvoy does not have a strict dependency on Docker Hub accounts or plans.

For more information on addressing this limit, see [Docker hub rate limits](../../operations/manage-docker-hub-rate-limits).

### KUDO Spark Operator Upgrade Prior to Konvoy Upgrade or Install

Custom Resource Definitions (CRD) of KUDO Spark Operator versions prior to 3.0.0-1.1.0 do not specify default values for `x-kubernetes-list-map-keys` properties and will fail validation on Kubernetes versions 1.18.x and later.

Perform these steps before upgrading or installing Konvoy to prevent or mitigate disruption of currently-running Spark jobs and invalidating Spark CRDs:

1. Wait for the KUDO Spark Operator jobs to finish, or terminate the running jobs.
1. [Uninstall the KUDO Spark Operator](/dkp/kommander/1.4/projects/platform-services/platform-services-catalog/kudo-spark/#uninstalling-the-spark-operator).
1. [Install the new KUDO Spark version](/dkp/kommander/1.4/projects/platform-services/platform-services-catalog/kudo-spark/#installation).
1. [Upgrade](../../upgrade) or [install](../../install) Konvoy.

### Component versions

<!-- vale Vale.Terms = NO -->

- Ansible 2.9.16.0
- Calico 3.17.3
- Cluster-autoscaler v0.5.0
- Containerd v1.3.9
- Docker v19.03.15
- EBS CSI 0.7.x
- Elastic Search 7.10.1
- Gatekeeper 3.4.0
- Go 1.16.2
- Helm v3.5.2
- Istio 1.9.1
- Kibana 7.9.3
- kubeaddons-dispatch stable-1.19-1.4.5
- kubeaddons-kommander stable-1.20-1.4.0
- kubernetes-base-addons stable-1.20-4.0.0
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

<!-- vale Vale.Terms = YES -->

## Additional resources

<!-- Add links to external documentation as needed -->

For information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[konvoy-doc]: ../../introduction
[kubernetes-doc]: https://kubernetes.io/docs/home/
[konvoy-vsphere]: ../../install/install-vsphere
[konvoy-control-plane-certificates]: ../../networking/control-plane-certificates/
[security-groups-configuration]: ../../install/install-aws/advanced-provisioning#security-groups
