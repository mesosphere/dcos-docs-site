---
layout: layout.pug
navigationTitle: Release Notes Konvoy 1.6.0
title: Release Notes Konvoy 1.6.0
menuWeight: 0
excerpt: View release-specific information for Konvoy 1.6.0
beta: false
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ Konvoy version 1.6.0 was released on 16, November 2020.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

<p class="message--note"><strong>NOTE: </strong>A note on upgrading from 1.5.x to 1.6.1: There are some limitations upgrading to this Konvoy version due to the migration of Helm v2 to Helm v3 of large ConfigMaps to Helm v3 Secrets for Prometheus and the need to delete and redeploy this addon.
For more information, see <a href="../../addons/helmv2-to-v3-migration/">Helm v2 to v3 migration</a>.</p>

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.16.x |
|**Maximum** | 1.18.x |
|**Default** | 1.18.12 |

### Breaking changes

#### cert-manager upgrade

The cert-manager addon was updated to v1.0.3. This release removes support for the cert-manager v1alpha1 API.
If you are upgrading from a previous release, any cert-manager resources are automatically migrated from v1alpha1 to v1.
If your applications are using cert-manager, read the cert-manager upgrade documentation carefully to avoid interruptions in your applications.
Any resources you create through automated tasks or continuous delivery will need to be updated to use the new API.
Refer to this [upgrade documentation](../../upgrade/upgrade-kubernetes-addons/to-1.6) for information on updating your application deployments.

### Important changes

