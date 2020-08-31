---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 0
excerpt: View release-specific information for Konvoy
enterprise: false
beta: true
---

<!-- markdownlint-disable MD034 -->

## Release Notes

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Konvoy[/button]

**NOTE:** You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Konvoy.</p>

### Version v1.6.0-beta.0 - Released 27 August 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.16.x |
|**Maximum** | 1.17.x |
|**Default** | 1.17.11 |

#### Disclaimer

**IMPORTANT:** Upgrading from any previous version of Konvoy is not supported.

#### Improvements

- AWS: Update the default AWS AMIs to CentoOS 7.8.
- AWS: Use the CA bundle when `AWS_CA_BUNDLE` is set.
- Azure: Default worker VM Type changed to `Standard_D8s_v3`.
- Azure: Deletion of disk resources during Azure cluster destruction is now faster.
- CLI: Add support for providing a custom CA certificate for a docker registry.
- CLI: Allow installing with Containerd version `v1.3.7` or greater, in addition to the existing versions. (COPS-6315)
- CLI: Add Helm repository support when deploying addons.
- CLI: Add Helm v3 support when deploying addons.
- CLI: Add support for deploying RHEL 7.8.
- CLI: If available, pass `ClusterConfiguration` values when running `konvoy run playbook`.
- CLI: If present, automatically copy `extras/cloud-provider/cloud.conf` file to the remote machines and use the user provided configuration where needed in the Kubernetes cluster.
- CLI: New flag `--clean-local-volumes` that will automatically clean the data in the default Konvoy local volumes location `/mnt/disks/*/`.
- CLI: New command `konvoy destroy local-volumes` to clean the data in the default Konvoy local volumes location `/mnt/disks/*/`.
- CLI: Retry API requests during upgrades to prevent connection flakes causing an upgrade failure.
- CLI: Return correct pod status for upgrade safety checks.
- CLI: Provisioning cloud infrastructre now retries 1 time before giving up.
- CLI: Provisioning cloud infrastructure can now tear down newly created nodes during the provisioning stage when they are not healthy.
- CLI: If available, use host CA bundle when running `konvoy` on Linux. Set `KONVOY_DISABLE_HOST_CA=true` to go back to previous behavior of using the CA in the `konvoy` container.
- CLI: Remove support for Kubernetes 1.15.
- Ansible: The etcd metrics deployment task will now retry a total of 6 possible times and a total of 1 minute of delay time to provide extra settling time for the GCP cloud environment.
- Airgapped: Automatically import required GPG keys when installing local RPM packages.
- Diagnose: Collect the logs of previous restarted pods when running `konvoy diagnose`.
- Diagnose: `konvoy diagnose` now collects status from Helm 3 releases too (not just Helm 2)

#### Bug fixes

- AWS: Automatically determine the required setting for `skip_metadata_api_check` even when not explicitly set.
- GCP: Improve provisioning stability by using a deterministic imagefs block device name.
- CLI: Fix a bug during upgrades where certain pods deployed by konvoy, prevented nodes from being upgraded.
- Ansible: Rebuild Containerd RPM packages with `nokmem` accounting flag. (COPS-6465)
- Ansible: Fix a bug that prevents Containerd from starting when multiple `imageRegistries` are defined.
- Ansible: Fix a bug where installing on an onprem cluster would fail when configuring the chrony service.
- Ansible: Properly recover clusters when the first control-plane node is replaced. (COPS-6198)
- Autoscaling: Add support for basic authentication with `registry:2` Docker registry. (COPS-6370)
- Airgapped: Fix a bug where an air-gapped upgrade fails due to the missing `kubernetes-cni` package, when installing `kubeadm`.
- Airgapped: Include additional RPMs required for the Kubelet to install. (COPS-6345)
- Diagnose: Properly collect logs from `dispatch` and `istio-system` namespaces. (COPS-6294)

#### Component version changes

- Kubernetes `v1.17.11`
- Kommander `testing-1.17-1.2.0-beta.0`
- Autoprovisioning `v0.3.3`
- kubernetes-base-addons `testing-1.17-2.3.0`
- Calico `v3.13.5`
- Ansible `v2.7.18.0`
- Go `1.14.7`
- Helm `v3.3.0`
- Docker `v19.03.12`
- Terraform AWS plugin to `v2.70.x`

<!-- Add links to external documentation as needed -->

For information about installing and using Konvoy, see the [Konvoy documentation][konvoy-doc].

For information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[prometheus-rules]: https://github.com/helm/charts/tree/master/stable/prometheus-operator/templates/prometheus/rules
[konvoy-doc]:https://docs.d2iq.com/ksphere/konvoy
[kubernetes-doc]:https://kubernetes.io/docs/home/