Docker Hub announced an [update](https://www.docker.com/blog/scaling-docker-to-serve-millions-more-developers-network-egress/) to their image pull policies in August, 2020. The change results in the need to change cluster configurations to accommodate new account structures that enable image pull rate limiting.

Rate limiting happens on a per-pull basis regardless of whether the pulled image is owned by a paid user. This means D2iQ, as owner of most images used in Konvoy, does not have any influence as to whether your current address is rate-limited or not. Konvoy does not have a strict dependency on Docker Hub accounts or plans.

For more information on addressing this limit, refer to this [procedure](../../operations/manage-docker-hub-rate-limits).

### New features and capabilities

#### Support for Helm 3.0.0

Konvoy 1.6 is now compatible with [Helm 3.0.0][helm_3] and includes all of its improved features and functionality. When you install or upgrade to Konvoy version 1.6, you automatically get Helm 3.0.0. Since Helm 3.0.0 removes the use of Tiller, it will no longer be used in Konvoy and can be deleted.

#### Extensive documentation improvements

Invested extensive effort related to updating, improving, and expanding the existing technical content around Konvoy. This includes restructuring existing content, adding more information related to Storage options, Authentication and Access, and other sections of the content. For more information, browse this documentation.

#### CLI

- Added support for deploying RHEL/Centos 7.8.
- Added support for deploying RHEL/Centos 8.2.
- Removed support for Kubernetes 1.15.
- Improved the reliability when interacting with Docker with `konvoy config images`, by adding retries where needed.
- Added new check to validate system times on the nodes in the cluster are within 30 seconds.
- No longer include internal `controlplane` and `bastion` when generating a sample `inventory.yaml` file.
- Added support for providing a custom CA certificate for a Docker registry.
- Enabled installing with Containerd version `v1.3.7` or greater, in addition to the existing versions. (COPS-6315)
- Enabled the ability to pass `ClusterConfiguration` values (if available), when running `konvoy run playbook`.
- Will now automatically copy `extras/cloud-provider/cloud.conf` file (if present) to the remote machines and use the user provided configuration where needed in the Kubernetes cluster.
- Added a new flag, `--clean-local-volumes`, that will automatically clean the data in the default Konvoy local volumes location `/mnt/disks/*/`.
- Added a new command, `konvoy destroy local-volumes`, to clean the data in the default Konvoy local volumes location `/mnt/disks/*/`.
- Implemented the retry of API requests during upgrades to prevent connection flakes causing an upgrade failure.
- Return correct pod status for upgrade safety checks.
- Set up the provisioning cloud infrastructure to retry one time before giving up.
- Enabled the provisioning cloud infrastructure to tear down newly created nodes during the provisioning stage if they are not healthy.
- If available, will now use host CA bundle when running `konvoy` on Linux. Set `KONVOY_DISABLE_HOST_CA=true` to go back to previous behavior of using the CA in the `konvoy` container.
- Removed the need to run `konvoy pull` (in most cases) by pulling the remote cluster state (if available) before runnning `konvoy` commands.
- Allows installing with Containerd version `v1.3.7` or greater, in addition to the existing versions. (COPS-6315)
- Added Helm repository support when deploying addons.
- Added Helm v3 support when deploying addons.
- If available, will pass `ClusterConfiguration` values when running `konvoy run playbook`.
- If present, will automatically copy `extras/cloud-provider/cloud.conf` file to the remote machines and use the user provided configuration where needed in the Kubernetes cluster.
- Added new flag `--clean-local-volumes` that will automatically clean the data in the default Konvoy local volumes location `/mnt/disks/*/`.
- Added new command `konvoy destroy local-volumes` to clean the data in the default Konvoy local volumes location `/mnt/disks/*/`.
- Enabled ability to retry API requests during upgrades to prevent connection flakes causing an upgrade failure.
- Implemented the return of the correct pod status for upgrade safety checks.
- Provisioning cloud infrastructre now retries one time before giving up.
- Provisioning cloud infrastructure can now tear down newly created nodes during the provisioning stage when they are not healthy.
- Fixed a bug during upgrades where certain pods deployed by konvoy, prevented nodes from being upgraded.
- Fixed a bug `unable to create context store: $HOME is not defined` caused by a recent Docker change by passing the environment variables from the host when running the Konvoy container.
- Delete hidden files when cleaning up local volumes with `--clean-local-volumes`.
- Fixed propagation of flag force-push when running `konvoy up --force-push`.
- Fixed a bug in configuration validation that prevented using an existing internet gateway when using a bastion host.
- Fixed missing propagation of flag `--force-push` when running `konvoy up --force-push`.

#### API

- Added ability to override the OS distribution discovered by Ansible by setting `os.assumeOperatingSystemDistribution` in the `cluster.yaml`.
- Added a new field, `spec.kubernetes.kube-reserved`, that can be used to define the resources to reserve on all of the kubelets in the cluster.

#### Ansible

- Increased the number of retries when checking kubelet status during the kubernetes deployment workflow.
- Spurious errors about a failure to cleanup the boostrap_token are no longer reported during `kubeadm init` rescue tasks.
- When installing Containerd `v1.2.13`, Konvoy uses the same `d2iq` RPM repo that is already being used for Containerd `v1.3.x`. This repo provides packages built with the `nokmem` build flag enabled.(COPS-6465)
- The etcd metrics deployment task will now retry a total of six possible times and a total of one minute of delay time to provide extra settling time for the GCP cloud environment.
- Rebuilt Containerd RPM packages with `nokmem` accounting flag. (COPS-6465)
- Fixed a bug that prevents Containerd from starting when multiple `imageRegistries` are defined.
- Fixed a bug where installing on an onprem cluster would fail when configuring the chrony service.
- Will properly recover clusters when the first control-plane node is replaced. (COPS-6198)
- Fixed multiple `[WARNING]` messages that were displayed during execution.
- Now will properly recover clusters when the first control-plane node is replaced. (COPS-6198)
- Fixed unique hostname preflight task failure. (COPS-6409, COPS-6428)

#### Terraform

- Fixed an issue preventing AWS ELBs from being tagged according to their corresponding Service annotations. (COPS-6482)

#### Autoscaling

- Added support for basic authentication with `registry:2` Docker registry. (COPS-6370)

#### Airgapped

- Will set `disable_gpg_check: yes` when installing Nvidia RPM packages, to avoid GPG failures. This is already the behavior when installing the packages from the Nvidia repo. (COPS-6474)
- Now automatically imports required GPG keys when installing local RPM packages (COPS-6474).
- The release includes the artifacts for Darwin (MacOS).
- Fixed a bug where an air-gapped upgrade fails due to the missing `kubernetes-cni` package, when installing `kubeadm`.
- Included additional RPMs required for the Kubelet to install. (COPS-6345)
- Add support for different `addonRepository` images for different addons repositories.
- Fix an issue where the wrong `Addon` and `ClusterAddon` resources were being deployed, causing missing chart errors.
- Support seeding additional docker images from `extras/images` in the working directory.

#### AWS

- Updated the default AWS AMIs to CentoOS 7.8.
- Added ability to use the CA bundle when `AWS_CA_BUNDLE` environment variable is set.
- Will automatically determine the required setting for `skip_metadata_api_check` even when not explicitly set.
- The provisioner will now wait five minutes instead of two minutes for the Gateway Route to be created and avoid timeout issues.
- Now will automatically determine the required setting for `skip_metadata_api_check` even when not explicitly set.
- New `vpc.cidr` option in `cluster.yaml` to change the default VPC CIDR block.

#### Azure

- Default worker VM Type changed to `Standard_D8s_v3`.
- Deletion of disk resources during Azure cluster destruction is now faster.
- New `vnet.cidr` option in `cluster.yaml` to change the default the CIDR for the virtual network address space.

#### GCP

- The kube-apiserver load balancer timeouts were increased to improve stability: timeout 1s->3s, check interval 1s -> 2s, healthy threashold 2->3, unhealthy treshold 2->3.
- Improved provisioning stability by using a deterministic imagefs block device name.

#### Addons

- Fixed an issue where cert-manager and fluenbit prevented upgrades from previous versions of Konvoy.
- Added support for cert-manager v1 api resources.
- Removed the Conductor addon.

#### Kommander

- Added support for attaching airgapped Kubernetes clusters.
- Fixed a race condition that would prevent the addon from being installed due to unbound PVCs.

#### Diagnose

- Fixed possible exception when running `konvoy diagnose`.
- Will collect loaded kernel modules.
- Will collect PCI devices data.
- Will collect Containerd configuration.
- Will collect Nvidia container runtime configuration.
- Will collect the kubeadm cert expiration data.
- Will collect the logs of previous restarted pods.
- Will collect helm3 releases in addition to helm2 releases.
- Will collect logs from `dispatch` and `istio-system` namespaces. (COPS-6294)

#### Kubeaddons

- The kubeaddons-controller no longer installs Tiller.

#### Component versions

- Ansible v2.9.14.0
- Calico v3.16.4
- Cluster-autoscaler v0.2.4
- Containerd v1.3.9
- Docker v19.03.12
- Go 1.14.7
- Helm v3.3.1
- kubeaddons-dispatch stable-1.18-1.3.0
- kubeaddons-kommander stable-1.18-1.2.0
- kubernetes-base-addons stable-1.18-3.0.1
- Kubernetes v1.18.12
- Kubeaddons v0.23.2
- Mitogen a60c6c14a2473c895162a1b58a81bad0e63d1718
- Terraform v0.13.5
- Terraform AWS plugin ~> 3.0
- Terraform Azure plugin ~> 2.31
- Terraform GCP plugin ~> 3.42

<!--
##### Previous releases
Add links to previous release notes
-->

##### Additional resources

<!-- Add links to external documentation as needed -->

For information about installing and using Konvoy, see the [Konvoy documentation][konvoy-doc].

For information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[prometheus-rules]: https://github.com/mesosphere/charts/tree/master/staging/prometheus-operator/templates/prometheus/rules
[konvoy-doc]: ../../index.md
[kubernetes-doc]: https://kubernetes.io/docs/home/
[helm_3]: https://helm.sh/blog/helm-3-released/
